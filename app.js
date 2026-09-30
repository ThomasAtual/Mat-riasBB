const $ = (selector) => document.querySelector(selector);
const nav = $('#subjectNav');
const list = $('#lessonList');
const search = $('#search');
const stateKey = 'minha-trilha-progresso-v1';
let catalog = [];
let activeSubject = '';
let saved = readSaved();
function readSaved(){ try{return JSON.parse(localStorage.getItem(stateKey)||'{}')}catch{return {}} }
function save(){ localStorage.setItem(stateKey,JSON.stringify(saved)); const s=$('#saveStatus'); s.textContent='Salvo neste aparelho'; }
function slugKey(subject,id){return `${subject}::${id}`}
function renderNav(){
  nav.innerHTML='';
  catalog.forEach(subject=>{
    const btn=document.createElement('button'); btn.className='subject-link'+(activeSubject===subject.materia?' active':''); btn.type='button';
    const done=subject.aulas.filter(a=>saved[slugKey(subject.materia,a.id)]?.done).length;
    btn.innerHTML=`<span>${escapeHtml(subject.materia)}</span><span class="nav-count">${done}/${subject.aulas.length}</span>`;
    btn.addEventListener('click',()=>selectSubject(subject.materia)); nav.appendChild(btn);
  });
  $('#subjectCount').textContent=catalog.length;
}
function selectSubject(name){activeSubject=name; $('#welcomeCard').hidden=true; $('#subjectHeader').hidden=false; $('#listHeading').hidden=false; renderNav(); renderLessons();}
function renderLessons(){
  const subject=catalog.find(s=>s.materia===activeSubject); if(!subject)return;
  $('#subjectTitle').textContent=subject.materia;
  const total=subject.aulas.length, done=subject.aulas.filter(a=>saved[slugKey(subject.materia,a.id)]?.done).length;
  const pct=total?Math.round(done/total*100):0;
  $('#progressText').textContent=`${pct}%`; $('#progressBar').style.width=`${pct}%`; $('#progressCount').textContent=`${done} de ${total} aulas concluídas`;
  $('#subjectSubtitle').textContent=`${total} ${total===1?'aula':'aulas'} na sua trilha`;
  const query=search.value.trim().toLocaleLowerCase('pt-BR');
  const lessons=subject.aulas.filter(a=>a.titulo.toLocaleLowerCase('pt-BR').includes(query));
  $('#lessonCount').textContent=`${lessons.length} ${lessons.length===1?'assunto':'assuntos'}`;
  list.innerHTML=''; $('#emptyState').hidden=lessons.length>0;
  lessons.forEach((lesson,index)=>{
    const key=slugKey(subject.materia,lesson.id), data=saved[key]||{};
    const row=document.createElement('article'); row.className='lesson'+(data.done?' done':'');
    const check=document.createElement('label'); check.className='check-wrap'; check.innerHTML=`<input type="checkbox" aria-label="Marcar ${escapeHtml(lesson.titulo)} como concluída" ${data.done?'checked':''}><span class="checkmark">✓</span>`;
    check.querySelector('input').addEventListener('change',e=>{saved[key]={...saved[key],done:e.target.checked};save();renderLessons();renderNav()});
    const main=document.createElement('div'); main.className='lesson-main';
    const title=document.createElement('p'); title.className='lesson-title'; title.textContent=lesson.titulo;
    const note=document.createElement('textarea'); note.className='lesson-note';note.rows=1;note.placeholder='Adicionar uma nota ou comentário…';note.value=data.note||'';note.setAttribute('aria-label',`Comentário para ${lesson.titulo}`);
    note.addEventListener('input',()=>{saved[key]={...saved[key],note:note.value};save()});
    main.append(title,note); const tag=document.createElement('span');tag.className='lesson-tag';tag.textContent=data.done?'Concluída':`Aula ${String(index+1).padStart(2,'0')}`;
    row.append(check,main,tag);list.appendChild(row);
  });
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
search.addEventListener('input',()=>{if(activeSubject)renderLessons();else if(search.value){const first=catalog.find(s=>s.aulas.some(a=>a.titulo.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))));if(first)selectSubject(first.materia)}});
$('#installHelp').addEventListener('click',()=>$('#helpDialog').showModal());
fetch('materias.json').then(r=>{if(!r.ok)throw new Error('Não foi possível carregar o catálogo');return r.json()}).then(data=>{catalog=data.sort((a,b)=>a.materia.localeCompare(b.materia,'pt-BR'));renderNav()}).catch(()=>{$('#welcomeCard').innerHTML='<div class="welcome-copy"><p class="eyebrow">CATÁLOGO INDISPONÍVEL</p><h2>Não foi possível abrir as matérias.</h2><p>Confira se o arquivo materias.json está publicado junto com esta página.</p></div>'});
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
