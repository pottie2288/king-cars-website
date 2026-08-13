import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';
import { validateSAPhone, validateEmail, validateText, FIELD_LIMITS } from '@/lib/validation';
import { escapeHtml, escapeHtmlMultiline, safeSubject, coerceField } from '@/lib/sanitize';
import { checkRateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rate = checkRateLimit(getClientKey(request, 'enquiry'));
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSeconds);

  try {
    const data = await request.json();

    const name = coerceField(data.name, FIELD_LIMITS.name);
    const email = coerceField(data.email, 254);
    const phone = coerceField(data.phone, 32);
    const message = coerceField(data.message, FIELD_LIMITS.message);

    // Vehicle context is chosen by the page, not typed — cap and encode it
    // anyway, since it arrives in the request body and is therefore editable.
    const car = coerceField(data.car, 120);
    const stockCode = coerceField(data.stockCode, 40);
    const location = coerceField(data.location, 40);
    const priceValue = Number(data.price);
    const price = Number.isFinite(priceValue) && priceValue >= 0
      ? `R ${priceValue.toLocaleString('en-ZA')}`
      : 'Not specified';

    const nameCheck = validateText(name, 'Full name', FIELD_LIMITS.name);
    const phoneCheck = validateSAPhone(phone);
    const emailCheck = validateEmail(email);

    const failure = [nameCheck, emailCheck, phoneCheck].find(c => !c.valid);
    if (failure) {
      return NextResponse.json({ success: false, error: failure.error }, { status: 400 });
    }

    const isEasternCape = location === 'Eastern Cape';
    const to = isEasternCape ? 'divan@kingcars.co.za' : 'izzy@kingcars.co.za';
    const cc = isEasternCape
      ? 'pottie2288@gmail.com'
      : ['vanzyl@kingcars.co.za', 'pottie2288@gmail.com'];

    await sendEmail({
      to,
      cc,
      subject: safeSubject(`Car Enquiry — ${car}`),
      html: `
        <h2 style="color:#1a3a5c;">New Car Enquiry</h2>
        <table cellpadding="6">
          <tr><td><strong>Vehicle</strong></td><td>${escapeHtml(car)}</td></tr>
          <tr><td><strong>Price</strong></td><td>${escapeHtml(price)}</td></tr>
          <tr><td><strong>Stock #</strong></td><td>${escapeHtml(stockCode)}</td></tr>
          <tr><td><strong>Province</strong></td><td>${escapeHtml(location)}</td></tr>
        </table>
        <h3>Customer</h3>
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
    console.error('enquiry email error:', error);
    return NextResponse.json(
      { success: false, error: 'We couldn’t send your enquiry. Please try again or WhatsApp us instead.' },
      { status: 500 }
    );
  }
}
