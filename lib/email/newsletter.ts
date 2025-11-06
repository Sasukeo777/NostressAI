import { getResendClient } from '@/lib/email/resend';

interface SendDoubleOptInEmailOptions {
  email: string;
  confirmUrl: string;
  sourcePath?: string | null;
}

export async function sendNewsletterDoubleOptInEmail({ email, confirmUrl, sourcePath }: SendDoubleOptInEmailOptions) {
  const resend = getResendClient();
  const fromAddress = process.env.RESEND_NEWSLETTER_FROM_EMAIL;

  if (!fromAddress) {
    throw new Error('Missing RESEND_NEWSLETTER_FROM_EMAIL environment variable.');
  }

  const subject = 'Confirm your subscription to NoStress AI';
  const escapedSource = sourcePath ? escapeHtml(sourcePath) : '';
  const plainTextLines = [
    'Thanks for signing up to the NoStress AI micro-letter.',
    'Please confirm your email to start receiving calm, actionable updates (1–2 per month).',
    `Confirm here: ${confirmUrl}`,
    'If you did not request this, you can ignore this email.'
  ];
  const html = `
    <table cellpadding="0" cellspacing="0" width="100%" style="font-family: Arial, sans-serif; background-color: #f8faf9; padding: 32px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; padding: 40px;">
            <tr>
              <td>
                <p style="font-size: 14px; color: #647067; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 12px;">NoStress AI</p>
                <h1 style="font-size: 26px; color: #1f2b27; margin: 0 0 16px;">Confirm your subscription</h1>
                <p style="font-size: 16px; color: #47524d; line-height: 1.6; margin-bottom: 24px;">
                  Thanks for signing up to the NoStress AI micro-letter. Please confirm your email address to start receiving 1–2 calm, actionable updates per month.
                </p>
                <p style="margin: 0 0 32px;">
                  <a href="${confirmUrl}" style="display: inline-block; padding: 12px 20px; background-color: #2f7d6d; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 999px;">
                    Confirm subscription
                  </a>
                </p>
                <p style="font-size: 13px; color: #6b756f; line-height: 1.6; margin-bottom: 24px;">
                  If you didn’t request this, feel free to ignore this email. We’ll only subscribe you after confirmation.
                </p>
                <p style="font-size: 12px; color: #94a29b; line-height: 1.6;">
                  ${escapedSource ? `Requested from: ${escapedSource}<br />` : ''}
                  Questions? Reply to this email or write to <a href="mailto:privacy@nostress.ai" style="color: #2f7d6d;">privacy@nostress.ai</a>.
                </p>
              </td>
            </tr>
          </table>
          <p style="font-size: 11px; color: #9aa8a1; margin-top: 18px;">
            You are receiving this email because you opted in at nostress-ai.com.
          </p>
        </td>
      </tr>
    </table>
  `;

  return resend.emails.send({
    from: fromAddress,
    to: email,
    subject,
    html,
    text: plainTextLines.join('\n\n')
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

export async function addContactToNewsletterAudience(email: string) {
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;
  if (!audienceId) {
    return;
  }

  let resend;
  try {
    resend = getResendClient();
  } catch (error) {
    console.error('[newsletter] Resend client unavailable when adding contact', error);
    return;
  }

  try {
    await resend.contacts.create({
      email,
      audience_id: audienceId,
      unsubscribed: false
    });
  } catch (error: any) {
    const message = typeof error?.message === 'string' ? error.message : '';
    if (message && /already exists/i.test(message)) {
      return;
    }
    console.error('[newsletter] Failed to add contact to Resend audience', error);
  }
}
