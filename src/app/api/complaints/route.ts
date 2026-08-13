import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';
import { validateSAPhone, validateEmail, validateText, FIELD_LIMITS } from '@/lib/validation';
import { escapeHtml, escapeHtmlMultiline, safeSubject, coerceField } from '@/lib/sanitize';
import { checkRateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { collectAttachments, AttachmentError } from '@/lib/attachments';

/** The toggle offers exactly these two — anything else is a forged request. */
const VALID_REASONS = new Set(['Compliment', 'Complaint']);

export async function POST(request: Request) {
  const rate = checkRateLimit(getClientKey(request, 'complaints'));
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSeconds);

  try {
    const data = await request.formData();

    const firstName   = coerceField(data.get('firstName'), FIELD_LIMITS.firstName);
    const lastName    = coerceField(data.get('lastName'), FIELD_LIMITS.lastName);
    const phone       = coerceField(data.get('phone'), 32);
    const email       = coerceField(data.get('email'), 254);
    const description = coerceField(data.get('description'), FIELD_LIMITS.description);
    const rawReason   = coerceField(data.get('reason'), 20);
    const reason      = VALID_REASONS.has(rawReason) ? rawReason : 'Complaint';

    const firstNameCheck   = validateText(firstName, 'First name', FIELD_LIMITS.firstName);
    const lastNameCheck    = validateText(lastName, 'Last name', FIELD_LIMITS.lastName);
    const descriptionCheck = validateText(description, 'Description', FIELD_LIMITS.description, { minLength: 10 });
    const phoneCheck       = validateSAPhone(phone);
    const emailCheck       = validateEmail(email);

    const failure = [firstNameCheck, lastNameCheck, emailCheck, phoneCheck, descriptionCheck]
      .find(c => !c.valid);
    if (failure) {
      return NextResponse.json({ success: false, error: failure.error }, { status: 400 });
    }

    let attachments;
    try {
      attachments = await collectAttachments(data, ['attachment1', 'attachment2']);
    } catch (error) {
      if (error instanceof AttachmentError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      throw error;
    }

    await sendEmail({
      to: 'pierre@kingcars.co.za',
      cc: 'pottie2288@gmail.com',
      subject: safeSubject(`${reason} from ${firstName} ${lastName}`),
      html: `
        <h2 style="color:#1a3a5c;">New ${escapeHtml(reason)}</h2>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(`${firstName} ${lastName}`)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phoneCheck.normalized)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(emailCheck.normalized)}</td></tr>
        </table>
        <h3>Description</h3>
        <p style="white-space:pre-wrap;">${escapeHtmlMultiline(description)}</p>
        ${attachments.length > 0 ? `<p><em>${attachments.length} file(s) attached.</em></p>` : ''}
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('complaints email error:', error);
    return NextResponse.json(
      { success: false, error: 'We couldn’t submit your message. Please try again or call us on 083 500 8181.' },
      { status: 500 }
    );
  }
}
