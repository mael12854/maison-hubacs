// POST /api/visite : enregistre une demande de visite envoyée depuis le formulaire du site.
import { json, sameOrigin } from '../lib/auth.js';
import { newId, saveDemande, TYPES } from '../lib/demandes.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request) {
  if (!sameOrigin(request)) return json({ error: 'Origine refusée' }, 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Requête invalide' }, 400);
  }

  // Anti-spam : champ invisible rempli, ou formulaire envoyé en moins de 3 secondes.
  const elapsed = Date.now() - Number(body.t || 0);
  if (clean(body.site, 200) || !(elapsed > 3000)) {
    return json({ ok: true }); // on ne dit rien au robot
  }

  const demande = {
    id: newId(),
    createdAt: new Date().toISOString(),
    nom: clean(body.nom, 120),
    email: clean(body.email, 200),
    telephone: clean(body.telephone, 40),
    demande: TYPES.includes(body.demande) ? body.demande : TYPES[0],
    message: clean(body.message, 4000),
    statut: 'nouvelle',
    note: '',
  };

  if (!demande.nom || !EMAIL_RE.test(demande.email)) {
    return json({ error: 'Merci d’indiquer votre nom et une adresse e-mail valide.' }, 422);
  }

  try {
    await saveDemande(demande);
  } catch (err) {
    console.error('visite: enregistrement impossible', err);
    return json({ error: 'Enregistrement impossible pour le moment.' }, 503);
  }
  return json({ ok: true }, 201);
}
