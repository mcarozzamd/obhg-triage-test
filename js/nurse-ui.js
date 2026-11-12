/* Nurse complaint-tree UI (TEST build). One language per page: every string on a page comes
 * from ONE dictionary (EN or ES). SBAR copy text is English for the chart (Doc NF17).
 * Uses only getElementById / innerHTML / element listeners (no document-level listeners). */
(function(root){
 'use strict';
 const N=root.NurseFlow;
 const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const STR={
  en:{title:'Nurse triage (TEST)',test:'TEST / PRACTICE SITE: not for patient care. Do not enter real patient information.',back:'Back',next:'Next',yes:'Yes',no:'No',unsure:'Unsure',none:'None of these',noRest:'All others No',
   hpi:'Free text (optional, any time): can only raise acuity. No names, MRNs or dates of birth.',
   rescue:'Emergency? Activate rescue now. Never wait to finish this form.',
   gate:'Act now: is any of these happening?',gateHit:'EMERGENT: activate rescue now.',toResult:'Go to result / SBAR',contOpt:'Continue (optional)',
   gateLock:'A positive answer can only be changed through documented clinician reassessment.',
   vitals:'Vital signs',sbp:'SBP',dbp:'DBP',hr:'HR',spo2:'SpO2 %',nm:'Not measured',nmHold:'Not measured or invalid holds disposition; never delays rescue.',
   plang:'Patient’s preferred language',pen:'English',pes:'Spanish',pother:'Other',interp:'Interpreter',ipro:'Professional interpreter (record ID)',iqb:'Qualified bilingual clinician (CSM-qualified)',ifam:'Family, friend, partner or minor',inone:'None',
   interpNote:'Family/partner/minor interpreting never counts as professional and makes IPV/SI screening not private.',
   status:'Pregnancy status',su:'Unknown',slt:'Less than 20 weeks',sge:'20 weeks or more',spp:'Postpartum',sppNote:'Postpartum = delivered at ≥20 weeks. Pregnancy loss/abortion <20 weeks → choose “Less than 20 weeks”.',
   conflict:'Free text conflicts with the pregnancy status. All status-hidden questions are shown until resolved.',
   universal:'Other emergencies (every patient)',pick:'Main complaint: pick one',tree:'Complaint questions',already:'Already answered',
   safety:'Safety screen (every patient; answer each item)',priv:'Screened privately, without partner/family?',privYes:'Yes, privately',privNo:'No',privCant:'Cannot separate her',
   addon:'Trauma add-on (answer each item)',height:'Fall height (ft)',hUnknown:'Height unknown',
   catch:'Anything else? (symptoms from other complaints)',added:'Added questions',
   result:'Result',acuity:'Acuity',disp:'Disposition',held:'HELD — complete:',alerts:'Alerts',tasks:'Open tasks',notAsked:'Not asked',notAssessed:'Not assessed',na:'N/A by status',copy:'Copy SBAR (English, for the chart)',copied:'Copied',sbarShow:'Show SBAR',restart:'New assessment / reset',
   restartConfirm:'Start over while RETAINING all unresolved alerts? Documented clinician reassessment is required; reset cannot resolve them.',retained:'Retained from earlier in this assessment; clinician reassessment required.',
   immediate:'IMMEDIATE',urgent:'URGENT',prompt:'CLINICIAN REVIEW',EMERGENT:'EMERGENT',URGENT:'URGENT',PROMPT_CLINICIAN_REVIEW:'PROMPT CLINICIAN REVIEW',
   holds:{pick_complaint:'pick a complaint',unanswered:'unanswered questions',vitals:'BP, HR and SpO2',patient_language:'patient language',interpreter:'interpreter',private_screen:'private screening',status_conflict:'status conflict'},
   followUp:'Safety screen and vitals required before discharge/transfer.',unsureYes:'Unsure counts as Yes.',
   footer:'Decision support only · not unit policy · not the medical record · enter no PHI.'},
  es:{title:'Triaje de enfermería (PRUEBA)',test:'SITIO DE PRUEBA / PRÁCTICA: no es para la atención de pacientes. No ingrese información real de pacientes.',back:'Atrás',next:'Siguiente',yes:'Sí',no:'No',unsure:'No segura',none:'Ninguno de estos',noRest:'Todos los demás No',
   hpi:'Texto libre (opcional, en cualquier momento): solo puede aumentar la urgencia. Sin nombres, números de expediente ni fechas de nacimiento.',
   rescue:'¿Emergencia? Active el rescate ahora. Nunca espere a terminar este formulario.',
   gate:'Actuar ya: ¿está ocurriendo alguno de estos?',gateHit:'EMERGENTE: active el rescate ahora.',toResult:'Ir al resultado / SBAR',contOpt:'Continuar (opcional)',
   gateLock:'Una respuesta positiva solo puede cambiarse mediante una reevaluación clínica documentada.',
   vitals:'Signos vitales',sbp:'Sistólica',dbp:'Diastólica',hr:'FC',spo2:'SpO2 %',nm:'No medido',nmHold:'Un valor no medido o inválido detiene la disposición; nunca retrasa el rescate.',
   plang:'Idioma preferido de la paciente',pen:'Inglés',pes:'Español',pother:'Otro',interp:'Intérprete',ipro:'Intérprete profesional (anote el número)',iqb:'Clínico bilingüe calificado (calificado por CSM)',ifam:'Familiar, amistad, pareja o menor de edad',inone:'Ninguno',
   interpNote:'La interpretación por familiar, pareja o menor nunca cuenta como profesional y hace que la evaluación de violencia y de ideas suicidas no sea privada.',
   status:'Estado del embarazo',su:'Desconocido',slt:'Menos de 20 semanas',sge:'20 semanas o más',spp:'Posparto',sppNote:'Posparto = parto a las 20 semanas o más. Pérdida del embarazo o aborto antes de 20 semanas → elija “Menos de 20 semanas”.',
   conflict:'El texto libre no coincide con el estado del embarazo. Se muestran todas las preguntas ocultas hasta resolverlo.',
   universal:'Otras emergencias (todas las pacientes)',pick:'Motivo principal: elija uno',tree:'Preguntas del motivo',already:'Ya respondido',
   safety:'Evaluación de seguridad (todas las pacientes; responda cada punto)',priv:'¿Evaluada en privado, sin pareja ni familia?',privYes:'Sí, en privado',privNo:'No',privCant:'No se puede separar',
   addon:'Complemento de trauma (responda cada punto)',height:'Altura de la caída (pies)',hUnknown:'Altura desconocida',
   catch:'¿Algo más? (síntomas de otros motivos)',added:'Preguntas agregadas',
   result:'Resultado',acuity:'Urgencia',disp:'Disposición',held:'DETENIDA — complete:',alerts:'Alertas',tasks:'Tareas pendientes',notAsked:'No preguntado',notAssessed:'No evaluado',na:'No aplica por estado',copy:'Copiar SBAR (en inglés, para el expediente)',copied:'Copiado',sbarShow:'Ver SBAR (inglés)',restart:'Nueva evaluación / reiniciar',
   restartConfirm:'¿Empezar de nuevo CONSERVANDO todas las alertas sin resolver? Se requiere reevaluación clínica documentada; reiniciar no las resuelve.',retained:'Conservada de antes en esta evaluación; se requiere reevaluación clínica.',
   immediate:'INMEDIATA',urgent:'URGENTE',prompt:'REVISIÓN CLÍNICA',EMERGENT:'EMERGENTE',URGENT:'URGENTE',PROMPT_CLINICIAN_REVIEW:'REVISIÓN CLÍNICA PRONTA',
   holds:{pick_complaint:'elegir un motivo',unanswered:'preguntas sin responder',vitals:'PA, FC y SpO2',patient_language:'idioma de la paciente',interpreter:'intérprete',private_screen:'evaluación en privado',status_conflict:'conflicto de estado'},
   followUp:'Se requieren la evaluación de seguridad y los signos vitales antes del alta o traslado.',unsureYes:'No estoy segura cuenta como Sí.',
   footer:'Solo apoyo a la decisión · no es política de la unidad · no es el expediente médico · no ingrese información de salud protegida.',
   provisional:'Traducción provisional: pendiente de revisión por un clínico bilingüe calificado.'}
 };
 // Localized alert names (ES provisional). EN shows full engine text.
 const ALERT_ES={RF_SEVERE_BP:'Presión arterial grave (sistólica ≥160 o diastólica ≥110): evaluación clínica inmediata.',RF_SBP_LOW:'Sistólica <90: posible choque. Evaluación inmediata.',RF_ABNORMAL_VITALS:'FC ≥110 o SpO2 <95 %: evaluación inmediata de estabilidad.',RF_FALL_HIGH:'Caída de más de 10 pies o altura desconocida: evaluación inmediata.',FALL_HEIGHT_REQUIRED:'Paso requerido: anote la altura de la caída.',IPV_SAFETY:'Seguridad: no se puede separar o no está segura: INMEDIATA, con trabajo social.',PARTNER_RESCREEN:'Tarea: no evaluada en privado. Sepárela y vuelva a preguntar en privado con intérprete profesional.',RF_TRAUMA_DANGER:'Trauma sin todos los peligros descartados, sin evaluación privada o con bloqueo de idioma: INMEDIATA.',TRAUMA_WORKUP:'Trauma estable: seguir el estudio de trauma (monitoreo fetal ≥4 h si ≥20 semanas, Rh, Kleihauer-Betke).',RF_INTERPRETER_SI:'Pensamientos suicidas pasivos o intrusivos con bloqueo de idioma: INMEDIATA hasta evaluar con intérprete profesional.',RF_PUL_LOCK:'Embarazo de ubicación desconocida con bloqueo de idioma: evaluación inmediata.',TEXT_ABNORMAL_VITALS:'El texto libre indica signos vitales anormales: evaluación inmediata de estabilidad.',RF_ROM_LABOR:'Ruptura de membranas con trabajo de parto: evaluación obstétrica inmediata.'};
 const T=lang=>STR[lang]||STR.en;
 const itemLabel=(id,lang)=>N.ITEMS[id][lang==='es'?'es':'en'];
 // ---------- pure renderers (testable in Node) ----------
 function btn(act,id,val,text,pressed,extra){return '<button type="button" class="nf-btn" data-act="'+act+'" data-id="'+esc(id)+'" data-val="'+esc(val)+'" aria-pressed="'+(!!pressed)+'"'+(extra||'')+'>'+esc(text)+'</button>';}
 function row(s,r,id,lang,scr,forceRO){
  const L=T(lang),a=s.answers[id],locked=a==='yes'||a==='unsure';
  const where=s.where&&s.where[id],readonly=!!forceRO||(a!==undefined&&!!where&&where!==scr);
  const hint=N.ITEMS[id].hint?'<p class="nf-hint">'+esc(N.ITEMS[id].hint[lang])+'</p>':'';
  const opts=scr==='gate'&&!(s.noFit&&s.noFit.gate)?['yes','unsure']:['yes','no','unsure']; // gate: own Yes/Unsure per tile + group None (Doc ruling 7)
  const b=readonly?'<span class="nf-ro">'+esc(L.already)+': '+esc(a===undefined?'—':L[a])+'</span>':opts.map(v=>btn('ans',id,v,L[v],a===v,locked&&v==='no'?' disabled':'')).join('');
  return '<div class="nf-row" data-row="'+esc(id)+'"><div class="nf-q">'+esc(itemLabel(id,lang))+'</div>'+hint+'<div class="nf-ans">'+b+'</div>'+(locked&&!readonly?'<p class="nf-note">'+esc(a==='unsure'?L.unsureYes+' ':'')+esc(L.gateLock)+'</p>':'')+'</div>';
 }
 function groupBtn(s,ids,lang){if(s.noFit&&s.noFit[s.curScreen])return '';const L=T(lang),open=ids.filter(id=>s.answers[id]===undefined);if(!open.length)return '';const anyPos=ids.some(id=>s.answers[id]==='yes'||s.answers[id]==='unsure');return '<button type="button" class="nf-none" data-act="none" data-ids="'+esc(open.join(','))+'">'+esc((anyPos?L.noRest:L.none)+' ('+open.length+')')+'</button>';}
 function screens(s,r){
  const list=['gate','vitals','status','universal','pick','tree','safety'];
  if(r.traumaOn)list.push('addon');
  list.push('catch','result');return list;
 }
 function nmHTML(s,L){return btn('nm','bp','1',L.nm+' ('+L.sbp+'/'+L.dbp+')',s.bp==='not_measured')+btn('nm','hr','1',L.nm+' ('+L.hr+')',s.hr==='not_measured')+btn('nm','spo2','1',L.nm+' (SpO2)',s.spo2==='not_measured');}
 function visible(s,r,ids){return ids.filter(id=>r.states[id]!=='na_status');}
 function screenHTML(s,r,screen,lang){
  const L=T(lang);let h='';
  if(screen==='gate'){
   h+='<h2>'+esc(L.gate)+'</h2><p class="nf-warn">'+esc(L.rescue)+'</p>'+N.GATE.map(id=>row(s,r,id,lang,'gate')).join('')+groupBtn(s,N.GATE,lang);
   if(r.gateTapped)h+='<div class="nf-emergent"><b>'+esc(L.gateHit)+'</b> '+btn('go','','result',L.toResult)+btn('go','','vitals',L.contOpt)+'</div>';
  }else if(screen==='vitals'){
   const f=(k,lab,val)=>'<label class="nf-num">'+esc(lab)+'<input id="nf-'+k+'" data-num="'+k+'" type="number" inputmode="numeric" value="'+(Number.isFinite(val)?val:'')+'"></label>';
   const bp=s.bp&&typeof s.bp==='object'?s.bp:{};
   h+='<h2>'+esc(L.vitals)+'</h2><div class="nf-vitals">'+f('sbp',L.sbp,bp.sbp)+f('dbp',L.dbp,bp.dbp)+f('hr',L.hr,s.hr)+f('spo2',L.spo2,s.spo2)+'</div><div id="nf-nm">'+nmHTML(s,L)+'</div><p class="nf-hint">'+esc(L.nmHold)+'</p>'+
    '<h3>'+esc(L.plang)+'</h3>'+[['en',L.pen],['es',L.pes],['other',L.pother]].map(([v,t])=>btn('plang','',v,t,s.patientLanguage===v)).join('');
   if(r.interpreterNeeded)h+='<h3>'+esc(L.interp)+'</h3>'+[['professional',L.ipro],['qualified_bilingual',L.iqb],['family',L.ifam],['none',L.inone]].map(([v,t])=>btn('interp','',v,t,s.interpreter===v)).join('')+'<p class="nf-hint">'+esc(L.interpNote)+'</p>';
  }else if(screen==='status'){
   h+='<h2>'+esc(L.status)+'</h2>'+[['unknown',L.su],['lt20',L.slt],['ge20',L.sge],['postpartum',L.spp]].map(([v,t])=>btn('status','',v,t,s.status===v)).join('')+'<p class="nf-hint">'+esc(L.sppNote)+'</p>';
  }else if(screen==='universal'){
   const ids=visible(s,r,N.UNIVERSAL);h+='<h2>'+esc(L.universal)+'</h2>'+ids.map(id=>row(s,r,id,lang,'universal')).join('')+groupBtn(s,ids,lang);
  }else if(screen==='pick'){
   h+='<h2>'+esc(L.pick)+'</h2>'+Object.keys(N.TREES).map(t=>btn('tree','',t,N.TREES[t][lang],s.tree===t,' class="nf-big"')).join('');
  }else if(screen==='tree'){
   const seen=new Set();h+='<h2>'+esc(L.tree)+'</h2>';
   for(const t of r.activeTrees){
    const all=N.TREES[t].items.filter(id=>r.states[id]!=='na_status');
    const dup=all.filter(id=>seen.has(id)),ids=all.filter(id=>!seen.has(id));ids.forEach(i=>seen.add(i));
    const ro=N.TREES[t].shown.filter(id=>r.states[id]!=='na_status');
    const editable=ids.filter(id=>!(s.answers[id]!==undefined&&s.where&&s.where[id]&&s.where[id]!=='tree'));
    // NF15: an item shared by two trees is asked once; the second tree shows the same stored answer read-only.
    h+='<h3>'+esc(N.TREES[t][lang])+'</h3>'+ids.map(id=>row(s,r,id,lang,'tree')).join('')+groupBtn(s,editable,lang)+dup.map(id=>row(s,r,id,lang,'tree',true)).join('')+ro.map(id=>row(s,r,id,lang,'tree',true)).join('');
   }
  }else if(screen==='safety'){
   h+='<h2>'+esc(L.safety)+'</h2>'+N.SAFETY.map(id=>row(s,r,id,lang,'safety')).join('')+'<div class="nf-row"><div class="nf-q">'+esc(L.priv)+'</div><div class="nf-ans">'+[['yes',L.privYes],['no',L.privNo],['cannot_separate',L.privCant]].map(([v,t])=>btn('priv','',v,t,s.privateScreen===v)).join('')+'</div></div>';
  }else if(screen==='addon'){
   const ids=N.ADDON_ITEMS.filter(id=>r.states[id]!=='na_status');
   h+='<h2>'+esc(L.addon)+'</h2>'+ids.map(id=>row(s,r,id,lang,'addon')).join('')+N.MECH.map(id=>row(s,r,id,lang,'addon')).join('')+row(s,r,'fall',lang,'addon');
   if(s.answers.fall==='yes')h+='<label class="nf-num">'+esc(L.height)+'<input id="nf-fallHeight" data-num="fallHeight" type="number" inputmode="numeric" value="'+(Number.isFinite(s.fallHeight)?s.fallHeight:'')+'"></label>'+btn('hunk','','unknown',L.hUnknown,s.fallHeight==='unknown');
  }else if(screen==='catch'){
   const ids=[...r.headers,'other_concern'];h+='<h2>'+esc(L.catch)+'</h2>'+ids.map(id=>row(s,r,id,lang,'catch')).join('')+groupBtn(s,ids,lang);
   const extra=r.requiredItems.filter(id=>!N.ITEMS[id].header&&!N.GATE.includes(id)&&!N.UNIVERSAL.includes(id)&&!N.SAFETY.includes(id)&&!N.MECH.includes(id)&&id!=='fall'&&id!=='other_concern'&&r.activeTrees.some(t=>N.TREES[t].items.includes(id))&&!(s.tree&&N.TREES[s.tree].items.includes(id)));
   if(extra.length)h+='<h3>'+esc(L.added)+'</h3>'+extra.map(id=>row(s,r,id,lang,'catch')).join('')+groupBtn(s,extra.filter(id=>!(s.answers[id]!==undefined&&s.where[id]!=='catch')),lang);
  }else if(screen==='result'){
   const names=k=>Object.keys(r.states).filter(id=>r.states[id]===k&&!N.ITEMS[id].header).map(id=>itemLabel(id,lang));
   h+='<h2>'+esc(L.result)+'</h2><p class="nf-acuity" data-urgency="'+r.urgency+'"><b>'+esc(L.acuity)+': '+esc(L[r.urgency])+'</b> · '+esc(L.disp)+': '+esc(r.disposition?L[r.disposition]:L.held+' '+r.holds.map(x=>L.holds[x]).join(', '))+'</p>';
   if(r.followUp.length)h+='<p class="nf-warn">'+esc(L.followUp)+'</p>';
   h+='<h3>'+esc(L.alerts)+'</h3><ul>'+r.alerts.filter(x=>!x.task&&x.id!=='PARTNER_RESCREEN').map(x=>'<li class="'+(x.level==='red'?'nf-red':'nf-amber')+'">'+esc(alertText(x,lang))+(x.retained?' — '+esc(L.retained):'')+'</li>').join('')+'</ul>';
   const tasks=r.alerts.filter(x=>x.task||x.id==='PARTNER_RESCREEN'||x.id==='FALL_HEIGHT_REQUIRED');
   if(tasks.length)h+='<h3>'+esc(L.tasks)+'</h3><ul>'+tasks.map(x=>'<li>'+esc(alertText(x,lang))+'</li>').join('')+'</ul>';
   for(const [k,lab] of [['not_asked',L.notAsked],['not_assessed',L.notAssessed],['na_status',L.na]]){const n=names(k);if(n.length)h+='<details><summary>'+esc(lab)+' ('+n.length+')</summary><ul>'+n.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></details>';}
   h+=btn('copy','','1',L.copy)+'<details><summary>'+esc(L.sbarShow)+'</summary><textarea id="nf-sbar" readonly lang="en" rows="8">'+esc(r.sbar)+'</textarea></details>'+btn('reset','','1',L.restart);
  }
  return h;
 }
 function alertText(x,lang){
  if(lang!=='es')return x.text;
  const L=STR.es;
  if(x.itemId&&N.ITEMS[x.itemId])return N.ITEMS[x.itemId].es+' — '+L[x.urgency==='prompt'?'prompt':x.urgency];
  return ALERT_ES[x.id]||('Alerta adicional del texto libre — '+L[x.urgency==='prompt'?'prompt':x.urgency]);
 }
 function bannerHTML(r,lang){const L=T(lang);return '<b>'+esc(L.acuity)+': '+esc(L[r.urgency])+'</b>'+(r.disposition?' · '+esc(L[r.disposition]):'')+(r.statusConflict?'<p>'+esc(L.conflict)+'</p>':'')+(r.gateTapped?'<p>'+esc(L.gateHit)+'</p>':'');}
 function navHTML(s,r,screen,lang){const L=T(lang),list=screens(s,r),i=list.indexOf(screen);return (i>0?btn('nav','','-1',L.back):'')+(i<list.length-1?btn('nav','','1',L.next):'');}
 function pageStrings(lang){return T(lang);}
 const api={STR,ALERT_ES,screens,screenHTML,bannerHTML,navHTML,alertText,pageStrings};
 root.NurseUI=api;
 // ---------- controller (browser) ----------
 const doc=root.document;if(!doc||!doc.getElementById||!doc.getElementById('nurse-app'))return;
 const $=id=>doc.getElementById(id);
 let s=null,r=null,screen='lang',prior=null;
 function start(lang){s=N.create(lang);s.where={};s.noFit={};screen='gate';const L=T(lang);
  if(doc.documentElement)doc.documentElement.lang=lang;doc.title=L.title;$('nurse-title').textContent=L.title;$('nurse-test').textContent=L.test;$('nurse-hpi-label').textContent=L.hpi;$('nurse-footer').textContent=L.footer;$('nurse-prov').textContent=lang==='es'?STR.es.provisional:'';$('nurse-prov').hidden=lang!=='es';
  $('nurse-lang').hidden=true;$('nurse-main').hidden=false;$('nurse-hpi').value='';render();}
 function render(){r=N.evaluate(s,prior);prior=r.locked?r:{alerts:r.alerts,locked:false};
  const list=screens(s,r);if(!list.includes(screen))screen='catch';
  $('nurse-banner').innerHTML=bannerHTML(r,s.uiLang);$('nurse-banner').setAttribute('data-urgency',r.urgency);
  s.curScreen=screen;$('nurse-screen').innerHTML=screenHTML(s,r,screen,s.uiLang);if($('nurse-screen').setAttribute)$('nurse-screen').setAttribute('class','box nf-s-'+screen+(['gate','universal','tree','catch'].includes(screen)?' nf-compact':''));$('nurse-nav').innerHTML=navHTML(s,r,screen,s.uiLang);api.last={s,r,screen};fitCheck();}
 // Doc ruling 7: group None only when every item and the button are visible without scrolling; otherwise per-item No.
 function fitCheck(){const sc=$('nurse-screen'),b=$('nurse-banner');if(!sc.getBoundingClientRect||!sc.querySelector||s.noFit[screen]!==undefined)return;const n=sc.querySelector('[data-act=none]');if(!n)return;
  const span=n.getBoundingClientRect().bottom-sc.getBoundingClientRect().top,ban=b.getBoundingClientRect?b.getBoundingClientRect().height:0;
  s.noFit[screen]=span+ban>(root.innerHeight||0);if(s.noFit[screen])render();}
 function go(to){screen=to;render();if($('nurse-screen').scrollIntoView)$('nurse-screen').scrollIntoView({block:'start'});}
 function step(d){const list=screens(s,r);const i=Math.max(0,list.indexOf(screen)+d);go(list[Math.min(i,list.length-1)]);}
 function onClick(e){
  const el=e.target&&e.target.closest?e.target.closest('[data-act]'):null;if(!el)return;
  const d=el.dataset,act=d.act;
  if(act==='lang'){start(d.val);return;}
  if(!s)return;
  if(act==='ans'){if(s.answers[d.id]!==undefined&&s.where[d.id]&&s.where[d.id]!==screen){render();return;}const res=N.setAnswer(s,d.id,d.val,'item');if(res.ok)s.where[d.id]=screen;render();return;}
  if(act==='none'){const ids=String(d.ids||'').split(',').filter(Boolean);const g=N.groupNo(s,ids);if(g.ok)g.set.forEach(i=>s.where[i]=screen);render();const rr=r;if(screen!=='catch'&&!(screen==='gate'&&rr.gateTapped))step(1);return;}
  if(act==='nm'){s[d.id]='not_measured';if(d.id==='bp'){$('nf-sbp')&&($('nf-sbp').value='');}render();return;}
  if(act==='plang'){s.patientLanguage=d.val;render();return;}
  if(act==='interp'){s.interpreter=d.val;render();return;}
  if(act==='status'){s.status=d.val;render();step(1);return;}
  if(act==='tree'){s.tree=d.val;render();go('tree');return;}
  if(act==='priv'){s.privateScreen=d.val;render();return;}
  if(act==='hunk'){s.fallHeight='unknown';render();return;}
  if(act==='go'){go(d.val);return;}
  if(act==='nav'){step(+d.val);return;}
  if(act==='copy'){const t=r.sbar;if(root.navigator&&root.navigator.clipboard&&root.navigator.clipboard.writeText)root.navigator.clipboard.writeText(t).then(()=>{el.textContent=T(s.uiLang).copied;}).catch(()=>{});return;}
  if(act==='reset'){const L=T(s.uiLang);if(r.alerts.length&&root.confirm&&!root.confirm(L.restartConfirm))return;const keep={alerts:r.alerts.map(x=>({...x})),locked:false};const lang=s.uiLang;start(lang);prior=keep;render();return;}
 }
 function onInput(e){
  const t=e.target;if(!t||!s)return;
  if(t.id==='nurse-hpi'){s.text=t.value;render();return;}
  const k=t.dataset&&t.dataset.num;if(!k)return;
  const n=t.value===''?undefined:Number(t.value);
  if(k==='sbp'||k==='dbp'){const bp=s.bp&&typeof s.bp==='object'?{...s.bp}:{};bp[k]=n;if(bp.sbp===undefined&&bp.dbp===undefined)s.bp='not_measured';else s.bp=Object.fromEntries(Object.entries(bp).filter(([,v])=>v!==undefined));}
  else if(k==='fallHeight')s.fallHeight=n;
  else s[k]=n===undefined?'not_measured':n;
  r=N.evaluate(s,prior);prior=r.locked?r:{alerts:r.alerts,locked:false};$('nurse-banner').innerHTML=bannerHTML(r,s.uiLang);$('nurse-nav').innerHTML=navHTML(s,r,screen,s.uiLang);
  if(k!=='fallHeight'&&$('nf-nm'))$('nf-nm').innerHTML=nmHTML(s,T(s.uiLang));
  api.last={s,r,screen};
 }
 $('nurse-app').addEventListener('click',onClick);
 $('nurse-app').addEventListener('input',onInput);
 api.start=start;api.click=onClick;api.input=onInput;
})(typeof self!=='undefined'?self:this);
