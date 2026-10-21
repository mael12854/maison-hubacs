// /api/proprietaire/demandes (session Propriétaire obligatoire)
//   GET   : liste des demandes, la plus récente en premier
//   PATCH : { id, statut?, note? } met à jour une demande
import { isOwner, json, sameOrigin } from '../../lib/auth.js';
import { isValidId, listDemandes, readDemande, saveDemande, STATUTS } from '../../lib/demandes.js';

export async function GET(request) {
  if (!isOwner(request)) return json({ error: 'Non connecté' }, 401);
  try {
    return json({ demandes: await listDemandes() });
  } catch (err) {
    console.error('demandes: lecture impossible', err);
    return json({ error: 'Lecture impossible. Le stockage Blob est-il relié au projet ?' }, 503);
  }
}

export async function PATCH(request) {
  if (!sameOrigin(request)) return json({ error: 'Origine refusée' }, 403);
  if (!isOwner(request)) return json({ error: 'Non connecté' }, 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }
  if (!isValidId(body.id)) return json({ error: 'Demande inconnue' }, 404);

  const demande = await readDemande(body.id);
  if (!demande) return json({ error: 'Demande inconnue' }, 404);

  if (body.statut !== undefined) {
    if (!STATUTS.includes(body.statut)) return json({ error: 'Statut invalide' }, 400);
    demande.statut = body.statut;
  }
  if (typeof body.note === 'string') demande.note = body.note.slice(0, 2000);
  demande.updatedAt = new Date().toISOString();

  await saveDemande(demande);
  return json({ demande });
}
