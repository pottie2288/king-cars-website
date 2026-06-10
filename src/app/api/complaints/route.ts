import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/brevo';

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    const firstName   = data.get('firstName')   as string;
    const lastName    = data.get('lastName')    as string;
    const phone       = data.get('phone')       as string;
    const email       = data.get('email')       as string;
    const description = data.get('description') as string;
    const reason      = data.get('reason')      as string;

    const attachments: { filename: string; content: Buffer }[] = [];
    for (const key of ['attachment1', 'attachment2']) {
      const file = data.get(key) as File | null;
      if (file && file.size > 0) {
        const buf = await file.arrayBuffer();
        attachments.push({ filename: file.name, content: Buffer.from(buf) });
      }
    }

    await sendEmail({
      to: 'pierre@kingcars.co.za',
      cc: 'pottie2288@gmail.com',
      subject: `${reason} from ${firstName} ${lastName}`,
      html: `
        <h2 style="color:#1a3a5c;">New ${reason}</h2>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${firstName} ${lastName}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        </table>
        <h3>Description</h3>
        <p>${description}</p>
        ${attachments.length > 0 ? `<p><em>${attachments.length} file(s) attached.</em></p>` : ''}
      `,
      attachments,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('complaints email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
