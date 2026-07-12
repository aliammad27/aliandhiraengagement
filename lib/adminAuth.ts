import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_PASSWORD = 'icecreamsandwich';
const SESSION_SECRET = 'ali-and-hira-engagement-admin-2025';

export const ADMIN_SESSION_COOKIE = 'admin_session';

function sign(value: string) {
  return createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

export function checkPassword(password: string) {
  return password === ADMIN_PASSWORD;
}

export function createSessionToken() {
  return sign('authenticated');
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;

  const expected = Buffer.from(sign('authenticated'));
  const received = Buffer.from(token);
  if (received.length !== expected.length) return false;

  return timingSafeEqual(received, expected);
}
