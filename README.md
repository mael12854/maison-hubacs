# Maison des Hubacs

Site de vente de la maison au 480, chemin des Hubacs, 83210 Solliès-Toucas (Var).
Une seule page longue : accueil, la maison, l’extérieur, le lieu, la visite.

Site statique (HTML/CSS/JS, sans build) + quelques fonctions serveur Vercel (`api/`).
Hébergé sur Vercel, projet `maison-hubacs` (équipe « Projets de Maël »).

## Demandes de visite et espace propriétaire

- Le formulaire du site envoie la demande à `POST /api/visite`, qui l'enregistre dans un
  **Blob store Vercel privé** (un fichier JSON par demande, `demandes/<id>.json`).
  Anti-spam : champ piège invisible (ignoré sans rien dire) + délai minimum de 2 s depuis l’ouverture
  de la page (le visiteur est invité à renvoyer).
- Chaque nouvelle demande déclenche une **alerte e-mail** au propriétaire via l’API transactionnelle
  Brevo (`lib/alerte.js`). « Répondre » dans la messagerie écrit directement au visiteur.
  Si Brevo échoue, la demande reste enregistrée (l’erreur apparaît dans les logs Vercel).
- **`/proprietaire`** : espace protégé par un code d'accès. On y voit toutes les demandes,
  on change leur statut (nouvelle, recontactée, visite planifiée, terminée, archivée)
  et on ajoute une note privée. La page n'est pas indexée par les moteurs de recherche.

### Réglages Vercel nécessaires

| Réglage | Rôle |
|---|---|
| `OWNER_CODE` (variable d'environnement) | Le code d'accès. Le changer déconnecte toutes les sessions. |
| Blob store **privé** `maison-hubacs-demandes` relié au projet | Crée `BLOB_STORE_ID` ; le SDK s’authentifie seul via OIDC (pas de token à gérer). |
| `BREVO_API_KEY` (sensitive) | Active l’alerte e-mail à chaque nouvelle demande. Sans elle, pas d’alerte, le reste fonctionne. |
| `ALERT_EMAIL` (facultatif) | Destinataire des alertes. Par défaut : l’adresse de l’expéditeur Brevo. |
| `BREVO_SENDER_EMAIL` (facultatif) | Expéditeur, doit être validé dans Brevo. Par défaut : l’expéditeur validé du compte. |

Pour créer le Blob store : Vercel → projet `maison-hubacs` → Storage → Create → Blob,
accès **Private**, région Paris (cdg1), puis le connecter au projet. Redéployer ensuite.

## Fichiers

- `index.html` : la page
- `styles/tokens.css` : tokens de la charte (couleurs, typo, espacements), section 08
- `styles/site.css` : composants et mise en page
- `scripts/site.js` : envoi du formulaire (repli sur un e-mail pré-rempli si le serveur ne répond pas)
- `proprietaire.html`, `scripts/proprietaire.js`, `styles/proprietaire.css` : espace propriétaire
- `api/visite.js`, `api/proprietaire/session.js`, `api/proprietaire/demandes.js` : fonctions serveur
- `lib/auth.js` (session par cookie signé), `lib/demandes.js` (stockage Blob)
- `assets/img/` : photos ; `assets/favicon.svg` : monogramme
- `project/` et `chats/` : la charte de marque d’origine (Claude Design), pour référence

## À compléter

- **Photos** : chaque emplacement rayé (`<div class="photo photo--todo" data-label="…">`) est à remplacer par
  `<figure class="photo"><img src="assets/img/….jpg" alt="…"></figure>`. La liste des prises de vue
  est dans la charte, section 06. La photo héro actuelle (l’allée) est provisoire.
- **Fiche chiffres** (`<dl class="facts">`) : surface habitable, terrain, nombre de chambres.
