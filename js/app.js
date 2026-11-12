/* OBHG Clinical Triage UI. No network calls, no storage of the HPI, no analytics. */
(function () {
  'use strict';
  const C = self.CONTENT, T = self.CODE_TABLES, V = self.CODE_VALIDATION, E = self.TriageEngine, D = self.DisplayNames;
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => C.items.find(i => i.id === id);
  const label = it => D.title(it);

  const EXAMPLES = [
    '20 yo G2P1 at 37 weeks with blood pressure 150/100 and headache',
    '30 yo G2P2 2 hours postpartum after vaginal delivery, QBL 800 mL, boggy uterus',
    '29 yo G2P1 at 39 weeks in active labor 6 cm, temp 38.4 C, HR 112',
    '24 yo G1P0 at 40 weeks in labor, recurrent late decels, minimal variability, Cat II',
    '26 yo at 6 weeks, positive hCG, RLQ pelvic pain and spotting, no IUP on ultrasound',
    '28 yo G2P2 2 weeks postpartum with left calf swelling and pain',
    '22 yo G1P0 at 32 weeks with leaking fluid since this morning',
  ];

  // ---------- tabs ----------
  function tab(which) {
    const tri = which === 'triage';
    $('view-triage').hidden = !tri; $('view-browse').hidden = tri;
    $('tab-triage').classList.toggle('on', tri); $('tab-browse').classList.toggle('on', !tri);
    $('tab-triage').setAttribute('aria-selected', tri); $('tab-browse').setAttribute('aria-selected', !tri);
    if (!tri) renderList();
  }
  $('tab-triage').onclick = () => tab('triage');
  $('tab-browse').onclick = () => tab('browse');

  // ---------- rendering ----------
  function verifyBox(flags) {
    if (!flags || !flags.length) return '';
    return '<div class="verify"><b>⚑ Flagged for verification (from source):</b><ul>' + flags.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul></div>';
  }
  function cardHTML(card, open) {
    return '<div class="cardtext">' + D.html(card) + '</div>';
  }
  function sourceHTML(item) {
    const m = D.metadata(item);
    return '<details class="source-meta" open><summary>Source, clinical version and review status</summary><p><b>Original clinical source:</b> ' + esc(m.originalTitle) + '</p><p><b>Source file:</b> ' + esc(m.source) + '</p><p><b>Source/version dates:</b> ' + esc(m.versionDates.join(', ') || 'Not explicitly supplied') + '. ' + esc(m.versionNote) + '</p><p><b>Review status:</b> ' + esc(m.reviewStatus) + '</p>' + (m.superseded ? '<p class="verify"><b>SUPERSEDED 1 Oct 2026 — not current guidance.</b> <button type="button" data-open="FD-SYS-02">Current reference: ' + esc(D.topic('FD-SYS-02')) + '</button></p>' : '') + (item.img ? '<p><a href="' + esc(item.img) + '" target="_blank" rel="noopener">Original source image with provenance (available offline after caching)</a></p>' : '') + '</details>';
  }
  function itemHTML(item, companionCard) {
    let h = '<div class="th"><div class="t">' + esc(label(item)) + (item.superseded ? '<span class="badge warn">SUPERSEDED 1 Oct 2026 — not current guidance</span>' : '') + '</div></div>';
    if (item.kind === 'diagram') {
      h += '<div class="hint">Tap the diagram to open full screen; pinch or +/− to zoom.</div>';
      h += '<img class="diag" src="' + esc(D.image(item)) + '" alt="' + esc(label(item)) + '" data-zoom="' + esc(item.id) + '">';
      h += verifyBox(item.flags);
      if (item.html) h += '<details class="companion" open><summary>Assessment details</summary><div class="cardtext">' + D.html(item) + '</div></details>';
      if (companionCard) h += '<details class="companion"' + (companionCard.flags.length ? '' : '') + '><summary>Related clinical reference: ' + esc(label(companionCard)) + '</summary>' + verifyBox(companionCard.flags) + cardHTML(companionCard) + '</details>';
    } else {
      h += verifyBox(item.flags) + cardHTML(item);
    }
    h += sourceHTML(item);
    return h;
  }
  function factsHTML(f) {
    const rows = [];
    const add = (k, v) => { if (v !== undefined && v !== null && v !== '') rows.push('<dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd>'); };
    add('Age', f.age); add('G/P', f.G !== undefined ? 'G' + f.G + 'P' + f.P + (f.TPAL ? ' (' + f.TPAL + ')' : '') : undefined);
    add('Gestational age', f.ga !== undefined ? f.gaWeeks + 'w' + (f.gaDays || 0) + 'd' : undefined);
    add('Status', f.postpartum ? 'Postpartum' + (f.ppText ? ' (' + f.ppText + ')' : '') : f.postop ? 'Post-op' : f.labor ? 'Intrapartum' : f.antepartum ? 'Antepartum' : 'Not pregnant / unknown');
    add('Delivery route', f.route); add('Prior cesarean', f.priorCS ? 'yes' : undefined);
    add('BP', f.bpReadings ? f.bpReadings.join(', ') + (f.severeBP ? ' — SEVERE RANGE' : f.htn ? ' — ≥140/90' : '') : undefined);
    add('HR', f.hr); add('FHR baseline', f.fhr); add('Temp', f.tempC !== undefined ? f.tempC + ' °C / ' + f.tempF + ' °F' : undefined);
    add('RR', f.rr); add('SpO2', f.spo2 !== undefined ? f.spo2 + '%' : undefined); add('QBL/EBL', f.qbl !== undefined ? f.qbl + ' mL' : undefined);
    add('WBC', f.wbc); add('Lactate', f.lactate); add('hCG', f.hcg !== undefined ? f.hcg : f.hcgPositive ? 'positive' : f.kw.notPregnant ? 'negative / not pregnant' : undefined);
    add('Shock index', f.shockIndex); add('Sepsis screen', f.sirs.length ? f.sirs.length + ' criteria: ' + f.sirs.join(', ') : undefined);
    add('Keywords', Object.keys(f.kw).filter(k => !['pregnantWord', 'timingWords', 'labor'].includes(k)).join(', '));
    return '<dl class="facts">' + rows.join('') + '</dl>';
  }
  function codingHTML(cd, topId) {
    if (!cd) return '<p>No coding reference for ' + esc(D.topic(topId)) + '.</p>';
    const ctxName = { t1: 'first trimester', t2: 'second trimester', t3: 'third trimester', pp: 'puerperium', cb: 'childbirth (intrapartum)', u: 'unspecified' }[cd.ctx];
    let h = (cd.caution ? '<p class="verify">' + esc(cd.caution) + '</p>' : '') + '<p class="alt-tag">Specificity context: <b>' + esc(ctxName) + '</b> · code table v' + esc(cd.tableVersion) + ' · ICD-10-CM checked against CMS FY2026 (and FY2027) code files</p>';
    h += '<div class="subh">ICD-10-CM</div><table class="ctab">';
    for (const c of cd.icd) {
      h += '<tr><td class="code">' + esc(c.code) + '</td><td>' + esc(c.label) + (c.alt ? ' <span class="alt-tag">· if documented / alternative</span>' : '') + (c.secondary ? ' <span class="alt-tag">· secondary</span>' : '') +
        '<br>' + (c.verified ? '<span class="ok">✓ CMS FY2026: ' + esc(c.cms) + '</span>' : '<span class="no">⚑ NOT VERIFIED in CMS FY2026 file</span>') + '</td></tr>';
    }
    h += '</table><div class="subh">CPT (plain-English labels, not AMA descriptors)</div><table class="ctab">';
    for (const c of cd.cpt) h += '<tr><td class="code">' + esc(c.code) + '</td><td>' + esc(c.label) + '</td></tr>';
    h += '</table><div class="subh">E/M ranges</div><table class="ctab">';
    for (const c of cd.em) h += '<tr><td class="code">' + esc(c.code) + '</td><td>' + esc(c.label) + '</td></tr>';
    h += '</table><p class="alt-tag">CPT® is a registered trademark of the AMA. Codes are suggestions for the matched card only; choose from documentation. Not billing advice.</p>';
    return h;
  }

  let current = null;
  let checklistAnswers = {};
  let checklistLanguage = 'en';
  function run() {
    const text = $('hpi').value.trim();
    const warns = E.privacyCheck(text);
    $('privacy-warn').hidden = !warns.length;
    $('privacy-warn').innerHTML = warns.length ? '<b>Check for identifiers:</b> ' + warns.map(esc).join(' ') + ' Remove them before continuing.' : '';
    const r = E.triage(text, C, T, V, {redFlags:checklistAnswers, bp:readBP(), hr:readVital('hr'), spo2:readVital('spo2'), priorSafety:current && current.safety}); current = r;
    updateChecklistStatus(r.safety.checklist);
    renderBanner(r);
    renderHandoff(r.safety);
    $('result').hidden = r.safety.dispositionBlocked;
    renderFlags(r.flags);
    if (r.safety.dispositionBlocked) return;
    if (!r.top) {
      $('top').innerHTML = '<div class="th"><div class="t">No confident match</div></div><div class="cardtext"><p>No match does not rule out an emergency. Follow any escalation above and use direct clinical assessment. Browse all or add relevant context; do not delay urgent care to refine this search.</p></div>';
      $('alts').innerHTML = ''; $('why').innerHTML = factsHTML(r.facts); $('coding').innerHTML = ''; return;
    }

    showTop(r.top);
    $('alts').innerHTML = r.alternates.map(a => {
      const it = a.diagram || a.card; if (!it) return '';
      return '<button type="button" data-open="' + esc(it.id) + '"><span><b>' + esc(label(it)) + '</b> ' + '</span><span class="sc">' + (a.score ? 'score ' + a.score : 'related') + '</span></button>';
    }).join('') || '<p class="alt-tag">None.</p>';
    $('why').innerHTML = factsHTML(r.facts) + '<div class="subh">Rules fired for ' + esc(D.topic(r.top.id)) + ' (score ' + r.top.score + ')</div><ul class="rules">' + r.top.why.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul>' +
      '<div class="subh">All candidates</div><ul class="rules">' + r.ranked.slice(0, 8).map(x => '<li>' + esc(D.topic(x.id)) + ' — ' + x.score + '</li>').join('') + '</ul>';
    $('coding').innerHTML = codingHTML(r.coding, r.top.id);
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function renderBanner(r) {
    const b = $('safety-banner');
    b.hidden = !r;
    if (document.body) document.body.classList.toggle('safety-active', !!r);
    if (!r) { b.innerHTML = ''; if (document.documentElement) document.documentElement.style.setProperty('--safety-banner-height','0px'); return; }
    const safety = r.safety, first = safety.alerts.find(a => a.urgency === safety.urgency) || safety.alerts[0];
    b.setAttribute('data-urgency', safety.urgency);
    b.innerHTML = '<strong>' + esc(safety.disposition ? safety.disposition.replace(/_/g,' ') : 'CHECKLIST INCOMPLETE — no disposition available') + '</strong> · ' +
      esc(first ? first.text : !safety.dispositionBlocked ? 'Clinician review required; all-No is not clearance.' : 'Complete every checklist item before disposition. Activate rescue for any active emergency alert now.') +
      (!safety.checklist.bp.measured && safety.checklist.bp.mode !== 'legacy' ? '<p>' + esc(safety.checklist.bp.action) + ' — disposition remains held.</p>' : '') +
      (safety.checklist.vitals && safety.checklist.vitals.action ? '<p>' + esc(safety.checklist.vitals.action) + ' — disposition remains held.</p>' : '') +
      '<p>' + esc(safety.operationalInstruction) + '</p>' +
      (safety.handoffRequired ? '<b>Unresolved concerns retained. Documented clinician reassessment/handoff required.</b>' : '') +
      (safety.alerts.length > 1 ? ' <b>' + safety.alerts.length + ' active assessment warnings.</b>' : '') +
      '<button type="button" data-safety-return="1">Return to checklist / all warnings</button>';
    if (document.documentElement) document.documentElement.style.setProperty('--safety-banner-height', (b.offsetHeight || 120) + 'px');
  }
  function renderFlags(flags) {
    $('flags').innerHTML = (flags || []).map(fl => '<span class="chip ' + (fl.level === 'amber' ? 'amber' : '') + '">' + esc(fl.text) + (fl.retained ? ' — Retained from earlier in this assessment; clinician reassessment required.' : '') + '</span>').join('');
  }
  function showTop(t) {
    const item = t.diagram || t.card;
    $('top').innerHTML = '<p class="hint">Matched reference topic — not a diagnosis or disposition. Escalation warnings above take priority.</p>' + itemHTML(item, t.diagram ? t.card : null);
  }

  // ---------- viewer ----------
  let zoom = 1;
  function openViewer(item) {
    if (item.kind !== 'diagram') { openItem(item); return; }
    $('viewer-source').innerHTML = sourceHTML(item);
    $('viewer-title').textContent = label(item); $('viewer-img').src = D.image(item); $('viewer-img').alt = label(item);
    zoom = 1; $('viewer-img').style.width = '100%'; $('viewer').hidden = false;
  }
  $('viewer-close').onclick = () => { $('viewer').hidden = true; };
  $('zoom-in').onclick = () => { zoom = Math.min(zoom * 1.5, 6); $('viewer-img').style.width = (zoom * 100) + '%'; };
  $('zoom-out').onclick = () => { zoom = Math.max(zoom / 1.5, 1); $('viewer-img').style.width = (zoom * 100) + '%'; };

  function openItem(item) {
    tab('triage');
    $('result').hidden = false;
    renderFlags(current ? current.flags : []);
    const comp = item.kind === 'diagram' && item.card ? byId(item.card) : null;
    $('top').innerHTML = (current ? '<p class="hint">Reference topic — not a diagnosis or disposition. Escalation warnings remain active.</p>' : '') + itemHTML(item, comp);
    if (!current) { $('alts').innerHTML = ''; $('why').innerHTML = '<p class="alt-tag">Opened from Browse all.</p>'; $('coding').innerHTML = codingHTML(E.codes(item.card || item.id.replace(/^FD-/, ''), E.parse(''), T, V), item.id); }
    $('top').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.addEventListener('click', e => {
    const safetyReturn = e.target.closest('[data-safety-return]'); if (safetyReturn) { tab('triage'); $('structured-screen').scrollIntoView({block:'start'}); return; }
    const answer = e.target.closest('[data-redflag]');
    if (answer) {
      if (answer.dataset.redflag === 'severe_bp' || !E.redFlagItems.some(q => q.id === answer.dataset.redflag) || !['yes','no','unsure'].includes(answer.dataset.answer)) return;
      checklistAnswers[answer.dataset.redflag] = answer.dataset.answer;
      renderChecklist(); run(); $('redflag-' + answer.dataset.redflag + '-' + answer.dataset.answer).focus(); return;
    }
    const z = e.target.closest('[data-zoom]'); if (z) { openViewer(byId(z.dataset.zoom)); return; }
    const o = e.target.closest('[data-open]'); if (o) { openItem(byId(o.dataset.open)); return; }
    const x = e.target.closest('[data-ex]'); if (x) { $('hpi').value = x.dataset.ex; run(); }
  });

  // ---------- browse ----------
  function renderList() {
    const q = $('q').value.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);
    const match = it => !terms.length || terms.every(t => D.searchText(it).includes(t));
    const groups = [['Assessment pathways', i => i.kind === 'diagram'], ['Obstetric conditions', i => i.kind === 'card' && i.book === 'OB'], ['Gynecologic conditions', i => i.kind === 'card' && i.book === 'GYN']];
    let h = '';
    for (const [g, fn] of groups) {
      const its = C.items.filter(fn).filter(match);
      if (!its.length) continue;
      h += '<div class="grp">' + g + ' (' + its.length + ')</div>';
      for (const it of its) {
        h += '<button type="button" data-open="' + esc(it.id) + '"><span class="lid">' + esc(label(it)) + '</span>' +
          (it.superseded ? ' <span class="badge warn">SUPERSEDED 1 Oct 2026 — not current guidance</span>' : '') + (it.flags && it.flags.length ? ' <span class="badge">⚑ ' + it.flags.length + '</span>' : '') +
 '</button>';
        if (it.id === 'SYS-02-QL') h += '<p class="verify">SUPERSEDED 1 Oct 2026 — not current guidance. <button type="button" data-open="FD-SYS-02">Current reference: ' + esc(D.topic('FD-SYS-02')) + '</button></p>';
      }
    }
    $('list').innerHTML = h || '<p>No matches.</p>';
  }
  $('q').addEventListener('input', renderList);

  // ---------- input ----------
  $('examples').innerHTML = EXAMPLES.map(x => '<button type="button" data-ex="' + esc(x) + '">' + esc(x) + '</button>').join('');
  function renderChecklist() {
    const words = checklistLanguage === 'es' ? {yes:'Sí',no:'No',unsure:'No estoy seguro/a'} : {yes:'Yes',no:'No',unsure:'Unsure'};
    $('screen-questions').innerHTML = E.redFlagItems.filter(q => q.id !== 'severe_bp').map(q => '<fieldset class="redflag-row"><legend>' + esc(q.labels[checklistLanguage]) + '</legend><div role="group" aria-label="' + esc(q.labels[checklistLanguage]) + '">' + ['yes','no','unsure'].map(a => '<button type="button" id="redflag-' + q.id + '-' + a + '" data-redflag="' + q.id + '" data-answer="' + a + '" aria-pressed="' + (checklistAnswers[q.id] === a) + '">' + esc(words[a]) + '</button>').join('') + '</div>' + ((checklistAnswers[q.id] && checklistAnswers[q.id] !== 'no') || (current && current.safety.alerts.some(a => a.itemId === q.id)) ? '<p class="redflag-reason">' + (checklistAnswers[q.id] === 'unsure' ? 'Unsure counts as Yes. ' : checklistAnswers[q.id] === 'no' ? 'Earlier positive retained; clinician reassessment required. ' : '') + esc(q.reason) + '</p>' : '') + '</fieldset>').join('');
  }
  function updateChecklistStatus(c) {
    $('go').disabled = c.dispositionHeld;
    $('go').textContent = !c.dispositionHeld ? 'Review assessment / references' : 'Complete checklist before disposition';
    const pendingVitals = (c.bpHold ? ['BP'] : []).concat(c.vitals && c.vitals.pending ? c.vitals.pending : []);
    $('checklist-status').textContent = (c.bpHold || c.vitalsHold) && c.complete ? 'All checklist items answered. Obtain ' + pendingVitals.join(', ') + ' now — disposition held until measured.' : !c.dispositionHeld ? 'Checklist complete. Clinician determines disposition; all-No is not clearance.' : (E.redFlagItems.length - c.missing.length) + '/' + E.redFlagItems.length + ' completed — no disposition available. ' + (!c.bp.measured ? c.bp.action + '. ' : '') + (c.vitals && c.vitals.action ? c.vitals.action + '. ' : '') + 'Never delay rescue.';
  }
  function readBP() {
    if ($('bp-not-measured').checked) return 'not_measured';
    const sbp = $('bp-sbp').value, dbp = $('bp-dbp').value;
    return {sbp:sbp === '' ? undefined : Number(sbp),dbp:dbp === '' ? undefined : Number(dbp)};
  }
  // HR/SpO2 mirror BP: checked or blank means not measured, so the UI never drops into legacy mode.
  function readVital(k) {
    if ($(k + '-not-measured').checked) return 'not_measured';
    const v = $('vital-' + k).value;
    return v === '' ? 'not_measured' : Number(v);
  }
  function resetVitals() { for (const k of ['hr', 'spo2']) { $(k + '-not-measured').checked = true; $('vital-' + k).value = ''; } }
  function bpEdited() { $('bp-not-measured').checked = false; run(); }
  function renderHandoff(s) {
    const h = $('handoff-history'); h.hidden = !s.handoffRequired;
    h.innerHTML = !s.handoffRequired ? '' : '<h3>Unresolved handoff and reassessment</h3><p>Reset did not resolve these alerts. An authorized clinician must document the original/corrected finding, repeat objective data or entry-error explanation, time, identity/role, rationale and acknowledgement in the approved clinical record. Transfer ongoing risks and obtain receiving-clinician acknowledgement. This de-identified reference tool does not authenticate clinicians, store PHI or replace that documentation; it cannot mark an alert resolved.</p><ul>' + s.handoffHistory.map(a => '<li>' + esc(a.text) + ' — unresolved</li>').join('') + '</ul>';
  }
  $('bp-not-measured').checked = true;
  resetVitals();
  for (const k of ['hr', 'spo2']) { $('vital-' + k).addEventListener('input', () => { $(k + '-not-measured').checked = false; run(); }); $(k + '-not-measured').addEventListener('change', () => { if ($(k + '-not-measured').checked) $('vital-' + k).value = ''; run(); }); }
  $('bp-sbp').value = ''; $('bp-dbp').value = '';
  $('bp-sbp').addEventListener('input', bpEdited); $('bp-dbp').addEventListener('input', bpEdited);
  $('bp-not-measured').addEventListener('change', () => { if ($('bp-not-measured').checked) { $('bp-sbp').value = ''; $('bp-dbp').value = ''; } run(); });
  renderChecklist();
  $('checklist-language').addEventListener('change', () => { checklistLanguage = $('checklist-language').value === 'es' ? 'es' : 'en'; renderChecklist(); });
  window.addEventListener('resize', () => { if (current) renderBanner(current); });
  $('go').onclick = run;
  $('hpi-form').addEventListener('submit', e => { e.preventDefault(); run(); });
  $('hpi').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(); } });
  // Editing or negating free text never erases checklist answers or latched alerts.
  $('hpi').addEventListener('input', run);
  $('clear').onclick = () => {
    const prior = current && current.safety;
    if (prior && prior.alerts.length && !window.confirm('Start over while RETAINING all unresolved alerts? Documented authorized clinician reassessment is required in the approved clinical record; reset cannot resolve them.')) return;
    $('hpi').value = ''; current = prior && prior.alerts.length ? {safety:{...prior,handoffRequired:true}} : null;
    checklistAnswers = {}; $('bp-not-measured').checked = true; $('bp-sbp').value = ''; $('bp-dbp').value = ''; resetVitals(); renderChecklist();
    $('result').hidden = true; $('privacy-warn').hidden = true; run(); $('hpi').focus();
  };
  run();
  // Do not let the browser restore the HPI from page cache.
  window.addEventListener('pagehide', () => { $('hpi').value = ''; current = null; renderBanner(null); });
  window.addEventListener('pageshow', () => { $('hpi').value = ''; });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
