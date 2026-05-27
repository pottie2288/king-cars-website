import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'pottie2288@gmail.com',
      subject: `New Sell Request — ${data.year} ${data.make} ${data.model}`,
      html: `
        <h2 style="color:#1a3a5c;">New Car Valuation Request</h2>
        <h3>Vehicle</h3>
        <table cellpadding="6">
          <tr><td><strong>Year</strong></td><td>${data.year}</td></tr>
          <tr><td><strong>Make</strong></td><td>${data.make}</td></tr>
          <tr><td><strong>Model</strong></td><td>${data.model}</td></tr>
          <tr><td><strong>Mileage</strong></td><td>${data.mileage} km</td></tr>
          <tr><td><strong>Condition</strong></td><td>${data.condition || 'Not specified'}</td></tr>
        </table>
        <h3>Contact</h3>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
        </table>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('sell-car email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
