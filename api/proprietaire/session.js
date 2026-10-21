// /api/proprietaire/session
//   GET    : la session est-elle ouverte ?
//   POST   : ouvre la session avec le code d'accès { code }
//   DELETE : ferme la session
import { checkCode, clearCookie, isOwner, json, sameOrigin, sessionCookie } from '../../lib/auth.js';

export function GET(request) {
  return json({ connecte: isOwner(request) });
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Origine refusée' }, 403);
  let code = '';
  try {
    ({ code } = await request.json());
  } catch {}
  if (!checkCode(code)) {
    await new Promise((r) => setTimeout(r, 1500)); // ralentit les essais en série
    return json({ error: 'Code incorrect.' }, 401);
  }
  return json({ connecte: true }, 200, { 'Set-Cookie': sessionCookie() });
}

export function DELETE() {
  return json({ connecte: false }, 200, { 'Set-Cookie': clearCookie() });
}
