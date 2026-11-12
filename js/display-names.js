/* Display-only clinical names. Internal content, IDs, source titles and links remain unchanged. */
(function(root){'use strict';
const rows=[
  {
    "id": "FORMULARY",
    "old": "Quick reference formulary (OB)",
    "name": "Obstetric medicines",
    "note": "Medicines reference, not one condition."
  },
  {
    "id": "ANT-10",
    "old": "Indicated late-preterm / early-term delivery (ACOG CO 831 + CO 751)",
    "name": "Delivery timing",
    "note": "Delivery-timing reference spans several conditions."
  },
  {
    "id": "LND-01",
    "old": "Intrapartum FHR (ACOG CPG 10)",
    "name": "Fetal heart rate monitoring",
    "note": ""
  },
  {
    "id": "LND-02",
    "old": "First and second stage labor (ACOG CPG 8)",
    "name": "Labor progress",
    "note": ""
  },
  {
    "id": "LND-03",
    "old": "Cervical ripening (ACOG CPG 9)",
    "name": "Cervical ripening",
    "note": "Procedure rather than a diagnosis."
  },
  {
    "id": "LND-04",
    "old": "Intraamniotic infection (CO 712 + 2024 CPU)",
    "name": "Intraamniotic infection",
    "note": ""
  },
  {
    "id": "LND-05",
    "old": "GBS prophylaxis (ACOG CO 797)",
    "name": "Group B strep prophylaxis during labor",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Group B streptococcal prevention"
    ],
    "previousName": "Group B streptococcal prevention"
  },
  {
    "id": "LND-06",
    "old": "Shoulder dystocia (ACOG PB 178)",
    "name": "Shoulder dystocia",
    "note": ""
  },
  {
    "id": "LND-07",
    "old": "Operative vaginal birth (ACOG PB 219)",
    "name": "Assisted vaginal birth",
    "note": "Procedure rather than a diagnosis."
  },
  {
    "id": "LND-08",
    "old": "TOLAC / VBAC (ACOG PB 205)",
    "name": "Labor after cesarean",
    "note": ""
  },
  {
    "id": "ANT-01",
    "old": "PROM / PPROM (ACOG PB 217)",
    "name": "Prelabor rupture of membranes, term and preterm",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Membrane rupture"
    ],
    "previousName": "Membrane rupture"
  },
  {
    "id": "ANT-02",
    "old": "Preterm labor (ACOG PB 171)",
    "name": "Preterm labor",
    "note": ""
  },
  {
    "id": "ANT-03",
    "old": "Cerclage (ACOG CPG 12)",
    "name": "Short cervix, cervical insufficiency and cerclage",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Cervical insufficiency"
    ],
    "previousName": "Cervical insufficiency"
  },
  {
    "id": "ANT-04",
    "old": "Gestational HTN / preeclampsia (PB 222 + 2024 CPU)",
    "name": "Hypertensive disorders of pregnancy",
    "note": ""
  },
  {
    "id": "ANT-05",
    "old": "Diabetes in pregnancy (ACOG PB 190 + 201)",
    "name": "Diabetes in pregnancy",
    "note": ""
  },
  {
    "id": "ANT-06",
    "old": "Antenatal corticosteroids (ACOG CO 713)",
    "name": "Antenatal corticosteroids",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Fetal lung maturation"
    ],
    "previousName": "Fetal lung maturation"
  },
  {
    "id": "ANT-07",
    "old": "Placenta accreta spectrum (ACOG OCC 7)",
    "name": "Placenta accreta spectrum",
    "note": ""
  },
  {
    "id": "ANT-08",
    "old": "Hyperemesis in Pregnancy (ACOG PB 189)",
    "name": "Nausea, vomiting and hyperemesis in pregnancy",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Hyperemesis gravidarum"
    ],
    "previousName": "Hyperemesis gravidarum"
  },
  {
    "id": "ANT-09",
    "old": "Outpatient antenatal surveillance (ACOG CO 828)",
    "name": "Antenatal fetal surveillance",
    "note": "Surveillance spans several conditions."
  },
  {
    "id": "GYN-01",
    "old": "Tubal ectopic (ACOG PB 193)",
    "name": "Tubal ectopic pregnancy",
    "note": ""
  },
  {
    "id": "GYN-02",
    "old": "Early pregnancy loss (ACOG PB 200)",
    "name": "Early pregnancy loss",
    "note": ""
  },
  {
    "id": "PP-01",
    "old": "Postpartum hemorrhage (PB 183 + 2025 CPU)",
    "name": "Postpartum hemorrhage",
    "note": ""
  },
  {
    "id": "PP-02",
    "old": "Anemia in pregnancy / postpartum (ACOG PB 233)",
    "name": "Pregnancy and postpartum anemia",
    "note": ""
  },
  {
    "id": "SYS-01",
    "old": "Critical care in pregnancy (ACOG PB 211)",
    "name": "Maternal critical illness",
    "note": ""
  },
  {
    "id": "SYS-02",
    "old": "Thromboembolism in pregnancy (ACOG PB 196 · CMQCC VTE)",
    "name": "Pregnancy-related thromboembolism",
    "note": ""
  },
  {
    "id": "GYNB-FORMULARY",
    "old": "Quick reference formulary (GYN)",
    "name": "Gynecologic medicines",
    "note": "Medicines reference, not one condition."
  },
  {
    "id": "GYNB-01",
    "old": "Tubal ectopic / PUL (ACOG PB 193)",
    "name": "Ectopic pregnancy and pregnancy of unknown location",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Ectopic pregnancy and unknown location"
    ],
    "previousName": "Ectopic pregnancy and unknown location"
  },
  {
    "id": "GYNB-02",
    "old": "Acute abnormal uterine bleeding (CO 557 + PB 128 / 136 / 228 + house)",
    "name": "Acute abnormal uterine bleeding",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Abnormal uterine bleeding"
    ],
    "previousName": "Abnormal uterine bleeding"
  },
  {
    "id": "GYNB-03",
    "old": "PID / tubo-ovarian abscess (CDC STI 2021 + house drainage)",
    "name": "Pelvic inflammatory disease and tubo-ovarian abscess",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Pelvic infection and abscess"
    ],
    "previousName": "Pelvic infection and abscess"
  },
  {
    "id": "GYNB-04",
    "old": "Adnexal torsion (ACOG PB 174)",
    "name": "Adnexal torsion",
    "note": ""
  },
  {
    "id": "GYNB-05",
    "old": "Adnexal mass (not torsion) (ACOG PB 174)",
    "name": "Adnexal mass",
    "note": ""
  },
  {
    "id": "GYNB-06",
    "old": "Pyelo / cUTI / obstructing stone (IDSA 2025 + AAFP 2019)",
    "name": "Kidney infection, complicated UTI and obstructing stones",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Complicated urinary infection and stones"
    ],
    "previousName": "Complicated urinary infection and stones"
  },
  {
    "id": "GYNB-07",
    "old": "IUD / implant emergencies (PB 186 + CO 672 + CDC)",
    "name": "Contraceptive device complications",
    "note": ""
  },
  {
    "id": "GYNB-08",
    "old": "Chronic pelvic pain (ACOG PB 218 + house PT)",
    "name": "Chronic pelvic pain",
    "note": ""
  },
  {
    "id": "GYNB-09",
    "old": "Post-hysterectomy + delayed complications (CO 750 + PB 195)",
    "name": "Hysterectomy complications",
    "note": ""
  },
  {
    "id": "GYNB-10",
    "old": "Molar pregnancy / GTD (ACOG 2025 + CC 11)",
    "name": "Molar pregnancy and trophoblastic disease",
    "note": ""
  },
  {
    "id": "SYS-02-EXP",
    "old": "VTE · CMQCC expanded text",
    "name": "Pregnancy-related blood clots: diagnosis, treatment and prevention",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Thrombosis prevention"
    ],
    "previousName": "Thrombosis prevention"
  },
  {
    "id": "SYS-02-QL",
    "old": "VTE prophylaxis quick look (SUPERSEDED 1 Oct 2026)",
    "name": "Thrombosis prevention — superseded; not current guidance",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Thrombosis prevention — prior guidance"
    ],
    "previousName": "Thrombosis prevention — prior guidance"
  },
  {
    "id": "FD-ANT-04",
    "old": "Severe-range BP: the 15-minute clock (flow v5)",
    "name": "Severe hypertension",
    "note": ""
  },
  {
    "id": "FD-PP-01",
    "old": "Postpartum hemorrhage flow (v3)",
    "name": "Postpartum hemorrhage response",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Acute postpartum bleeding"
    ],
    "previousName": "Acute postpartum bleeding"
  },
  {
    "id": "FD-LND-01",
    "old": "Category II FHR flow (v3)",
    "name": "Category II (indeterminate) fetal heart rate",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Indeterminate fetal heart rate"
    ],
    "previousName": "Indeterminate fetal heart rate"
  },
  {
    "id": "FD-SYS-03",
    "old": "Maternal sepsis flow (v3)",
    "name": "Maternal sepsis",
    "note": ""
  },
  {
    "id": "FD-SYS-02",
    "old": "Postpartum VTE prophylaxis decision tree (CMQCC)",
    "name": "Postpartum thrombosis prevention",
    "note": ""
  },
  {
    "id": "FD-LND-04",
    "old": "Intraamniotic infection: diagnose, treat, deliver (flow v2)",
    "name": "Suspected intraamniotic infection",
    "note": "Suspected distinguishes the assessment pathway from the reference; does not establish or exclude diagnosis."
  },
  {
    "id": "FD-GYN-01",
    "old": "Tubal ectopic and PUL: stable, scan, trend, treat (flow v2)",
    "name": "Suspected ectopic pregnancy or pregnancy of unknown location",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Suspected ectopic pregnancy"
    ],
    "previousName": "Suspected ectopic pregnancy"
  },
  {
    "id": "FD-GYNB-02",
    "old": "Acute abnormal uterine bleeding: stabilize, test, stop it (flow v2)",
    "name": "Acute uterine bleeding",
    "note": "Acute distinguishes emergency assessment from the general bleeding reference."
  },
  {
    "id": "FD-GYNB-04",
    "old": "Adnexal torsion and mass: call it, untwist, keep the ovary (flow v2)",
    "name": "Adnexal torsion and mass assessment",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Acute adnexal pain"
    ],
    "previousName": "Acute adnexal pain"
  },
  {
    "id": "FD-LND-06",
    "old": "Shoulder dystocia: call it, time it, work the maneuvers (flow v2)",
    "name": "Shoulder dystocia emergency",
    "note": "Emergency qualifier avoids collision with the clinical reference."
  },
  {
    "id": "FD-ANT-01",
    "old": "PROM and PPROM: confirm, date, manage by gestational age (flow v2)",
    "name": "Prelabor membrane rupture",
    "note": "Includes term and preterm rupture; prelabor is not limited to term pregnancy."
  },
  {
    "id": "FD-ANT-07",
    "old": "Placenta accreta spectrum: suspect, transfer, leave the placenta (flow v2)",
    "name": "Suspected placenta accreta spectrum",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Suspected placenta accreta"
    ],
    "previousName": "Suspected placenta accreta"
  },
  {
    "id": "FD-ED-OB",
    "old": "ED-to-OB pathway decision tree (v1, 14 Oct 2026)",
    "name": "Emergency department–obstetric triage and handoff",
    "note": "Doc review replacement applied; naming approval is not clinical-content or pilot approval.",
    "aliases": [
      "Pregnancy and postpartum triage"
    ],
    "previousName": "Pregnancy and postpartum triage"
  }
];
const headings={"Severe-range BP and eclampsia": "Severe hypertension and eclampsia", "GBS IAP · IAI · ACS · latency · EPL · NVP/HG · VTE · iron": "Other obstetric medicines", "PID / TOA / cuff": "Pelvic and postoperative infection", "Acute AUB · ectopic · molar": "Uterine bleeding and early pregnancy disorders", "cUTI / stone (not pregnant) · pregnancy · postop": "Urinary infection and stones", "SYS-02 APPENDIX · VTE PROPHYLAXIS QUICK LOOK — PROPOSED": "Thrombosis prevention — superseded; not current guidance", "1. Risk factors (visible first)": "Risk factors", "MAJOR (CS algorithm)": "Major cesarean risk factors", "MINOR": "Minor risk factors", "HIGH-RISK TRIGGERS (either mode)": "High-risk features", "2. Legend": "Key", "3. Stratification → treatment": "Risk and prevention", "4. Common intersections + doses": "Combined risk and doses"};
const byId=Object.fromEntries(rows.map(r=>[r.id,Object.freeze(r)]));
function title(item){return byId[typeof item==='string'?item:item.id]?.name||'Clinical reference';}
function topic(id){return byId[id]?.name||byId['FD-'+id]?.name||'Clinical reference';}
function image(item){return item.kind==='diagram'?'assets/display-diagrams/'+item.id+'.png':item.img;}
function searchText(item){return [title(item),item.id,item.display_id||'',item.title,(byId[item.id]?.aliases||[]).join(' '),item.text||''].join(' ').toLowerCase();}
function html(item){return (item.html||'').replace(/(<h[1-6]\b[^>]*>)([\s\S]*?)(<\/h[1-6]>)/gi,(_,a,b,c)=>{const plain=b.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').trim();const name=headings[plain]||plain.replace(/\b(?:flow|card|algorithm)\b/gi,'').replace(/^\d+[.)]\s*/,'').trim();return a+name+c;});}
function metadata(item){
 const raw=[item.source||'',item.img||''].join(' '),dates=raw.match(/20\d{2}[-_]\d{2}[-_]\d{2}/g)||[];
 return {source:item.source||'Not supplied',originalTitle:item.title,versionDates:[...new Set(dates.map(d=>d.replace(/_/g,'-')))],versionNote:dates.length?'Dates are source/file dates, not a new clinical review.':'Clinical version/date not explicitly supplied in metadata; local verification required.',reviewStatus:'Doc naming review applied; clinical-content, local adoption and pilot approval pending.',superseded:item.id==='SYS-02-QL'||!!item.superseded,currentId:item.id==='SYS-02-QL'?'FD-SYS-02':null};
}
const api=Object.freeze({rows:Object.freeze(rows),byId:Object.freeze(byId),title,topic,image,searchText,html,metadata});
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.DisplayNames=api;
})(typeof self!=='undefined'?self:this);
