// Alerte e-mail au propriétaire à chaque nouvelle demande (API transactionnelle Brevo).
// Variables Vercel : BREVO_API_KEY (obligatoire), ALERT_EMAIL et BREVO_SENDER_EMAIL (facultatives).
// Sans BREVO_API_KEY, aucune alerte n'est envoyée et le formulaire fonctionne quand même.

const DEFAULT_TO = 'mael.domenech@gmail.com';
const DEFAULT_FROM = 'mael.domenech@gmail.com'; // expéditeur validé dans Brevo

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function html(d, siteUrl) {
  const row = (k, v) =>
    v ? `<tr><td style="padding:6px 16px 6px 0;color:#7D8463;font-size:13px;vertical-align:top">${k}</td><td style="padding:6px 0;font-size:15px;color:#23251F">${v}</td></tr>` : '';
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#F4F0E8;font-family:Helvetica,Arial,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#A3532F">Nouvelle demande · ${esc(d.demande)}</p>
  <h1 style="margin:0 0 24px;font-family:Georgia,serif;font-weight:400;font-size:30px;color:#2F3B2A">${esc(d.nom)}</h1>
  <table style="border-collapse:collapse;width:100%;background:#FBF9F4;border:1px solid #E4DCCD"><tbody><tr><td style="padding:20px">
    <table style="border-collapse:collapse">
      ${row('E-mail', `<a href="mailto:${esc(d.email)}" style="color:#A3532F">${esc(d.email)}</a>`)}
      ${row('Téléphone', d.telephone && `<a href="tel:${esc(d.telephone.replace(/[^\d+]/g, ''))}" style="color:#A3532F">${esc(d.telephone)}</a>`)}
      ${row('Message', d.message && esc(d.message).replace(/\n/g, '<br>'))}
    </table>
  </td></tr></tbody></table>
  <p style="margin:24px 0 0"><a href="${esc(siteUrl)}/proprietaire" style="display:inline-block;padding:12px 22px;background:#2F3B2A;color:#F4F0E8;text-decoration:none;font-size:14px">Ouvrir l’espace propriétaire</a></p>
  <p style="margin:24px 0 0;font-size:12px;color:#5E6150">Répondre à cet e-mail écrit directement à ${esc(d.nom)}.</p>
</div></body></html>`;
}

function text(d, siteUrl) {
  const lines = [`Nouvelle demande : ${d.demande}`, '', `Nom : ${d.nom}`, `E-mail : ${d.email}`];
  if (d.telephone) lines.push(`Téléphone : ${d.telephone}`);
  if (d.message) lines.push('', d.message);
  lines.push('', `Espace propriétaire : ${siteUrl}/proprietaire`);
  return lines.join('\n');
}

export async function envoyerAlerte(demande, request) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return { envoye: false, raison: 'BREVO_API_KEY absente' };

  const siteUrl = new URL(request.url).origin;
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Maison des Hubacs', email: process.env.BREVO_SENDER_EMAIL || DEFAULT_FROM },
      to: [{ email: process.env.ALERT_EMAIL || DEFAULT_TO }],
      replyTo: { email: demande.email, name: demande.nom },
      subject: `Demande de visite · ${demande.nom} · ${demande.demande}`,
      htmlContent: html(demande, siteUrl),
      textContent: text(demande, siteUrl),
      tags: ['maison-hubacs', 'demande-visite'],
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status} : ${(await res.text()).slice(0, 300)}`);
  return { envoye: true };
}
