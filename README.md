# Maison des Hubacs

Site de vente de la maison au 480, chemin des Hubacs, 83210 Solliès-Toucas (Var).
Une seule page longue : accueil, la maison, l’extérieur, le lieu, la visite.

Site statique (HTML/CSS/JS, sans build) + quelques fonctions serveur Vercel (`api/`).
Hébergé sur Vercel, projet `maison-hubacs` (équipe « Projets de Maël »).

## Demandes de visite et espace propriétaire

- Le formulaire du site envoie la demande à `POST /api/visite`, qui l'enregistre dans un
  **Blob store Vercel privé** (un fichier JSON par demande, `demandes/<id>.json`).
  Anti-spam : champ piège invisible + délai minimum de 3 s.
- **`/proprietaire`** : espace protégé par un code d'accès. On y voit toutes les demandes,
  on change leur statut (nouvelle, recontactée, visite planifiée, terminée, archivée)
  et on ajoute une note privée. La page n'est pas indexée par les moteurs de recherche.

### Réglages Vercel nécessaires

| Réglage | Rôle |
|---|---|
| `OWNER_CODE` (variable d'environnement) | Le code d'accès. Le changer déconnecte toutes les sessions. |
| Blob store **privé** relié au projet | Crée automatiquement `BLOB_READ_WRITE_TOKEN`. |

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
