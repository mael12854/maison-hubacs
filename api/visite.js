// POST /api/visite : enregistre une demande de visite envoyée depuis le formulaire du site.
import { json, sameOrigin } from '../lib/auth.js';
import { newId, saveDemande, TYPES } from '../lib/demandes.js';
import { envoyerAlerte } from '../lib/alerte.js';

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
  // La durée est mesurée par le navigateur (pas de comparaison entre deux horloges).
  const elapsed = Number(body.ms);
  if (clean(body.site, 200)) {
    console.warn('visite: ignorée (champ piège rempli)');
    return json({ ok: true }); // on ne dit rien au robot
  }
  if (!(elapsed >= 3000)) {
    console.warn(`visite: ignorée (envoyée trop vite : ${body.ms} ms)`);
    return json({ ok: true });
  }

  const demande = {
    id: newId(),
    createdAt: new Date().toISOString(),
    nom: clean(body.nom, 120).replace(/\s+/g, ' '),
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

  console.log(`visite: enregistrée ${demande.id}`);

  // La demande est enregistrée : un échec de l'alerte ne doit pas faire échouer l'envoi.
  try {
    const r = await envoyerAlerte(demande, request);
    console.log(r.envoye ? `alerte: acceptée par Brevo (${r.messageId}) pour ${r.to}` : `alerte: non envoyée (${r.raison})`);
  } catch (err) {
    console.error('visite: alerte e-mail non envoyée', err);
  }
  return json({ ok: true }, 201);
}
