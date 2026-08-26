const SUPABASE_URL = 'https://cuglyictqzfjpkksqfjn.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eE4FfeWwmToTk4hzS66jHw_UCFCLN0e';
const DATASET_URL = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json';
const MEDIA_NOTICE = 'La biblioteca textual puede integrarse según la licencia del repositorio. Los medios visuales externos no se muestran en esta versión.';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const demoExercises = [
  {id:'local-good-morning',name:'Buen día con disco',body_part:'upper legs',equipment:'disco',target:'isquiotibiales',secondary_muscles:['glúteos','zona media'],instructions:{es:'Realizá una bisagra de cadera manteniendo la espalda neutra. Llevá la cadera hacia atrás y volvé a la posición inicial controlando el movimiento.'},instruction_steps:{es:['Pies firmes al ancho aproximado de hombros.','Sostené el disco de manera segura.','Llevá la cadera hacia atrás sin redondear la espalda.','Volvé extendiendo la cadera y apretando glúteos.']},custom:true},
  {id:'local-row-plate',name:'Remo con disco',body_part:'back',equipment:'disco',target:'espalda',secondary_muscles:['bíceps','romboides'],instructions:{es:'Con el torso inclinado y espalda neutra, llevá el disco hacia el cuerpo y bajalo de forma controlada.'},instruction_steps:{es:['Adoptá una postura estable.','Incliná el torso conservando la espalda neutra.','Llevá el disco hacia el abdomen.','Juntá suavemente las escápulas y descendé controlado.']},custom:true},
  {id:'local-crunch',name:'Crunch con piernas arriba',body_part:'waist',equipment:'peso corporal / disco',target:'abdominales',secondary_muscles:['core'],instructions:{es:'Mantené las piernas elevadas y elevá el torso mediante una contracción abdominal sin tirar del cuello.'},instruction_steps:{es:['Acostate boca arriba y elevá las piernas.','Activá el abdomen.','Elevá el torso de forma corta y controlada.','Descendé sin perder tensión abdominal.']},custom:true},
  {id:'local-pullup',name:'Dominadas',body_part:'back',equipment:'barra',target:'dorsales',secondary_muscles:['bíceps','espalda alta'],instructions:{es:'Elevá el cuerpo desde la barra manteniendo control escapular y descendé de manera controlada.'},instruction_steps:{es:['Tomá la barra con agarre firme.','Activá hombros y abdomen.','Subí llevando el pecho hacia la barra.','Bajá controlando la extensión de los brazos.']},custom:true},
  {id:'local-trx-row',name:'Remo TRX',body_part:'back',equipment:'TRX',target:'espalda',secondary_muscles:['bíceps','core'],instructions:{es:'Con el cuerpo alineado, acercá el pecho a las manijas y extendé nuevamente los brazos.'},instruction_steps:{es:['Tomá las manijas y alineá el cuerpo.','Mantené abdomen activo.','Llevá el pecho hacia las manos.','Volvé de forma controlada.']},custom:true},
  {id:'local-deadlift',name:'Peso muerto sin rebote',body_part:'upper legs',equipment:'barra',target:'cadena posterior',secondary_muscles:['glúteos','isquiotibiales','espalda'],instructions:{es:'Levantá la carga mediante extensión de rodillas y cadera. Cada repetición se reinicia controlada, sin aprovechar rebote contra el piso.'},instruction_steps:{es:['Ubicá la carga cerca del cuerpo.','Fijá la espalda neutra y el abdomen.','Extendé cadera y rodillas hasta quedar erguido.','Descendé controlado y reiniciá sin rebote.']},custom:true},
  {id:'local-box-farmer',name:'Pasadas de cajón Farmer DB',body_part:'upper legs',equipment:'mancuernas + cajón',target:'piernas',secondary_muscles:['glúteos','agarre','core'],instructions:{es:'Sostené las mancuernas a los costados y realizá las pasadas/subidas al cajón con control.'},instruction_steps:{es:['Sostené una mancuerna en cada mano.','Asegurá el apoyo completo del pie en el cajón.','Subí manteniendo el torso estable.','Descendé con control y alterná según la consigna.']},custom:true},
  {id:'local-cleanjerk',name:'Hang Clean & Jerk alternado DB',body_part:'shoulders',equipment:'mancuerna',target:'cuerpo completo',secondary_muscles:['hombros','piernas','core'],instructions:{es:'Desde posición hang, llevá la mancuerna al hombro mediante el clean y luego sobre la cabeza con el jerk, alternando brazos.'},instruction_steps:{es:['Partí con la mancuerna desde hang.','Extendé la cadera y recibí la mancuerna en el hombro.','Impulsá y llevá la mancuerna sobre la cabeza.','Bloqueá arriba con control y alterná el brazo.']},custom:true},
  {id:'local-swing',name:'Swing americano con kettlebell',body_part:'upper legs',equipment:'kettlebell',target:'glúteos',secondary_muscles:['isquiotibiales','hombros','core'],instructions:{es:'Generá el impulso desde la cadera y acompañá la kettlebell hasta arriba de la cabeza.'},instruction_steps:{es:['Iniciá con una bisagra de cadera.','Llevá la kettlebell entre las piernas.','Extendé fuerte la cadera.','Acompañá el recorrido hasta arriba y controlá el regreso.']},custom:true},
  {id:'local-vups',name:'V-Ups',body_part:'waist',equipment:'peso corporal',target:'abdominales',secondary_muscles:['flexores de cadera'],instructions:{es:'Elevá simultáneamente torso y piernas buscando acercar manos y pies.'},instruction_steps:{es:['Partí extendido boca arriba.','Activá el abdomen.','Elevá piernas y torso a la vez.','Descendé de manera controlada.']},custom:true}
];

