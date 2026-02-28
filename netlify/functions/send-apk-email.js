/**
 * Netlify Function: send APK download link to the given email.
 * Uses Resend (https://resend.com) – set RESEND_API_KEY and RESEND_FROM_EMAIL in Netlify env.
 */
exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON', message: 'Invalid request body.' })
    };
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid email', message: 'Please enter a valid email address.' })
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Config missing',
        message: 'Email service is not configured. Add RESEND_API_KEY in Netlify.'
      })
    };
  }

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://your-site.netlify.app';
  const downloadUrl = `${siteUrl.replace(/\/$/, '')}/downloads/app-release.apk`;

  const html = `
    <p>Here's your download link for OnTrack Daily (Android):</p>
    <p><a href="${downloadUrl}" style="color: #b0a1e0;">Download OnTrack Daily APK</a></p>
    <p>Or copy this link: ${downloadUrl}</p>
    <p>— OnTrack Daily</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: 'OnTrack Daily – Download link',
      html: html
    })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Send failed',
        message: data.message || data.error || 'Could not send email. Try again later.'
      })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sent: true })
  };
};
