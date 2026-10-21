// Formulaire de visite : envoie la demande à /api/visite.
// Si le serveur ne répond pas, propose d'écrire par e-mail avec la demande déjà rédigée.
(function () {
  var form = document.getElementById('visit-form');
  if (!form) return;
  var to = 'dom.artore@gmail.com';
  var note = document.getElementById('form-note');
  var button = form.querySelector('button[type="submit"]');
  var openedAt = Date.now();

  function setNote(text, kind) {
    note.className = 'form__note' + (kind ? ' is-' + kind : '');
    note.textContent = text;
  }

  function mailto(d) {
    var lines = ['Bonjour,', '', 'Demande : ' + d.demande, 'Nom : ' + d.nom, 'E-mail : ' + d.email];
    if (d.telephone) lines.push('Téléphone : ' + d.telephone);
    if (d.message) lines.push('', d.message);
    return 'mailto:' + to + '?subject=' + encodeURIComponent('Maison des Hubacs · ' + d.demande) +
      '&body=' + encodeURIComponent(lines.join('\n'));
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var f = new FormData(form);
    var d = {
      nom: f.get('nom'), email: f.get('email'), telephone: f.get('telephone'),
      demande: f.get('demande') || 'Visite sur place', message: f.get('message'),
      site: f.get('site'), ms: Date.now() - openedAt
    };

    button.disabled = true;
    setNote('Envoi en cours…');

    fetch('/api/visite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Erreur');
        });
      })
      .then(function () {
        form.reset();
        setNote('Merci, votre demande est bien arrivée. Nous vous recontactons personnellement très vite.', 'ok');
      })
      .catch(function (err) {
        note.className = 'form__note is-error';
        note.textContent = (err.message && err.message !== 'Erreur' && err.message !== 'Failed to fetch' ? err.message + ' ' : 'L’envoi n’a pas abouti. ') ;
        var a = document.createElement('a');
        a.href = mailto(d);
        a.textContent = 'Envoyer la demande par e-mail';
        note.appendChild(a);
      })
      .then(function () { button.disabled = false; });
  });
})();
