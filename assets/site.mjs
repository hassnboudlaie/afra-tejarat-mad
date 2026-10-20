import {renderSite,getLabels,routes} from './site-render.mjs';
const body=document.body,lang=document.documentElement.lang==='en'?'en':'fa',page=body.dataset.page,root=body.dataset.root||'./';
const l=getLabels(lang),query=new URLSearchParams(location.search),categoryId=query.get('id')||'';
const storage={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}},remove:k=>{try{localStorage.removeItem(k)}catch{}}};
const requestedLang=query.get('lang');
if(requestedLang&&['fa','en'].includes(requestedLang)&&requestedLang!==lang){query.delete('lang');const q=query.toString();location.replace(root+(requestedLang==='en'?'en/':'')+routes[page]+(q?'?'+q:''));}
storage.set('afra-language',lang);
let site;
// A category URL can render immediately from the embedded snapshot while fresh content loads.
if(page==='detail'&&categoryId){
 const snapshot=JSON.parse(document.getElementById('site-fallback').textContent);
 const initial=renderSite(snapshot,lang,page,root,[],categoryId);
 document.getElementById('site').innerHTML=initial.html;
 document.title=initial.title;
}
try{
 const [response,creditResponse]=await Promise.all([fetch(root+'content/site.json',{cache:'no-cache'}),fetch(root+'assets/photo-credits.json',{cache:'no-cache'})]);
 if(!response.ok||!creditResponse.ok)throw Error('Content unavailable');
 site=await response.json(); const credits=await creditResponse.json();
 const result=renderSite(site,lang,page,root,credits.photos,categoryId);
 document.getElementById('site').innerHTML=result.html;
 document.title=result.title; document.querySelector('meta[name=description]').content=result.description;
}catch(e){console.warn('Using the pre-rendered website.',e.message);site=JSON.parse(document.getElementById('site-fallback').textContent);}
const menuButton=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav');
function setMenu(open){nav.classList.toggle('is-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?l.close:l.menu);}
menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton?.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();}});
document.addEventListener('click',e=>{if(menuButton?.getAttribute('aria-expanded')==='true'&&!nav.contains(e.target)&&!menuButton.contains(e.target))setMenu(false);});
document.querySelector('[data-language-switch]')?.addEventListener('click',e=>{storage.set('afra-language',lang==='fa'?'en':'fa');const q=new URLSearchParams(location.search);q.delete('lang');if(q.size)e.currentTarget.search=q.toString();});
if(page==='products'){
 const search=document.getElementById('category-search'),clear=document.getElementById('clear-search'),cards=[...document.querySelectorAll('.product-card')],empty=document.getElementById('no-results'),status=document.getElementById('search-status');
 const normalize=s=>s.normalize('NFKC').replace(/[يى]/g,'ی').replace(/ك/g,'ک').toLocaleLowerCase().trim();
 const filter=()=>{const term=normalize(search.value);let count=0;for(const c of cards){c.hidden=!normalize(c.dataset.search).includes(term);if(!c.hidden)count++;}clear.hidden=!term;empty.hidden=count!==0;status.textContent=lang==='en'?`${count} categories shown`:`${count} حوزه نمایش داده می‌شود`;};
 search.addEventListener('input',filter);clear.addEventListener('click',()=>{search.value='';filter();search.focus();});
}
if(page==='quote'){
 const form=document.getElementById('rfq-form'),review=document.getElementById('rfq-review'),summary=document.getElementById('rfq-summary'),status=document.getElementById('form-status');
 let text='';
 const keys=['name','company','email','category','item','part','qty','notes'];
 function getDraft(){try{return JSON.parse(storage.get('afra-rfq-draft')||'{}')}catch{return {}}}
 function persist(){const data=Object.fromEntries(keys.map(k=>[k,form.elements.namedItem(k).value]));storage.set('afra-rfq-draft',JSON.stringify(data));}
 const draft=getDraft();for(const k of keys)if(typeof draft[k]==='string')form.elements.namedItem(k).value=draft[k];
 const cat=query.get('category');if(site.categories.some(x=>x.id===cat))form.elements.namedItem('category').value=cat;
 form.addEventListener('input',persist);form.addEventListener('change',persist);
 form.addEventListener('submit',e=>{
  e.preventDefault();for(const k of ['name','company','item','qty']){const field=form.elements.namedItem(k);field.value=field.value.trim();field.setCustomValidity(field.value?'':l.valid);}
  if(!form.reportValidity())return;
  persist();const f=Object.fromEntries(new FormData(form));const c=site.categories.find(x=>x.id===f.category);
  text=[l.quoteSubject,'',`${l.name}: ${f.name}`,`${l.company}: ${f.company}`,`${l.contactEmail}: ${f.email}`,`${l.category}: ${c?.title[lang]||f.category}`,`${l.item}: ${f.item}`,`${l.part}: ${f.part||'—'}`,`${l.qty}: ${f.qty}`,`${l.notes}: ${f.notes||'—'}`].join('\n');
  summary.textContent=text;
  const wa=document.getElementById('send-whatsapp');wa.href=`https://wa.me/${site.company.whatsapp}?text=${encodeURIComponent(text)}`;
  document.getElementById('send-email').href=`mailto:${site.company.email}?subject=${encodeURIComponent(l.quoteSubject+' — '+f.item)}&body=${encodeURIComponent(text)}`;
  form.hidden=true;review.hidden=false;review.focus();review.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 });
 for(const k of ['name','company','item','qty'])form.elements.namedItem(k).addEventListener('input',()=>form.elements.namedItem(k).setCustomValidity(''));
 document.getElementById('edit-rfq').addEventListener('click',()=>{review.hidden=true;form.hidden=false;form.elements.namedItem('name').focus();});
 document.getElementById('clear-draft').addEventListener('click',()=>{form.reset();storage.remove('afra-rfq-draft');status.textContent=l.draftCleared;});
 document.getElementById('copy-rfq').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);document.getElementById('copy-status').textContent=l.copied;}catch{document.getElementById('copy-status').textContent=l.copyFailed;}});
 document.getElementById('download-rfq').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Afra-RFQ-'+new Date().toISOString().slice(0,10)+'.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);});
}

document.body.dataset.ready="true";
