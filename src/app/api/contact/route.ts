import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';
import { validateSAPhone, validateEmail, validateText, FIELD_LIMITS } from '@/lib/validation';
import { escapeHtml, escapeHtmlMultiline, safeSubject, coerceField } from '@/lib/sanitize';
import { checkRateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rate = checkRateLimit(getClientKey(request, 'contact'));
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSeconds);

  try {
    const data = await request.json();

    // Cap every field before validating, so an oversized payload can never be
    // echoed into an inbox even if it somehow passes the checks below.
    const name = coerceField(data.name, FIELD_LIMITS.name);
    const email = coerceField(data.email, 254);
    const phone = coerceField(data.phone, 32);
    const message = coerceField(data.message, FIELD_LIMITS.message);

    const nameCheck = validateText(name, 'Full name', FIELD_LIMITS.name);
    const messageCheck = validateText(message, 'Message', FIELD_LIMITS.message, { minLength: 5 });
    const phoneCheck = validateSAPhone(phone);
    const emailCheck = validateEmail(email);

    const failure = [nameCheck, emailCheck, phoneCheck, messageCheck].find(c => !c.valid);
    if (failure) {
      return NextResponse.json({ success: false, error: failure.error }, { status: 400 });
    }

    await sendEmail({
      to: 'info@kingcars.co.za',
      cc: 'pottie2288@gmail.com',
      subject: safeSubject(`Contact Enquiry — ${name}`),
      html: `
        <h2 style="color:#1a3a5c;">New Contact Enquiry</h2>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(emailCheck.normalized)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phoneCheck.normalized)}</td></tr>
        </table>
        <h3>Message</h3>
        <p style="white-space:pre-wrap;">${escapeHtmlMultiline(message)}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('contact email error:', error);
    return NextResponse.json(
      { success: false, error: 'We couldn’t send your message. Please try again or call us on 083 500 8181.' },
      { status: 500 }
    );
  }
}
