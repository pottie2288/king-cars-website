import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';
import {
  validateSAPhone,
  validateEmail,
  validateText,
  validateNumber,
  FIELD_LIMITS,
  NUMERIC_LIMITS,
} from '@/lib/validation';
import { escapeHtml, safeSubject, coerceField } from '@/lib/sanitize';
import { checkRateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { collectAttachments, AttachmentError } from '@/lib/attachments';

const PHOTO_FIELDS = ['photo_0', 'photo_1', 'photo_2', 'photo_3', 'photo_4'] as const;

/** Oldest model year we accept, matching the dropdown's 25-year range. */
const MIN_YEAR = new Date().getFullYear() - 40;

export async function POST(request: Request) {
  const rate = checkRateLimit(getClientKey(request, 'sell-car'));
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSeconds);

  try {
    const data = await request.formData();

    const year      = coerceField(data.get('year'), 4);
    const make      = coerceField(data.get('make'), FIELD_LIMITS.make);
    const model     = coerceField(data.get('model'), FIELD_LIMITS.model);
    const mileage   = coerceField(data.get('mileage'), 10);
    const condition = coerceField(data.get('condition'), 40);
    const name      = coerceField(data.get('name'), FIELD_LIMITS.name);
    const email     = coerceField(data.get('email'), 254);
    const phone     = coerceField(data.get('phone'), 32);
    const location  = coerceField(data.get('location'), 40);

    const yearCheck    = validateNumber(year, 'Year', { min: MIN_YEAR, max: new Date().getFullYear() + 1 });
    const makeCheck    = validateText(make, 'Make', FIELD_LIMITS.make);
    const modelCheck   = validateText(model, 'Model', FIELD_LIMITS.model);
    const mileageCheck = validateNumber(mileage, 'Mileage', NUMERIC_LIMITS.mileage);
    const nameCheck    = validateText(name, 'Full name', FIELD_LIMITS.name);
    const phoneCheck   = validateSAPhone(phone);
    const emailCheck   = validateEmail(email);

    const failure = [yearCheck, makeCheck, modelCheck, mileageCheck, nameCheck, emailCheck, phoneCheck]
      .find(c => !c.valid);
    if (failure) {
      return NextResponse.json({ success: false, error: failure.error }, { status: 400 });
    }

    let attachments;
    try {
      attachments = await collectAttachments(data, PHOTO_FIELDS);
    } catch (error) {
      if (error instanceof AttachmentError) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
      throw error;
    }

    const mileageDisplay = Number(mileageCheck.normalized).toLocaleString('en-ZA');

    await sendEmail({
      to: 'kruger@kingcars.co.za',
      cc: ['vanzyl@kingcars.co.za', 'pottie2288@gmail.com'],
      subject: safeSubject(`New Sell Request — ${year} ${make} ${model}`),
      html: `
        <h2 style="color:#1a3a5c;">New Car Valuation Request</h2>
        <h3>Vehicle</h3>
        <table cellpadding="6">
          <tr><td><strong>Year</strong></td><td>${escapeHtml(year)}</td></tr>
          <tr><td><strong>Make</strong></td><td>${escapeHtml(make)}</td></tr>
          <tr><td><strong>Model</strong></td><td>${escapeHtml(model)}</td></tr>
          <tr><td><strong>Mileage</strong></td><td>${escapeHtml(mileageDisplay)} km</td></tr>
          <tr><td><strong>Condition</strong></td><td>${escapeHtml(condition || 'Not specified')}</td></tr>
        </table>
        <h3>Contact</h3>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(emailCheck.normalized)}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phoneCheck.normalized)}</td></tr>
          <tr><td><strong>Region</strong></td><td>${escapeHtml(location || 'Not specified')}</td></tr>
        </table>
        ${attachments.length > 0 ? `<p><em>${attachments.length} photo(s) attached.</em></p>` : ''}
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('sell-car email error:', error);
    return NextResponse.json(
      { success: false, error: 'We couldn’t submit your valuation request. Please try again or call us on 083 500 8181.' },
      { status: 500 }
    );
  }
}
