# Maison Solliès-Toucas brand guidelines

_Started 2026-10-21 07:51 UTC_

---

## User

Fais des brand guidelines pour une maison située au 480, chemin des Hubacs, 83210 Solliès-Toucas, France - j'ai des photos, les voici en PJ. Ces brand guidelines seront destinées à un site que je ferai après, dédié à cette maison, avec claude code, en s'appuyant sur ces brand guidelines

## Assistant



## Assistant

_[tool: ask_user]_

J'attends vos réponses au formulaire : usage du site, nom de la maison, public, ton, ce que les guidelines doivent couvrir, et d'autres photos si vous en avez. Dès que vous l'envoyez, je m'y mets.

## User

Answered — purpose: Vente de la maison; name: ben y'a marqué Sandiade sur la devanture mais c'est pas obligé de le mettre en évidence; audience: Familles, Couples, Clientèle internationale, Clientèle française, Haut de gamme, Groupes d'amis; languages: Français; tone: Authentique, terroir provençal; features: piscine, très belle vue, très grande maison, grand jardin, poolhouse, grand garage; scope: Logo / monogramme, Palette, Typographie, Ton & vocabulaire, Photographie, Composants UI web, Tokens CSS pour Claude Code, Exemples de pages

## Assistant

_[tool: copy_files]_

_[tool: copy_files]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: dc_js_str_replace]_

Now the email in the page footer and contact, plus a brand-name prop.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_set_props]_

_[tool: ready_for_verification]_

J'ai fait la charte de marque, une page en 9 sections : nom et récit, logo et monogramme, couleurs, typographie, ton et vocabulaire, photographie, composants web, tokens CSS à copier pour Claude Code, et exemples de pages.

- **Nom :** j'ai pris « Les Hubacs », d'après le nom du chemin. « Sandiade » ne figure que sur le pilier du portail et dans la liste des photos à faire, jamais dans le logo. Le panneau Tweaks permet de passer à « La Sandiade » ou « Maison des Hubacs ».
- **Atouts :** la cheminée et le barbecue sont dans la liste des atouts, les exemples de textes, les composants et la liste des photos à faire.
- **E-mail :** sandiade@yopmail.com figure dans la section « Le lieu », dans le pied de page et dans les tokens.
- **À compléter :** la fiche chiffres (surface habitable, terrain, nombre de chambres) attend vos valeurs, et les photos des pièces et de l'extérieur sont pour l'instant des emplacements vides. Les deux images actuelles (portail, vue aérienne) servent de référence.

## User

mets par defaut Maison des Hubacs

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_set_props]_

_[tool: dc_js_str_replace]_

« Maison des Hubacs » est maintenant le nom par défaut, partout dans la charte. Le monogramme reste « H ».

## User

pas pinède sur le terrzin

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: grep]_

Le site ne parle plus de pinède sur le terrain. Je l'ai remplacée par « face au massif » dans le sous-titre de couverture, le titre de la page d'exemple, l'échelle typographique et la liste des atouts. Dans les mots à employer, « pinède » devient « massif boisé » et « collines ».

Deux mentions restent, parce qu'elles parlent du massif et pas du terrain : la définition de l'ubac (« où les pins restent verts ») et l'origine de la couleur Pin d'Alep (« les pins du massif »).

## User

et y'a un boulordome aussi

## Assistant

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

J'ai ajouté le boulodrome à la charte :
- **Atouts clés :** c'est le 9e atout, « Terrain de pétanque ».
- **Photos à faire :** une nouvelle prise de vue, « 06b Boulodrome ».
- **Vocabulaire :** « partie de boules » rejoint les mots à employer.
- **Exemple « Oui » :** la phrase sur le barbecue finit maintenant par la partie de boules.
- **Page d'accueil d'exemple :** le texte d'accroche cite le boulodrome avec la piscine et le jardin.

