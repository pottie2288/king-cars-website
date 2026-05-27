import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'pottie2288@gmail.com',
      subject: `${data.reason} from ${data.firstName} ${data.lastName}`,
      html: `
        <h2 style="color:#1a3a5c;">New ${data.reason}</h2>
        <table cellpadding="6">
          <tr><td><strong>Name</strong></td><td>${data.firstName} ${data.lastName}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
          <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
        </table>
        <h3>Description</h3>
        <p>${data.description}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('complaints email error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
