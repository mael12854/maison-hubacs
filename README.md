# Maison des Hubacs

Site de vente de la maison au 480, chemin des Hubacs, 83210 Solliès-Toucas (Var).
Une seule page longue : accueil, la maison, l’extérieur, le lieu, la visite.

Site statique (HTML/CSS/JS, sans build). Pour le voir : ouvrir `index.html`, ou servir le dossier
(`python3 -m http.server`) et le déployer tel quel sur Netlify, Vercel, GitHub Pages…

## Fichiers

- `index.html` : la page
- `styles/tokens.css` : tokens de la charte (couleurs, typo, espacements), section 08
- `styles/site.css` : composants et mise en page
- `scripts/site.js` : le formulaire ouvre la messagerie avec la demande rédigée (pas de serveur)
- `assets/img/` : photos ; `assets/favicon.svg` : monogramme
- `project/` et `chats/` : la charte de marque d’origine (Claude Design), pour référence

## À compléter

- **Photos** : chaque emplacement rayé (`<div class="photo photo--todo" data-label="…">`) est à remplacer par
  `<figure class="photo"><img src="assets/img/….jpg" alt="…"></figure>`. La liste des prises de vue
  est dans la charte, section 06. La photo héro actuelle (l’allée) est provisoire.
- **Fiche chiffres** (`<dl class="facts">`) : surface habitable, terrain, nombre de chambres.
