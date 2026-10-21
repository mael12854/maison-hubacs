// Espace propriétaire : connexion par code, liste des demandes, statut et note privée.
(function () {
  var STATUTS = [
    { v: 'nouvelle', l: 'Nouvelles' },
    { v: 'recontactee', l: 'Recontactées' },
    { v: 'visite-planifiee', l: 'Visites planifiées' },
    { v: 'terminee', l: 'Terminées' },
    { v: 'archivee', l: 'Archivées' }
  ];
  var LABEL = {
    nouvelle: 'Nouvelle', recontactee: 'Recontactée', 'visite-planifiee': 'Visite planifiée',
    terminee: 'Terminée', archivee: 'Archivée'
  };

  var $ = function (id) { return document.getElementById(id); };
  var loginView = $('login-view'), boardView = $('board-view'), logoutBtn = $('logout');
  var demandes = [];
  var filtre = 'actives';

  function api(path, opts) {
    opts = opts || {};
    opts.headers = { 'Content-Type': 'application/json' };
    opts.credentials = 'same-origin';
    return fetch(path, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (res.status === 401 && path.indexOf('session') === -1) { show(false); }
        if (!res.ok) throw new Error(data.error || 'Erreur ' + res.status);
        return data;
      });
    });
  }

  function show(connecte) {
    loginView.hidden = connecte;
    boardView.hidden = !connecte;
    logoutBtn.hidden = !connecte;
    if (connecte) load();
  }

  // ---------- Connexion ----------
  $('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var note = $('login-note');
    var btn = e.target.querySelector('button');
    btn.disabled = true;
    note.className = 'form__note';
    note.textContent = 'Vérification…';
    api('/api/proprietaire/session', { method: 'POST', body: JSON.stringify({ code: e.target.code.value }) })
      .then(function () { e.target.reset(); note.textContent = ''; show(true); })
      .catch(function (err) { note.className = 'form__note is-error'; note.textContent = err.message; })
      .then(function () { btn.disabled = false; });
  });

  logoutBtn.addEventListener('click', function () {
    api('/api/proprietaire/session', { method: 'DELETE' }).then(function () { show(false); });
  });

  $('refresh').addEventListener('click', load);

  // ---------- Données ----------
  function load() {
    var note = $('board-note');
    note.className = 'form__note';
    note.textContent = 'Chargement…';
    api('/api/proprietaire/demandes')
      .then(function (data) { demandes = data.demandes || []; note.textContent = ''; render(); })
      .catch(function (err) { note.className = 'form__note is-error'; note.textContent = err.message; });
  }

  function update(id, patch, done) {
    api('/api/proprietaire/demandes', { method: 'PATCH', body: JSON.stringify(Object.assign({ id: id }, patch)) })
      .then(function (data) {
        demandes = demandes.map(function (d) { return d.id === id ? data.demande : d; });
        render();
        if (done) done(true);
      })
      .catch(function (err) {
        var note = $('board-note');
        note.className = 'form__note is-error';
        note.textContent = err.message;
        if (done) done(false);
      });
  }

  // ---------- Affichage ----------
  function fmtDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  function renderCounts() {
    var dl = $('counts');
    dl.textContent = '';
    STATUTS.forEach(function (s) {
      var n = demandes.filter(function (d) { return d.statut === s.v; }).length;
      var div = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = s.l;
      var dd = document.createElement('dd'); dd.textContent = n;
      div.append(dt, dd);
      dl.append(div);
    });
  }

  function renderFilter() {
    var fs = $('filter');
    fs.querySelectorAll('.pill').forEach(function (n) { n.remove(); });
    [{ v: 'actives', l: 'En cours' }].concat(STATUTS, [{ v: 'toutes', l: 'Toutes' }]).forEach(function (s) {
      var label = document.createElement('label'); label.className = 'pill';
      var input = document.createElement('input');
      input.type = 'radio'; input.name = 'filtre'; input.value = s.v; input.checked = s.v === filtre;
      input.addEventListener('change', function () { filtre = s.v; renderList(); });
      var span = document.createElement('span'); span.textContent = s.l;
      label.append(input, span);
      fs.append(label);
    });
  }

  function visibles() {
    return demandes.filter(function (d) {
      if (filtre === 'toutes') return true;
      if (filtre === 'actives') return d.statut !== 'terminee' && d.statut !== 'archivee';
      return d.statut === filtre;
    });
  }

  function renderList() {
    var list = $('list');
    list.textContent = '';
    var items = visibles();
    if (!items.length) {
      var li = document.createElement('li');
      li.className = 'empty';
      li.textContent = demandes.length ? 'Aucune demande dans cette catégorie.' : 'Pas encore de demande. Elles apparaîtront ici.';
      list.append(li);
      return;
    }
    var tpl = $('item-tpl');
    items.forEach(function (d) {
      var node = tpl.content.firstElementChild.cloneNode(true);
      var q = function (c) { return node.querySelector('.demande__' + c); };
      node.dataset.statut = d.statut;
      q('date').textContent = fmtDate(d.createdAt);
      q('type').textContent = d.demande;
      q('nom').textContent = d.nom;
      q('email').textContent = d.email;
      q('email').href = 'mailto:' + d.email + '?subject=' + encodeURIComponent('Maison des Hubacs · ' + d.demande);
      if (d.telephone) {
        q('tel').textContent = d.telephone;
        q('tel').href = 'tel:' + d.telephone.replace(/[^\d+]/g, '');
      } else {
        q('tel').remove();
      }
      q('message').textContent = d.message || '';

      var select = q('statut');
      STATUTS.forEach(function (s) {
        var o = document.createElement('option');
        o.value = s.v; o.textContent = LABEL[s.v]; o.selected = s.v === d.statut;
        select.append(o);
      });
      select.addEventListener('change', function () { select.disabled = true; update(d.id, { statut: select.value }); });

      var note = q('note'), save = q('save');
      note.value = d.note || '';
      save.addEventListener('click', function () {
        save.disabled = true;
        save.textContent = 'Enregistrement…';
        update(d.id, { note: note.value }, function (ok) {
          if (!ok) { save.disabled = false; save.textContent = 'Enregistrer la note'; }
        });
      });
      var delBtn = q('delete');
      if (d.statut !== 'archivee') {
        delBtn.remove();
      } else {
        delBtn.addEventListener('click', function () {
          if (!window.confirm('Supprimer définitivement la demande de ' + d.nom + ' ? Cette action est irréversible.')) return;
          delBtn.disabled = true;
          delBtn.textContent = 'Suppression…';
          api('/api/proprietaire/demandes', { method: 'DELETE', body: JSON.stringify({ id: d.id }) })
            .then(function () {
              demandes = demandes.filter(function (x) { return x.id !== d.id; });
              render();
            })
            .catch(function (err) {
              delBtn.disabled = false;
              delBtn.textContent = 'Supprimer définitivement';
              var note = $('board-note');
              note.className = 'form__note is-error';
              note.textContent = err.message;
            });
        });
      }
      list.append(node);
    });
  }

  function render() { renderCounts(); renderFilter(); renderList(); }

  // ---------- Démarrage ----------
  api('/api/proprietaire/session')
    .then(function (data) { show(!!data.connecte); })
    .catch(function () { show(false); });
})();
