// Formulaire de visite : ouvre la messagerie avec la demande déjà rédigée.
(function () {
  var form = document.getElementById('visit-form');
  if (!form) return;
  var to = 'sandiade@yopmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var d = new FormData(form);
    var demande = d.get('demande') || 'Visite sur place';
    var lines = [
      'Bonjour,',
      '',
      'Demande : ' + demande,
      'Nom : ' + d.get('nom'),
      'E-mail : ' + d.get('email')
    ];
    if (d.get('telephone')) lines.push('Téléphone : ' + d.get('telephone'));
    if (d.get('message')) lines.push('', d.get('message'));
    var subject = 'Maison des Hubacs · ' + demande;
    window.location.href = 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines.join('\n'));
    var note = document.getElementById('form-note');
    if (note) note.textContent = 'Votre messagerie va s’ouvrir. Si rien ne se passe, écrivez-nous à ' + to + '.';
  });
})();
