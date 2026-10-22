const frame=document.getElementById('test-frame'),list=document.getElementById('results'),status=document.getElementById('status'),json=document.getElementById('json-result'),rerun=document.getElementById('rerun');
const root=new URL('../',location.href),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let result,errors=[],deadline=Infinity;
const localKey='afra-rfq-draft';
function report(name,pass,detail=''){
 const row={name,pass,detail};result.checks.push(row);
 const li=document.createElement('li');li.className=pass?'pass':'fail';li.textContent=(pass?'PASS · ':'FAIL · ')+name+(detail?' — '+detail:'');list.append(li);
 result.passed=result.checks.filter(x=>x.pass).length;result.failed=result.checks.length-result.passed;window.AFRA_QA_RESULT=result;
 status.textContent=`${result.status.toUpperCase()} · ${result.passed} passed · ${result.failed} failed`;
}
async function until(predicate,timeout=10000){const start=performance.now();while(performance.now()-start<timeout&&performance.now()<deadline){try{if(predicate())return true;}catch{}await sleep(35);}return false;}
async function load(route,width=390){
 frame.style.width=width+'px';frame.width=width;errors=[];
 const url=new URL(route,root);url.searchParams.set('qa','acceptance');
 if(performance.now()>=deadline)throw Error('Browser test time limit reached');
 const loaded=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Page load timed out: '+route)),Math.min(12000,deadline-performance.now()));frame.onload=()=>{clearTimeout(timer);resolve();};});
 frame.src=url.href;await loaded;
 const win=frame.contentWindow,doc=frame.contentDocument;
 win.addEventListener('error',e=>errors.push(e.message||'Resource error'));
 win.addEventListener('unhandledrejection',e=>errors.push(String(e.reason?.message||e.reason)));
 const ready=await until(()=>doc.body?.dataset.ready==='true',9000);
 if(!ready)throw Error('Client did not become ready: '+route);
 await Promise.race([doc.fonts.ready,sleep(3000)]);
 await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
 return {win,doc};
}
async function imagesReady(doc){
 const images=[...doc.images];images.forEach(im=>im.loading='eager');
 await until(()=>images.every(im=>im.complete),8000);
 return images.filter(im=>!im.complete||im.naturalWidth===0).map(im=>im.getAttribute('src'));
}
async function pageCheck(route,width,lang){
 const {doc,win}=await load(route,width),tag=`${lang.toUpperCase()} ${route||'home'} @${width}`;
 const broken=await imagesReady(doc);
 const actualWidth=win.innerWidth,scrollWidth=Math.max(doc.documentElement.scrollWidth,doc.body.scrollWidth);
 report(tag+' ready / language',doc.documentElement.lang===lang&&doc.documentElement.dir===(lang==='fa'?'rtl':'ltr'));
 report(tag+' layout',scrollWidth<=actualWidth+1,`viewport=${actualWidth}; content=${scrollWidth}`);
 report(tag+' images',broken.length===0,broken.join(', '));
 report(tag+' main heading',doc.querySelectorAll('main h1').length===1);
 const unlabelled=[...doc.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(el=>!el.labels?.length&&!el.getAttribute('aria-label'));
 report(tag+' control labels',unlabelled.length===0,unlabelled.map(el=>el.id||el.name).join(', '));
 if(lang==='en')report(tag+' English text',!/[\u0600-\u06ff]/.test(doc.body.innerText));
 report(tag+' JavaScript errors after load',errors.length===0,errors.join('; '));
}
function input(win,form,name,value){const field=form.elements.namedItem(name);field.value=value;field.dispatchEvent(new win.Event('input',{bubbles:true}));field.dispatchEvent(new win.Event('change',{bubbles:true}));}
async function testInteractions(){
 for(const lang of ['fa','en']){
  const base=lang==='en'?'en/':'';
  let {doc,win}=await load(base,390);
  const button=doc.querySelector('.menu-toggle');button.click();
  report(lang+' mobile menu opens',button.getAttribute('aria-expanded')==='true'&&doc.getElementById('main-nav').classList.contains('is-open'));
  doc.dispatchEvent(new win.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
  report(lang+' mobile menu closes with Escape',button.getAttribute('aria-expanded')==='false');
  ({doc,win}=await load(base+'products/',390));
  const search=doc.getElementById('category-search');search.value=lang==='en'?'filters':'فیلتر';search.dispatchEvent(new win.Event('input',{bubbles:true}));
  const total=doc.querySelectorAll('.product-card').length,shown=[...doc.querySelectorAll('.product-card')].filter(c=>!c.hidden).length;
  report(lang+' product search filters results',shown>0&&shown<total,`${shown}/${total} shown`);
  doc.getElementById('clear-search').click();report(lang+' search clear restores results',[...doc.querySelectorAll('.product-card')].every(c=>!c.hidden)&&search.value==='');
  search.value='NO_MATCH_QA_987654';search.dispatchEvent(new win.Event('input',{bubbles:true}));report(lang+' search empty state',!doc.getElementById('no-results').hidden);
  ({doc,win}=await load(base+'products/detail.html?id=piping',390));
  const switcher=doc.querySelector('[data-language-switch]');switcher.click();
  const other=lang==='fa'?'en':'fa';
  const switched=await until(()=>frame.contentDocument.documentElement.lang===other&&frame.contentDocument.body.dataset.ready==='true');
  report(lang+' → '+other+' detail language switch',switched&&new URL(frame.contentWindow.location.href).searchParams.get('id')==='piping');
  if(switched)report(lang+' → '+other+' detail content',frame.contentDocument.querySelector('main h1')?.textContent.includes(other==='en'?'Piping':'لوله'));
  localStorage.removeItem(localKey);
  ({doc,win}=await load(base+'request-quote/?category=piping',390));
  let form=doc.getElementById('rfq-form');
  report(lang+' RFQ category preselected',form.elements.namedItem('category').value==='piping');
  const item=lang==='en'?'Filter A&B / Ø24"':'فیلتر تست A&B / Ø24"';
  const values={name:'Afra QA',company:'Internal acceptance QA',email:'qa@example.com',category:'piping',item,part:'QA-PN?x=1&y=2',qty:'7 pcs',notes:'TEST ONLY — do not send. Destination review\nSpecial chars: + % & ='};
  for(const [k,v] of Object.entries(values))input(win,form,k,v);
  let saved;try{saved=JSON.parse(localStorage.getItem(localKey)||'{}');}catch{saved={};}
  report(lang+' RFQ draft saved',saved.item===item&&saved.qty==='7 pcs');
  ({doc,win}=await load(base+'request-quote/',390));form=doc.getElementById('rfq-form');
  report(lang+' RFQ draft survives reload',form.elements.namedItem('item').value===item&&form.elements.namedItem('qty').value==='7 pcs');
  form.requestSubmit();
  const review=doc.getElementById('rfq-review'),summary=doc.getElementById('rfq-summary').textContent;
  report(lang+' native valid RFQ opens review',!review.hidden&&form.hidden&&summary.includes(item)&&summary.includes('7 pcs'));
  const wa=new URL(doc.getElementById('send-whatsapp').href),mail=new URL(doc.getElementById('send-email').href);
  report(lang+' WhatsApp prepared correctly',wa.hostname==='wa.me'&&wa.pathname==='/989122153235'&&wa.searchParams.get('text')===summary);
  report(lang+' email prepared correctly',mail.protocol==='mailto:'&&mail.pathname==='info@afratejaratmad.com'&&mail.searchParams.get('body')===summary);
  report(lang+' RFQ remains unsent',!review.hidden&&frame.contentWindow.location.pathname.endsWith('/request-quote/'));
  doc.getElementById('edit-rfq').click();report(lang+' RFQ editing restores form',!form.hidden&&review.hidden&&form.elements.namedItem('item').value===item);
  const languageLink=doc.querySelector('[data-language-switch]');languageLink.click();
  const draftSwitched=await until(()=>frame.contentDocument.documentElement.lang===other&&frame.contentDocument.body.dataset.ready==='true');
  doc=frame.contentDocument;win=frame.contentWindow;form=doc.getElementById('rfq-form');
  report(lang+' RFQ draft survives language switch',draftSwitched&&form.elements.namedItem('item').value===item&&form.elements.namedItem('qty').value==='7 pcs');
  doc.getElementById('clear-draft').click();
  report(lang+' RFQ draft clears',!localStorage.getItem(localKey)&&form.elements.namedItem('item').value==='');
  // Browser-native validation must prevent an empty request opening review.
  form.requestSubmit();report(lang+' native required validation',!form.hidden&&doc.getElementById('rfq-review').hidden&&!form.checkValidity());
 }
 // The admin editor is tested last because its unsaved-change guard is intentional.
 const {doc}=await load('admin/?lang=en',390);
 report('EN admin editor ready',doc.documentElement.lang==='en'&&Boolean(doc.getElementById('editor-fields')));
 const before=doc.querySelectorAll('[data-path$=".id"]').length;doc.getElementById('add-category').click();
 const after=doc.querySelectorAll('[data-path$=".id"]').length;
 report('EN admin adds category locally',after===before+1);
 const field=doc.querySelector('[data-path="hero.title.en"]');field.value='Local QA title';field.dispatchEvent(new frame.contentWindow.Event('input',{bubbles:true}));
 report('EN admin edits bilingual content locally',doc.getElementById('editor-status').textContent.includes('Local changes'));
 // Re-import the public content to restore the editor and its unsaved-change guard.
 const publicContent=await (await fetch(new URL('content/site.json',root),{cache:'no-cache'})).text();
 const adminWindow=frame.contentWindow,transfer=new adminWindow.DataTransfer();
 transfer.items.add(new adminWindow.File([publicContent],'site.json',{type:'application/json'}));
 const importer=doc.getElementById('import-content');importer.files=transfer.files;importer.dispatchEvent(new adminWindow.Event('change',{bubbles:true}));
 const imported=await until(()=>doc.getElementById('editor-status').textContent.includes('Content loaded'));
 report('EN admin restores local content from import',imported&&doc.querySelectorAll('[data-path$=".id"]').length===before);
}
async function run(){
 rerun.disabled=true;list.replaceChildren();deadline=performance.now()+240000;result={status:'running',startedAt:new Date().toISOString(),pageRoot:root.href,checks:[],passed:0,failed:0,limits:['Tests run in this browser engine, with CSS viewport sizes; physical Android hardware and other browser engines remain untested.','Errors after iframe load are captured; startup failures are detected through the client-ready marker.','WhatsApp/email payloads are checked without opening or sending a message. Pages CMS authentication is not exercised.']};window.AFRA_QA_RESULT=result;
 let originalDraft=null,originalLanguage=null,storageRead=false;
 try{
  originalDraft=localStorage.getItem(localKey);originalLanguage=localStorage.getItem('afra-language');storageRead=true;
  localStorage.removeItem(localKey);
  const routeList=['','products/','products/detail.html?id=mining','capabilities/','how-we-work/','markets/','about/','request-quote/'];
  for(const width of [360,390,768,1440])for(const lang of ['fa','en'])for(const route of routeList){
   if(performance.now()>=deadline)throw Error('Browser test time limit reached before completing all cases');
   try{await pageCheck((lang==='en'?'en/':'')+route,width,lang);}catch(e){report(`${lang} ${route||'home'} @${width}`,false,e.message);}
  }
  await testInteractions();
 }catch(e){report('Test runner',false,e.stack||e.message);}
 finally{
  if(storageRead)try{
   if(originalDraft===null)localStorage.removeItem(localKey);else localStorage.setItem(localKey,originalDraft);
   if(originalLanguage===null)localStorage.removeItem('afra-language');else localStorage.setItem('afra-language',originalLanguage);
  }catch(e){report('Restore previous local draft',false,e.message);}
  result.status=result.failed?'failed':'passed';result.finishedAt=new Date().toISOString();result.durationSeconds=Math.round((Date.parse(result.finishedAt)-Date.parse(result.startedAt))/100)/10;window.AFRA_QA_RESULT=result;
  json.textContent=JSON.stringify(result,null,2);status.textContent=`${result.status.toUpperCase()} · ${result.passed} passed · ${result.failed} failed · ${result.durationSeconds}s`;rerun.disabled=false;
 }
}
rerun.addEventListener('click',run);run();
