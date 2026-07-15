import { createHash, createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';

const ADMIN_PASSWORD_HASH = '1315b95f1c1e1926b109497cdae54f2dee2f3aae23afff609c848fd840021e9d';

function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_SHA256 || ADMIN_PASSWORD_HASH;
}

function hashPassword(value: string) {
  return createHash('sha256').update(value).digest('hex');
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
  const expectedHash = getAdminPasswordHash();
  const receivedHash = hashPassword(password);

  try {
    const expected = Buffer.from(expectedHash, 'hex');
    const received = Buffer.from(receivedHash, 'hex');
    if (expected.length !== received.length) return false;

    return timingSafeEqual(received, expected);
  } catch {
    return false;
  }
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
