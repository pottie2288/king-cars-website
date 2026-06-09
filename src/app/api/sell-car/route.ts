import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const year      = data.get('year')      as string;
    const make      = data.get('make')      as string;
    const model     = data.get('model')     as string;
    const mileage   = data.get('mileage')   as string;
    const condition = data.get('condition') as string;
    const name      = data.get('name')      as string;
    const email     = data.get('email')     as string;
    const phone     = data.get('phone')     as string;

    const attachments: { filename: string; content: Buffer }[] = [];
    for (let i = 0; i < 5; i++) {
      const file = data.get(`photo_${i}`) as File | null;
      if (file && file.size > 0) {
        const buf = await file.arrayBuffer();
        attachments.push({ filename: file.name, content: Buffer.from(buf) });
      }
    }

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'kruger@kingcars.co.za',
      cc: ['vanzyl@kingcars.co.za', 'pottie2288@gmail.com'],
      subject: `New Sell Request — ${year} ${make} ${model}`,
      html: `
        <h2 style="color:#1a3a5c;">New Car Valuation Request</h2>
        <h3>Vehicle</h3>
        <table cellpadding="6">
          <tr><td><strong>Year</strong></td><td>${year}</td></tr>
          <tr><td><strong>Make</strong></td><td>${make}</td></tr>
          <tr><td><strong>Model</strong></td><td>${model}</td></tr>
          <tr><td><strong>Mileage</strong></td><td>${mileage} km</td></tr>
          <tr><td><strong>Condition</strong></td><td>${condition || 'Not specified'}</td></tr>
        </table>
        <h3>Contact</h3>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${name}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
        </table>
        ${attachments.length > 0 ? `<p><em>${attachments.length} photo(s) attached.</em></p>` : ''}
      `,
      ...(attachments.length > 0 && { attachments }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('sell-car email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
