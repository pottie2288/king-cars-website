import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';
import {
  validateSAPhone,
  validateEmail,
  validateText,
  validateNumber,
  isValidSAID,
  FIELD_LIMITS,
  NUMERIC_LIMITS,
} from '@/lib/validation';
import { escapeHtml, escapeHtmlMultiline, safeSubject, coerceField } from '@/lib/sanitize';
import { checkRateLimit, getClientKey, rateLimitResponse } from '@/lib/rate-limit';
import { PERSONAL_BANKS } from '@/data/banks';

/** A finance application is a considered act — one every 10 minutes is plenty. */
const FINANCE_LIMIT = { limit: 3, windowMs: 10 * 60 * 1000 };

const VALID_BANK_IDS = new Set(PERSONAL_BANKS.map(b => b.id));

export async function POST(request: Request) {
  const rate = checkRateLimit(getClientKey(request, 'finance'), FINANCE_LIMIT);
  if (!rate.allowed) return rateLimitResponse(rate.retryAfterSeconds);

  try {
    const data = await request.json();

    const fullName        = coerceField(data.fullName, FIELD_LIMITS.name);
    const idNumber        = coerceField(data.idNumber, 20);
    const email           = coerceField(data.email, 254);
    const phone           = coerceField(data.phone, 32);
    const workPhone       = coerceField(data.workPhone, 32);
    const maritalStatus   = coerceField(data.maritalStatus, 30);
    const province        = coerceField(data.province, 40);
    const employmentType  = coerceField(data.employmentType, 30);
    const employerName    = coerceField(data.employerName, FIELD_LIMITS.employerName);
    const occupation      = coerceField(data.occupation, FIELD_LIMITS.occupation);
    const netIncome       = coerceField(data.netIncome, 12);
    const totalExpenses   = coerceField(data.totalExpenses, 12);
    const physicalAddress = coerceField(data.physicalAddress, FIELD_LIMITS.address);
    const bankName        = coerceField(data.bankName, 40);
    const bankNameOther   = coerceField(data.bankNameOther, FIELD_LIMITS.bankOther);

    const checks = [
      validateText(fullName, 'Full name', FIELD_LIMITS.name, { minLength: 3 }),
      validateEmail(email),
      validateSAPhone(phone),
      validateSAPhone(workPhone),
      validateText(employerName, 'Employer name', FIELD_LIMITS.employerName),
      validateText(occupation, 'Occupation', FIELD_LIMITS.occupation),
      validateNumber(netIncome, 'Monthly net income', NUMERIC_LIMITS.netIncome),
      validateNumber(totalExpenses, 'Total monthly expenses', NUMERIC_LIMITS.totalExpenses),
      validateText(physicalAddress, 'Residential address', FIELD_LIMITS.address, { minLength: 10 }),
    ];

    const failure = checks.find(c => !c.valid);
    if (failure) {
      return NextResponse.json({ success: false, error: failure.error }, { status: 400 });
    }

    if (!isValidSAID(idNumber)) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid 13-digit SA ID number' },
        { status: 400 }
      );
    }

    if (!maritalStatus || !province || !employmentType) {
      return NextResponse.json(
        { success: false, error: 'Please complete every dropdown before submitting' },
        { status: 400 }
      );
    }

    if (!VALID_BANK_IDS.has(bankName)) {
      return NextResponse.json(
        { success: false, error: 'Please select your bank from the list' },
        { status: 400 }
      );
    }

    // "Other" is only meaningful with the bank actually named alongside it.
    if (bankName === 'other') {
      const otherCheck = validateText(bankNameOther, 'Bank name', FIELD_LIMITS.bankOther);
      if (!otherCheck.valid) {
        return NextResponse.json({ success: false, error: otherCheck.error }, { status: 400 });
      }
    }

    if (data.popiaConsent !== true || data.creditConsent !== true) {
      return NextResponse.json(
        { success: false, error: 'Both consent boxes must be ticked before we can process your application' },
        { status: 400 }
      );
    }

    const bankLabel = bankName === 'other'
      ? `Other — ${bankNameOther}`
      : PERSONAL_BANKS.find(b => b.id === bankName)?.name ?? bankName;

    const formatRand = (value: string) => `R ${Number(value).toLocaleString('en-ZA')}`;

    await sendEmail({
      to: 'izzy@kingcars.co.za',
      cc: ['vanzyl@kingcars.co.za', 'pottie2288@gmail.com'],
      subject: safeSubject(`Finance Application — ${fullName}`),
      html: `
        <h2 style="color:#1a3a5c;">New Finance Application</h2>
        <h3>Personal Details</h3>
        <table cellpadding="6">
          <tr><td><strong>Full Name</strong></td><td>${escapeHtml(fullName)}</td></tr>
          <tr><td><strong>ID Number</strong></td><td>${escapeHtml(idNumber)}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email.toLowerCase())}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><strong>Marital Status</strong></td><td>${escapeHtml(maritalStatus)}</td></tr>
          <tr><td><strong>Region</strong></td><td>${escapeHtml(province)}</td></tr>
        </table>
        <h3>Employment</h3>
        <table cellpadding="6">
          <tr><td><strong>Employment Type</strong></td><td>${escapeHtml(employmentType)}</td></tr>
          <tr><td><strong>Employer</strong></td><td>${escapeHtml(employerName)}</td></tr>
          <tr><td><strong>Occupation</strong></td><td>${escapeHtml(occupation)}</td></tr>
          <tr><td><strong>Work Phone</strong></td><td>${escapeHtml(workPhone)}</td></tr>
          <tr><td><strong>Net Income</strong></td><td>${escapeHtml(formatRand(netIncome))}</td></tr>
          <tr><td><strong>Monthly Expenses</strong></td><td>${escapeHtml(formatRand(totalExpenses))}</td></tr>
        </table>
        <h3>Banking &amp; Address</h3>
        <table cellpadding="6">
          <tr><td><strong>Bank</strong></td><td>${escapeHtml(bankLabel)}</td></tr>
          <tr><td><strong>Address</strong></td><td>${escapeHtmlMultiline(physicalAddress)}</td></tr>
        </table>
        <h3>Consents</h3>
        <table cellpadding="6">
          <tr><td><strong>POPIA Consent</strong></td><td>Yes</td></tr>
          <tr><td><strong>Credit Check Authorized</strong></td><td>Yes</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('finance email error:', error);
    return NextResponse.json(
      { success: false, error: 'We couldn’t submit your application. Please try again or call us on 083 500 8181.' },
      { status: 500 }
    );
  }
}
