// Stockage des demandes de visite dans un Blob store Vercel privé.
// Une demande = un fichier JSON : demandes/<id>.json
import { put, get, list, del } from '@vercel/blob';

const PREFIX = 'demandes/';

export const STATUTS = ['nouvelle', 'recontactee', 'visite-planifiee', 'terminee', 'archivee'];
export const TYPES = ['Visite sur place', 'Visite vidéo', 'Dossier complet'];

export function newId() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const rand = crypto.randomUUID().slice(0, 8);
  return `${stamp}-${rand}`;
}

export function isValidId(id) {
  return typeof id === 'string' && /^[0-9TZ-]+-[0-9a-f]{8}$/.test(id);
}

export async function saveDemande(demande) {
  await put(`${PREFIX}${demande.id}.json`, JSON.stringify(demande), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  return demande;
}

export async function readDemande(id) {
  const res = await get(`${PREFIX}${id}.json`, { access: 'private' });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}

export async function deleteDemande(id) {
  await del(`${PREFIX}${id}.json`);
}

export async function listDemandes() {
  const pathnames = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, cursor, limit: 1000 });
    for (const b of page.blobs) pathnames.push(b.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const items = await Promise.all(
    pathnames.map(async (p) => {
      try {
        return await readDemande(p.slice(PREFIX.length, -'.json'.length));
      } catch {
        return null;
      }
    })
  );
  return items.filter(Boolean).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