const sampleWorkout = {
  reps:'15 · 12 · 9 · 5 · 3',
  activation:['local-good-morning','local-row-plate','local-crunch'],
  blocks:[
    {name:'A',tc:6,rest:1,exercises:['local-pullup','local-trx-row','local-deadlift']},
    {name:'B',tc:6,rest:1,exercises:['local-box-farmer','local-cleanjerk']},
    {name:'C',tc:6,rest:1,exercises:['local-swing']},
    {name:'D',tc:6,rest:0,exercises:['local-vups']}
  ]
};

const state = {
  session:null,user:null,profile:null,guest:false,view:'home',selectedDay:localDay(0),
  sessions:[],myReservations:[],templates:[],attendees:{},workout:null,
  dataset:demoExercises,datasetLoaded:false,query:'',filter:'todos',modal:null,
  busy:false,message:null
};

function localDay(add=0){ const d=new Date(); d.setDate(d.getDate()+add); const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
function h(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function fmtTime(t){return (t||'').slice(0,5)}
function fmtDay(s){ if(!s)return''; const [y,m,d]=s.split('-').map(Number); return new Intl.DateTimeFormat('es-AR',{weekday:'short',day:'2-digit',month:'2-digit'}).format(new Date(y,m-1,d)); }
function isStaff(){return ['coach','admin'].includes(state.profile?.role)}
function exById(id){return state.dataset.find(x=>x.id===id)||demoExercises.find(x=>x.id===id)}
function iconFor(ex){const p=ex?.body_part; return p==='back'?'🪽':p==='waist'?'🔥':p==='shoulders'?'💪':p==='upper legs'?'🦵':p==='cardio'?'❤️':'🏋️'}
function setMessage(text,type='notice'){state.message={text,type};render(); setTimeout(()=>{state.message=null;render()},3000)}

async function init(){
  const {data:{session}}=await sb.auth.getSession();
  state.session=session; state.user=session?.user||null;
  if(state.user) await loadProfile();
  await refreshPublic();
  sb.auth.onAuthStateChange(async(_event,session)=>{state.session=session;state.user=session?.user||null;if(state.user)await loadProfile();else state.profile=null;await refreshPublic();render();});
  render();
}

async function loadProfile(){
  const {data,error}=await sb.from('profiles').select('id,full_name,role,active').eq('id',state.user.id).maybeSingle();
  if(error) console.error(error); state.profile=data||null;
}

async function refreshPublic(){
  const [{data:sessions,error:se},{data:templates,error:te},{data:workouts,error:we}] = await Promise.all([
    sb.from('class_sessions').select('id,class_date,label,start_time,end_time,capacity,is_open,confirmed_count,waitlist_count').eq('class_date',state.selectedDay).order('start_time'),
    sb.from('class_templates').select('*').order('sort_order'),
    sb.from('workouts').select('*').eq('day',state.selectedDay).maybeSingle()
  ]);
  if(se)console.error(se); if(te)console.error(te); if(we)console.error(we);
  state.sessions=(sessions||[]).map(s=>({...s,spots_left:Math.max((s.capacity||0)-(s.confirmed_count||0),0)})); state.templates=templates||[]; state.workout=workouts||null;
  state.myReservations=[]; state.attendees={};
  if(state.user && state.sessions.length){
    const ids=state.sessions.map(s=>s.id);
    const {data:r}=await sb.from('reservations').select('session_id,status,user_id,created_at').in('session_id',ids);
    state.myReservations=(r||[]).filter(x=>x.user_id===state.user.id);
    if(isStaff()) await loadAttendees(r||[]);
  }
}

async function loadAttendees(reservations){
  const active=reservations.filter(r=>r.status!=='cancelled');
  const ids=[...new Set(active.map(r=>r.user_id))];
  let profiles=[];
  if(ids.length){ const {data}=await sb.from('profiles').select('id,full_name').in('id',ids); profiles=data||[]; }
  const names=Object.fromEntries(profiles.map(p=>[p.id,p.full_name]));
  state.attendees={};
  for(const r of active){ (state.attendees[r.session_id] ||= []).push({...r,name:names[r.user_id]||'Alumno'}); }
}

function authScreen(){return `<div class="login-wrap"><div class="login-card"><div class="login-logo">E</div><h1>ENTRENA</h1><p>Reservá tu turno y consultá los ejercicios desde el celular. No hace falta instalar una app.</p>${state.message?`<div class="${state.message.type}">${h(state.message.text)}</div>`:''}<div class="filters" style="margin:14px 0 8px"><button class="chip active" data-auth-tab="login">Ingresar</button><button class="chip" data-auth-tab="signup">Crear cuenta</button></div><form id="authForm" class="form-grid" data-mode="login"><div class="field signup-only" style="display:none"><label>Nombre y apellido</label><input name="full_name" autocomplete="name" /></div><div class="field"><label>Correo</label><input name="email" type="email" required autocomplete="email" /></div><div class="field"><label>Contraseña</label><input name="password" type="password" minlength="6" required autocomplete="current-password" /></div><button class="primary-btn" type="submit">Ingresar</button></form><button class="ghost-btn" style="width:100%;margin-top:10px" data-action="guest">Mirar sin cuenta</button><div class="login-hint">Para reservar sí necesitás una cuenta. Podés mirar el manual y los ejercicios sin registrarte.</div></div></div>`}

function topbar(){return `<header class="topbar"><div class="topbar-inner"><div class="brand"><div class="brand-badge">E</div><div>ENTRENA<small>${isStaff()?'Panel profesor':state.profile?.full_name||'Modo consulta'}</small></div></div><button class="icon-btn" data-view="profile">👤</button></div></header>`}
function nav(){const n=[['home','🏠','Inicio'],['slots','📅','Turnos'],['library','🏋️','Ejercicios'],['manual','📖','Manual'],[isStaff()?'admin':'profile',isStaff()?'⚙️':'👤',isStaff()?'Profe':'Perfil']];return `<nav class="bottom-nav"><div class="bottom-nav-inner">${n.map(([v,i,l])=>`<button class="nav-btn ${state.view===v?'active':''}" data-view="${v}"><span>${i}</span>${l}</button>`).join('')}</div></nav>`}
function dateStrip(){return `<div class="filters" style="margin-top:12px">${[0,1,2,3,4,5,6].map(n=>{const d=localDay(n);return `<button class="chip ${state.selectedDay===d?'active':''}" data-day="${d}">${n===0?'Hoy':n===1?'Mañana':fmtDay(d)}</button>`}).join('')}</div>`}
function messageBar(){return state.message?`<div class="${state.message.type}" style="margin-top:12px">${h(state.message.text)}</div>`:''}

function slotCard(s,compact=false){
  const mine=state.myReservations.find(r=>r.session_id===s.id && r.status!=='cancelled');
  const pct=Math.min(100,Math.round((s.confirmed_count/s.capacity)*100));
  const closed=!s.is_open; const full=s.spots_left<=0;
  let action='';
  if(mine){action=`<button class="danger-btn" data-cancel="${s.id}">${mine.status==='waitlist'?'Salir de espera':'Cancelar'}</button>`}
  else if(state.user){action=`<button class="primary-btn" data-reserve="${s.id}" ${closed?'disabled':''}>${full?'Lista de espera':'Anotarme'}</button>`}
  else action=`<button class="primary-btn" data-action="need-login">Anotarme</button>`;
  return `<article class="card slot"><div><div class="slot-title">${fmtTime(s.start_time)} — ${fmtTime(s.end_time)}</div><div class="slot-meta">${h(s.label)} · ${s.confirmed_count}/${s.capacity} anotados${s.waitlist_count?` · ${s.waitlist_count} en espera`:''}</div><div class="capacity ${full?'full':''}"><span style="width:${pct}%"></span></div>${mine?`<div class="section-sub" style="margin-top:8px">${mine.status==='confirmed'?'✅ Tenés tu lugar':'⏳ Estás en lista de espera'}</div>`:''}</div>${compact?`<div class="kpi"><strong>${s.spots_left}</strong>libres</div>`:action}</article>`;
}

function sampleWorkoutHtml(payload=sampleWorkout,title='Rutina de ejemplo'){
  const act=(payload.activation||[]).map(id=>exById(id)).filter(Boolean);
  const blocks=payload.blocks||[];
  return `<article class="card"><div class="workout-header"><div class="workout-icon">🔥</div><div><div class="workout-title">${h(title)}</div><div class="workout-reps">${h(payload.reps||'')}</div></div></div><h2 style="margin-top:18px">Activación</h2>${act.map(ex=>exerciseRow(ex)).join('')} ${blocks.map(b=>`<div style="margin-top:16px"><div class="section-head"><h2>WOD ${h(b.name)}</h2><span class="pill">TC ${b.tc||0}'${b.rest?` · REST ${b.rest}'`:''}</span></div>${(b.exercises||[]).map(id=>exerciseRow(exById(id))).join('')}</div>`).join('')}</article>`;
}
function exerciseRow(ex){if(!ex)return'';return `<div class="exercise-row"><div><div class="exercise-name">${h(ex.name)}</div><div class="exercise-note">${h(ex.target||'')} · ${h(ex.equipment||'')}</div></div><button class="mini-btn" data-exercise="${h(ex.id)}">Ver</button></div>`}

function homeView(){const workoutPayload=state.workout?.payload||sampleWorkout; const title=state.workout?.title||(state.workout?'Entrenamiento':'Rutina de ejemplo'); return `<section class="hero"><div class="hero-row"><div><h1>${state.profile?`Hola, ${h((state.profile.full_name||'').split(' ')[0])}`:'Entrenamiento'}</h1><p>Elegí el horario que te quede cómodo y revisá la rutina antes de la clase.</p></div><span class="pill">${fmtDay(state.selectedDay)}</span></div>${dateStrip()}</section>${messageBar()}<section class="section"><div class="section-head"><div><h2>Turnos</h2><div class="section-sub">Cupos actualizados para el día elegido</div></div><button class="mini-btn" data-view="slots">Ver todos</button></div><div class="grid">${state.sessions.length?state.sessions.slice(0,2).map(s=>slotCard(s,true)).join(''):`<div class="empty card">Todavía no hay turnos habilitados para este día.</div>`}</div></section><section class="section"><div class="section-head"><div><h2>Entrenamiento del día</h2><div class="section-sub">Tocá un ejercicio para ver cómo se realiza</div></div>${isStaff()&&!state.workout?'<button class="mini-btn" data-action="publish-demo">Publicar ejemplo</button>':''}</div>${sampleWorkoutHtml(workoutPayload,title)}</section>`}

function slotsView(){return `<section class="hero"><h1>Reservar turno</h1><p>Elegí el día y reservá un solo horario. Si no vas a poder ir, cancelalo para liberar el cupo.</p>${dateStrip()}</section>${messageBar()}<section class="section"><div class="grid">${state.sessions.length?state.sessions.map(s=>slotCard(s)).join(''):`<div class="empty card">No hay turnos habilitados para ${fmtDay(state.selectedDay)}.${isStaff()?'<br><br><button class="primary-btn" data-action="generate-day">Habilitar turnos del día</button>':''}</div>`}</div></section>`}

function libraryView(){const items=state.dataset.filter(ex=>{const q=state.query.trim().toLowerCase();const txt=`${ex.name} ${ex.target||''} ${ex.equipment||''} ${(ex.secondary_muscles||[]).join(' ')}`.toLowerCase();return (!q||txt.includes(q))&&(state.filter==='todos'||ex.body_part===state.filter)}).slice(0,80);const filters=[['todos','Todos'],['back','Espalda'],['upper legs','Piernas'],['waist','Abdomen'],['shoulders','Hombros'],['chest','Pecho'],['cardio','Cardio']];return `<section class="hero"><h1>Biblioteca de ejercicios</h1><p>Buscá por nombre, músculo o elemento. La base grande se descarga sólo si vos la pedís.</p></section><section class="section"><input id="exerciseSearch" class="search" placeholder="Buscar: peso muerto, espalda, mancuerna..." value="${h(state.query)}"><div class="filters" style="margin-top:10px">${filters.map(([k,l])=>`<button class="chip ${state.filter===k?'active':''}" data-filter="${k}">${l}</button>`).join('')}</div><div class="notice warning">${MEDIA_NOTICE}</div><button class="${state.datasetLoaded?'ghost-btn':'primary-btn'}" style="margin-top:10px" data-action="load-dataset">${state.datasetLoaded?'Base completa cargada':'Cargar base completa (~17 MB)'}</button></section><section class="section"><div class="grid cols2">${items.map(ex=>`<article class="card exercise-card"><div class="exercise-thumb">${iconFor(ex)}</div><div><div class="exercise-name">${h(ex.name)}</div><div class="section-sub">${h(ex.target||'')} · ${h(ex.equipment||'')}</div></div><button class="mini-btn" data-exercise="${h(ex.id)}">Ver</button></article>`).join('')}</div></section>`}

function manualView(){return `<section class="hero"><h1>Manual para empezar</h1><p>Una guía corta para entender la clase y las siglas más comunes.</p></section><section class="section split"><article class="card"><h2>¿Para qué sirve la activación?</h2><p class="muted">Prepara progresivamente músculos, articulaciones y sistema cardiovascular para el trabajo que viene. También sirve para practicar los patrones de movimiento antes de cargar más peso.</p><dl class="glossary"><dt>WOD</dt><dd>Workout of the Day: bloque principal del entrenamiento.</dd><dt>TC / Time Cap</dt><dd>Tiempo máximo para completar un bloque.</dd><dt>REST</dt><dd>Descanso programado.</dd><dt>AMRAP</dt><dd>La mayor cantidad de rondas o repeticiones posibles dentro de un tiempo.</dd><dt>EMOM</dt><dd>Un trabajo que empieza al comienzo de cada minuto.</dd><dt>ALT</dt><dd>Alternado: se cambia lado o brazo.</dd><dt>DB / KB</dt><dd>DB = mancuerna. KB = kettlebell.</dd></dl></article><article class="card"><h2>Regla principal</h2><p class="muted">Primero técnica, después velocidad. Si una carga hace perder postura o control, conviene bajar peso o usar una variante más sencilla.</p><div class="notice warning">La web es una guía. La ejecución y las variantes las define el profesor en clase.</div><h2 style="margin-top:18px">Cómo usar ENTRENA</h2><p class="muted">1. Elegí el día.<br>2. Reservá tu turno.<br>3. Mirá la rutina.<br>4. Tocá cada ejercicio para ver los pasos.<br>5. Si no vas, cancelá el turno.</p></article></section>`}

function profileView(){if(!state.user)return `<section class="hero"><h1>Modo consulta</h1><p>Podés ver el manual y los ejercicios sin cuenta.</p></section><section class="section"><article class="card"><button class="primary-btn" data-action="login">Ingresar para reservar</button></article></section>`;return `<section class="hero"><h1>${h(state.profile?.full_name||state.user.email)}</h1><p>${isStaff()?'Profesor / administrador':'Alumno'} · ${h(state.user.email||'')}</p></section><section class="section"><article class="card"><div class="notice">Los alumnos ven cantidad de cupos. La lista de nombres queda reservada al profesor.</div><button class="danger-btn" style="margin-top:14px" data-action="logout">Cerrar sesión</button></article></section>`}

function adminView(){if(!isStaff())return profileView();return `<section class="hero"><h1>Panel del profesor</h1><p>Configurá horarios y mirá quién está anotado. Los cambios se guardan en la nube.</p>${dateStrip()}</section>${messageBar()}<section class="section"><div class="section-head"><div><h2>Turnos del día</h2><div class="section-sub">${fmtDay(state.selectedDay)}</div></div><button class="primary-btn" data-action="generate-day">Habilitar turnos</button></div><div class="grid">${state.sessions.map(s=>`<article class="card"><div class="section-head"><div><div class="slot-title">${fmtTime(s.start_time)} — ${fmtTime(s.end_time)}</div><div class="slot-meta">${s.confirmed_count}/${s.capacity} confirmados</div></div><span class="pill">${s.spots_left} libres</span></div><div class="attendees">${(state.attendees[s.id]||[]).filter(a=>a.status==='confirmed').map(a=>`<span class="person">${h(a.name)}</span>`).join('')||'<span class="section-sub">Todavía nadie confirmado.</span>'}</div>${(state.attendees[s.id]||[]).some(a=>a.status==='waitlist')?`<div class="section-sub" style="margin-top:10px">Espera: ${(state.attendees[s.id]||[]).filter(a=>a.status==='waitlist').map(a=>h(a.name)).join(', ')}</div>`:''}</article>`).join('')||'<div class="empty card">No hay turnos generados para este día.</div>'}</div></section><section class="section"><div class="section-head"><div><h2>Horarios base</h2><div class="section-sub">Los de la tarde quedan apagados hasta que definas el horario real.</div></div></div><form id="templatesForm" class="form-grid">${state.templates.map((t,i)=>`<article class="card"><div class="two"><div class="field"><label>${h(t.label)} · Desde</label><input type="time" name="start_${i}" value="${fmtTime(t.start_time)}"></div><div class="field"><label>Hasta</label><input type="time" name="end_${i}" value="${fmtTime(t.end_time)}"></div></div><div class="two" style="margin-top:10px"><div class="field"><label>Cupo</label><input type="number" min="1" max="100" name="cap_${i}" value="${t.capacity}"></div><div class="field"><label>Estado</label><select name="active_${i}"><option value="1" ${t.active?'selected':''}>Activo</option><option value="0" ${!t.active?'selected':''}>Inactivo</option></select></div></div><input type="hidden" name="id_${i}" value="${t.id}"></article>`).join('')}<button class="primary-btn" type="submit">Guardar horarios</button></form></section>`}

function modalHtml(){const ex=state.modal;if(!ex)return'';const steps=ex.instruction_steps?.es?.length?ex.instruction_steps.es:(ex.instructions?.es?[ex.instructions.es]:[]);return `<div class="modal-backdrop" data-action="close-modal"><section class="modal" onclick="event.stopPropagation()"><div class="modal-inner"><div class="modal-grab"></div><div class="exercise-thumb" style="width:58px;height:58px;font-size:26px;margin-bottom:12px">${iconFor(ex)}</div><h3>${h(ex.name)}</h3><div class="muted">Objetivo: ${h(ex.target||'—')} · Equipo: ${h(ex.equipment||'—')}</div><div class="steps">${steps.map(s=>`<div class="step"><div>${h(s)}</div></div>`).join('')}</div><div class="notice warning" style="margin-top:14px">Ejemplo orientativo. Seguí la variante y las correcciones que indique el profesor.</div><div class="modal-actions"><button class="primary-btn" data-action="close-modal">Entendido</button></div></div></section></div>`}

function appView(){let content='';if(state.view==='home')content=homeView();if(state.view==='slots')content=slotsView();if(state.view==='library')content=libraryView();if(state.view==='manual')content=manualView();if(state.view==='profile')content=profileView();if(state.view==='admin')content=adminView();return `<div class="app-shell">${topbar()}<main class="container">${content}</main>${nav()}${modalHtml()}</div>`}
function render(){document.getElementById('app').innerHTML=(!state.user&&!state.guest)?authScreen():appView();bind()}

function bind(){
  let mode='login';
  document.querySelectorAll('[data-auth-tab]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.authTab;document.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.toggle('active',x===b));const f=document.getElementById('authForm');f.dataset.mode=mode;f.querySelector('.signup-only').style.display=mode==='signup'?'block':'none';f.querySelector('button[type=submit]').textContent=mode==='signup'?'Crear cuenta':'Ingresar';f.querySelector('[name=password]').autocomplete=mode==='signup'?'new-password':'current-password';}));
  document.getElementById('authForm')?.addEventListener('submit',authSubmit);
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;render();scrollTo(0,0)}));
  document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',async()=>{state.selectedDay=b.dataset.day;await refreshPublic();render()}));
  document.querySelectorAll('[data-exercise]').forEach(b=>b.addEventListener('click',()=>{state.modal=exById(b.dataset.exercise);render()}));
  document.querySelectorAll('[data-reserve]').forEach(b=>b.addEventListener('click',()=>reserve(b.dataset.reserve)));
  document.querySelectorAll('[data-cancel]').forEach(b=>b.addEventListener('click',()=>cancelRes(b.dataset.cancel)));
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;render()}));
  document.getElementById('exerciseSearch')?.addEventListener('input',e=>{state.query=e.target.value;render();const n=document.getElementById('exerciseSearch');n?.focus()});
  document.getElementById('templatesForm')?.addEventListener('submit',saveTemplates);
  document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',async()=>{const a=b.dataset.action;if(a==='guest'){state.guest=true;render()}if(a==='login'){state.guest=false;render()}if(a==='logout'){await sb.auth.signOut();state.guest=false;state.view='home'}if(a==='need-login'){state.guest=false;render()}if(a==='close-modal'){state.modal=null;render()}if(a==='load-dataset'){await loadFullDataset(b)}if(a==='generate-day'){await generateDay()}if(a==='publish-demo'){await publishDemo()}}));
}

async function authSubmit(e){e.preventDefault();const f=e.currentTarget,fd=new FormData(f),email=String(fd.get('email')).trim(),password=String(fd.get('password')),mode=f.dataset.mode||'login';state.busy=true;if(mode==='signup'){const full_name=String(fd.get('full_name')||'').trim();const {data,error}=await sb.auth.signUp({email,password,options:{data:{full_name}}});if(error)return setMessage(error.message,'notice warning');if(!data.session)return setMessage('Cuenta creada. Revisá tu correo para confirmar y después ingresá.','notice success');}else{const {error}=await sb.auth.signInWithPassword({email,password});if(error)return setMessage('No pude ingresar. Revisá correo y contraseña.','notice warning');}}

async function reserve(id){const {data,error}=await sb.rpc('reserve_session',{p_session_id:id});if(error){const m=error.message.includes('already_reserved_other_slot')?'Ya tenés otro turno reservado para ese día. Cancelalo antes de cambiar.':error.message.includes('session_not_available')?'Ese turno ya no está disponible.':'No pude hacer la reserva.';setMessage(m,'notice warning');return}await refreshPublic();setMessage(data==='waitlist'?'El turno está completo: quedaste en lista de espera.':'Listo, tu lugar quedó reservado.','notice success')}
async function cancelRes(id){const {error}=await sb.rpc('cancel_reservation',{p_session_id:id});if(error)return setMessage('No pude cancelar la reserva.','notice warning');await refreshPublic();setMessage('Reserva cancelada y cupo liberado.','notice success')}
async function generateDay(){const {error}=await sb.rpc('generate_sessions_for_day',{p_day:state.selectedDay});if(error)return setMessage('No pude habilitar los turnos. Verificá que tu cuenta tenga rol de profesor.','notice warning');await refreshPublic();setMessage('Turnos habilitados para el día elegido.','notice success')}
async function publishDemo(){const row={day:state.selectedDay,title:'Entrenamiento del día',intro:'Rutina cargada desde la pizarra.',payload:sampleWorkout,published:true,created_by:state.user.id};const {error}=await sb.from('workouts').upsert(row,{onConflict:'day'});if(error)return setMessage('No pude publicar la rutina.','notice warning');await refreshPublic();setMessage('Rutina de ejemplo publicada.','notice success')}
async function saveTemplates(e){e.preventDefault();const fd=new FormData(e.currentTarget);for(let i=0;i<state.templates.length;i++){const id=fd.get(`id_${i}`),active=fd.get(`active_${i}`)==='1',start=fd.get(`start_${i}`)||null,end=fd.get(`end_${i}`)||null,capacity=Number(fd.get(`cap_${i}`)||10);if(active&&(!start||!end)){setMessage('Para activar un turno tenés que completar desde y hasta.','notice warning');return}const {error}=await sb.from('class_templates').update({start_time:start,end_time:end,capacity,active}).eq('id',id);if(error){console.error(error);setMessage('No pude guardar los horarios.','notice warning');return}}await refreshPublic();setMessage('Horarios guardados.','notice success')}

async function loadFullDataset(btn){if(state.datasetLoaded)return;const old=btn.textContent;btn.textContent='Cargando…';btn.disabled=true;try{let data=await idbGet('exercises-v1');if(!data){const r=await fetch(DATASET_URL,{cache:'force-cache'});if(!r.ok)throw new Error();data=await r.json();await idbSet('exercises-v1',data)}const mapped=data.map(x=>({id:`gh-${x.id}`,name:x.name,body_part:x.body_part,equipment:x.equipment,target:x.target,secondary_muscles:x.secondary_muscles||[],instructions:{es:x.instructions?.es||''},instruction_steps:{es:x.instruction_steps?.es||[]}}));state.dataset=[...demoExercises,...mapped];state.datasetLoaded=true;state.query='';render()}catch{setMessage('No pude cargar la base completa. Revisá Internet e intentá de nuevo.','notice warning');btn.textContent=old;btn.disabled=false}}
function idbOpen(){return new Promise((resolve,reject)=>{const req=indexedDB.open('entrena-cache',1);req.onupgradeneeded=()=>req.result.createObjectStore('kv');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function idbGet(key){try{const db=await idbOpen();return await new Promise((resolve,reject)=>{const tx=db.transaction('kv','readonly');const r=tx.objectStore('kv').get(key);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}catch{return null}}
async function idbSet(key,val){try{const db=await idbOpen();return await new Promise((resolve,reject)=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(val,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}catch{}}

if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
init().catch(err=>{console.error(err);document.getElementById('app').innerHTML='<div class="login-wrap"><div class="login-card"><h1>ENTRENA</h1><p>No pude iniciar la conexión. Revisá Internet y recargá.</p></div></div>'});
