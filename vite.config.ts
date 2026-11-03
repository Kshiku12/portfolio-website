import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tls from 'node:tls';
import https from 'node:https';

const TARGET_EMAIL = 'kshitij.verma302312@gmail.com';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPersonalEmailHtml(name: string, email: string, message: string): string {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');

  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.65; color: #111827; max-width: 640px;">
  <p style="margin: 0 0 16px 0;">Hi Kshitij,</p>
  <p style="margin: 0 0 22px 0;">${safeMessage}</p>
  <p style="margin: 0; color: #374151;">
    Best regards,<br />
    <strong>${safeName}</strong><br />
    <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a>
  </p>
</div>`;
}

function sendViaGmailSmtp(opts: {
  gmailUser: string;
  gmailAppPassword: string;
  senderName: string;
  senderEmail: string;
  message: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(465, 'smtp.gmail.com', { servername: 'smtp.gmail.com' });
    let step = 0;
    let buffer = '';

    const cleanName = opts.senderName.replace(/[\r\n"]/g, '').trim();
    const cleanEmail = opts.senderEmail.replace(/[\r\n<>]/g, '').trim();
    const subject = `Message from ${cleanName} (${cleanEmail})`;
    const htmlBody = buildPersonalEmailHtml(cleanName, cleanEmail, opts.message);

    const msgId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@gmail.com>`;
    const mimeMessage = [
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: ${msgId}`,
      `From: "${cleanName}" <${opts.gmailUser}>`,
      `To: <${TARGET_EMAIL}>`,
      `Reply-To: "${cleanName}" <${cleanEmail}>`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlBody.replace(/^\./gm, '..'),
      '.',
      '',
    ].join('\r\n');

    const sendLine = (line: string) => {
      socket.write(line + '\r\n');
    };

    socket.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.length < 4 || line[3] === '-') continue;
        const code = parseInt(line.slice(0, 3), 10);
        if (code >= 400) {
          socket.end();
          return reject(new Error(`SMTP Error: ${line}`));
        }

        if (step === 0 && code === 220) {
          step = 1;
          sendLine('EHLO localhost');
        } else if (step === 1 && code === 250) {
          step = 2;
          const authPlain = Buffer.from(
            `\0${opts.gmailUser}\0${opts.gmailAppPassword.replace(/\s+/g, '')}`
          ).toString('base64');
          sendLine(`AUTH PLAIN ${authPlain}`);
        } else if (step === 2 && code === 235) {
          step = 3;
          sendLine(`MAIL FROM:<${opts.gmailUser}>`);
        } else if (step === 3 && code === 250) {
          step = 4;
          sendLine(`RCPT TO:<${TARGET_EMAIL}>`);
        } else if (step === 4 && code === 250) {
          step = 5;
          sendLine('DATA');
        } else if (step === 5 && code === 354) {
          step = 6;
          socket.write(mimeMessage + '\r\n');
        } else if (step === 6 && code === 250) {
          step = 7;
          sendLine('QUIT');
          socket.end();
          return resolve();
        }
      }
    });

    socket.on('error', (err) => reject(err));
  });
}

function sendViaResend(opts: {
  apiKey: string;
  senderName: string;
  senderEmail: string;
  message: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanName = opts.senderName.replace(/[\r\n"]/g, '').trim();
    const cleanEmail = opts.senderEmail.replace(/[\r\n<>]/g, '').trim();
    const payload = JSON.stringify({
      from: `${cleanName} <onboarding@resend.dev>`,
      to: [TARGET_EMAIL],
      reply_to: cleanEmail,
      subject: `Message from ${cleanName} (${cleanEmail})`,
      html: buildPersonalEmailHtml(cleanName, cleanEmail, opts.message),
    });

    const req = https.request(
      {
        hostname: 'api.resend.com',
        path: '/emails',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`Resend API error: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'direct-contact-email-api',
        configureServer(server) {
          server.middlewares.use('/api/contact', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let raw = '';
            req.on('data', (chunk) => (raw += chunk));
            req.on('end', async () => {
              try {
                const { name, email, message } = JSON.parse(raw || '{}');
                const gmailAppPass = env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
                const resendKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY;

                if (gmailAppPass) {
                  await sendViaGmailSmtp({
                    gmailUser: env.GMAIL_USER || TARGET_EMAIL,
                    gmailAppPassword: gmailAppPass,
                    senderName: name,
                    senderEmail: email,
                    message,
                  });
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, mode: 'gmail-smtp' }));
                  return;
                }

                if (resendKey) {
                  await sendViaResend({
                    apiKey: resendKey,
                    senderName: name,
                    senderEmail: email,
                    message,
                  });
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, mode: 'resend' }));
                  return;
                }

                res.statusCode = 501;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, fallback: true }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: err?.message || 'Error' }));
              }
            });
          });
        },
      },
    ],
  };
});
