import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'pottie2288@gmail.com',
      subject: `Car Enquiry — ${data.car}`,
      html: `
        <h2 style="color:#1a3a5c;">New Car Enquiry</h2>
        <table cellpadding="6">
          <tr><td><strong>Vehicle</strong></td><td>${data.car}</td></tr>
          <tr><td><strong>Price</strong></td><td>R ${Number(data.price).toLocaleString('en-ZA')}</td></tr>
          <tr><td><strong>Car ID</strong></td><td>${data.carId}</td></tr>
        </table>
        <h3>Customer</h3>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
        </table>
        <h3>Message</h3>
        <p>${data.message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('enquiry email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
