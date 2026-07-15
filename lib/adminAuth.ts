import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || '';
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is required');
  }
  return secret;
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('hex');
}

export function checkPassword(password: string) {
  const expected = getAdminPassword();
  return Boolean(expected) && password === expected;
}

export function createSessionToken() {
  return sign('authenticated');
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;

  try {
    const expected = Buffer.from(sign('authenticated'));
    const received = Buffer.from(token);
    if (received.length !== expected.length) return false;

    return timingSafeEqual(received, expected);
  } catch {
    return false;
  }
}
