// Session Propriétaire : cookie signé (HMAC) avec le code d'accès OWNER_CODE.
// Changer OWNER_CODE dans Vercel déconnecte toutes les sessions ouvertes.
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

const COOKIE = 'hubacs_owner';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

function ownerCode() {
  const code = process.env.OWNER_CODE;
  if (!code || code.length < 8) throw new Error('OWNER_CODE manquant ou trop court');
  return code;
}

function sign(value) {
  const key = createHash('sha256').update('hubacs-session:' + ownerCode()).digest();
  return createHmac('sha256', key).update(value).digest('base64url');
}

function safeEqual(a, b) {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCode(code) {
  return typeof code === 'string' && safeEqual(code.trim(), ownerCode());
}

export function sessionCookie() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${COOKIE}=${exp}.${sign(exp)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

export function clearCookie() {
  return `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`;
}

export function isOwner(request) {
  const header = request.headers.get('cookie') || '';
  const match = header.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return false;
  const [exp, sig] = match[1].split('.');
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  return safeEqual(sig, sign(exp));
}

// Protège les requêtes qui modifient des données contre les envois depuis un autre site.
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}
