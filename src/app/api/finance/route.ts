import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    await sendEmail({
      to: 'pottie2288@gmail.com',
      subject: `Finance Application — ${data.fullName}`,
      html: `
        <h2 style="color:#1a3a5c;">New Finance Application</h2>
        <h3>Personal Details</h3>
        <table cellpadding="6">
          <tr><td><strong>Full Name</strong></td><td>${data.fullName}</td></tr>
          <tr><td><strong>ID Number</strong></td><td>${data.idNumber}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
          <tr><td><strong>Marital Status</strong></td><td>${data.maritalStatus}</td></tr>
        </table>
        <h3>Employment</h3>
        <table cellpadding="6">
          <tr><td><strong>Employment Type</strong></td><td>${data.employmentType}</td></tr>
          <tr><td><strong>Employer</strong></td><td>${data.employerName}</td></tr>
          <tr><td><strong>Occupation</strong></td><td>${data.occupation}</td></tr>
          <tr><td><strong>Work Phone</strong></td><td>${data.workPhone}</td></tr>
          <tr><td><strong>Net Income</strong></td><td>R ${data.netIncome}</td></tr>
          <tr><td><strong>Monthly Expenses</strong></td><td>R ${data.totalExpenses}</td></tr>
        </table>
        <h3>Banking & Address</h3>
        <table cellpadding="6">
          <tr><td><strong>Bank</strong></td><td>${data.bankName}</td></tr>
          <tr><td><strong>Address</strong></td><td>${data.physicalAddress}</td></tr>
        </table>
        <h3>Consents</h3>
        <table cellpadding="6">
          <tr><td><strong>POPIA Consent</strong></td><td>${data.popiaConsent ? 'Yes' : 'No'}</td></tr>
          <tr><td><strong>Credit Check Authorized</strong></td><td>${data.creditConsent ? 'Yes' : 'No'}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('finance email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
