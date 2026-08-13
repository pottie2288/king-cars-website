interface BrevoAttachment {
  filename: string;
  content: Buffer;
}

interface SendEmailOptions {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: BrevoAttachment[];
}

export async function sendEmail({ to, cc, subject, html, attachments }: SendEmailOptions) {
  // Fail loudly and early: a missing key would otherwise surface as an opaque
  // 401 from Brevo, which reads like a transient outage rather than a
  // misconfigured deployment.
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured — cannot send lead email');
  }

  const toArr = Array.isArray(to) ? to : [to];
  const ccArr = cc ? (Array.isArray(cc) ? cc : [cc]) : undefined;

  const body: Record<string, unknown> = {
    sender: { name: 'King Cars', email: 'noreply@kingcars.co.za' },
    to: toArr.map(email => ({ email })),
    subject,
    htmlContent: html,
  };

  if (ccArr) body.cc = ccArr.map(email => ({ email }));

  if (attachments && attachments.length > 0) {
    body.attachment = attachments.map(a => ({
      name: a.filename,
      content: a.content.toString('base64'),
    }));
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
}
