import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const to = data.location === 'Eastern Cape'
      ? 'divan@kingcars.co.za'
      : 'andresadie@kingcars.co.za';

    await sendEmail({
      to,
      cc: 'pottie2288@gmail.com',
      subject: `Car Enquiry — ${data.car}`,
      html: `
        <h2 style="color:#1a3a5c;">New Car Enquiry</h2>
        <table cellpadding="6">
          <tr><td><strong>Vehicle</strong></td><td>${data.car}</td></tr>
          <tr><td><strong>Price</strong></td><td>R ${Number(data.price).toLocaleString('en-ZA')}</td></tr>
          <tr><td><strong>Stock #</strong></td><td>${data.stockCode}</td></tr>
          <tr><td><strong>Province</strong></td><td>${data.location}</td></tr>
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
