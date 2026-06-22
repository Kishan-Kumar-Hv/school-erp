import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'involynk-default-secret-key-123456';

/**
 * Validates the session cookie from the request headers
 * @param {Request} req - Next.js Request object
 * @returns {boolean} - True if session is valid and authenticated
 */
export function isAuthenticated(req) {
  const cookieHeader = req.headers.get('cookie') || '';
  
  // Quick parse of cookies
  const cookies = {};
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    const val = parts.slice(1).join('=')?.trim();
    if (name) cookies[name] = val;
  });

  const sessionToken = cookies['involynk_session'];
  if (!sessionToken) return false;

  try {
    const raw = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const { data, signature } = JSON.parse(raw);
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) return false;

    const payload = JSON.parse(data);
    
    // Verify expiration
    if (Date.now() > payload.expiresAt) return false;

    return true;
  } catch (err) {
    return false;
  }
}
