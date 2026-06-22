import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'involynk-default-secret-key-123456';

/**
 * Validates the session cookie from the request headers
 * @param {Request} req - Next.js Request object
 * @returns {boolean} - True if session is valid and authenticated
 */
export function isAuthenticated(req) {
  let sessionToken = null;

  // 1. Try Next.js native request cookies helper first
  if (req.cookies && typeof req.cookies.get === 'function') {
    sessionToken = req.cookies.get('involynk_session')?.value;
  }

  // 2. Fallback to manual parsing of the Cookie header if helper is not present
  if (!sessionToken) {
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts[0]?.trim();
      const val = parts.slice(1).join('=')?.trim();
      if (name) cookies[name] = val;
    });
    sessionToken = cookies['involynk_session'];
  }

  if (!sessionToken) {
    console.warn('[AUTH] Authentication failed: No involynk_session token found in cookies');
    return false;
  }

  try {
    sessionToken = decodeURIComponent(sessionToken);
  } catch (err) {
    console.warn('[AUTH] Failed to decode sessionToken URI component:', err.message);
  }

  try {
    const raw = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const { data, signature } = JSON.parse(raw);
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('[AUTH] Authentication failed: Signature mismatch');
      return false;
    }

    const payload = JSON.parse(data);
    
    // Verify expiration
    if (Date.now() > payload.expiresAt) {
      console.warn('[AUTH] Authentication failed: Session expired');
      return false;
    }

    return true;
  } catch (err) {
    console.error('[AUTH] Authentication failed with exception:', err.message);
    return false;
  }
}
