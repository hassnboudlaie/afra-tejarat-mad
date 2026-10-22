import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {renderSite,pages,routes,getLabels,safeAsset} from '../assets/site-render.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'content/site.json'),'utf8'));
const credits=JSON.parse(fs.readFileSync(path.join(root,'assets/photo-credits.json'),'utf8')).photos;
const origin='https://afra.test/afra-tejarat-mad/';
const failures=[];
const counts={renderedPages:0,internalLinks:0,images:0,localeObjects:0,formFields:0,rfqLogicScenarios:0,cmsFields:0};
const ok=(condition,message)=>{if(!condition)failures.push(message);};
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],decode(m[2])]));
const visible=html=>decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]*>/g,' '));

function walkLocales(value,p='content'){
 if(!value||typeof value!=='object')return;
 if('fa' in value||'en' in value){
  counts.localeObjects++;
  ok('fa' in value&&'en' in value,p+': missing locale');
  ok(typeof value.fa===typeof value.en,p+': mismatched locale types');
  if(typeof value.en==='string')ok(!/[\u0600-\u06ff]/.test(value.en),p+': Persian characters in English content');
  if(Array.isArray(value.fa))ok(Array.isArray(value.en)&&value.fa.length===value.en.length,p+': locale list mismatch');
 }
 for(const [k,v] of Object.entries(value))walkLocales(v,p+'.'+k);
}
walkLocales(data);
assert.deepEqual(Object.keys(getLabels('fa')).sort(),Object.keys(getLabels('en')).sort(),'UI translation keys differ');
for(const collection of ['categories','markets']){
 const ids=data[collection].map(x=>x.id);
 ok(new Set(ids).size===ids.length,collection+': duplicate ids');
 ids.forEach(id=>ok(/^[a-z0-9-]+$/.test(id),collection+': unsafe id '+id));
}
const creditFiles=new Set(credits.map(c=>c.file));
for(const c of credits){
 ok(/^https:\/\//.test(c.source_url)&&/^https:\/\//.test(c.license_url),c.file+': missing licence/source');
 ok(fs.existsSync(path.join(root,c.file)),c.file+': credited image missing');
}
for(const image of [data.hero.image,...data.categories.map(c=>c.image)]){
 ok(safeAsset(image)===image,image+': invalid local image path');
 ok(creditFiles.has(image),image+': no recorded image licence');
}

function fileFor(url){
 let relative=decodeURIComponent(url.pathname).replace(/^\/afra-tejarat-mad\//,'');
 if(!relative||relative.endsWith('/'))relative+='index.html';
 return path.join(root,relative);
}
function renderUrl(url){
 const relative=url.pathname.replace(/^\/afra-tejarat-mad\//,'');
 const lang=relative.startsWith('en/')?'en':'fa';
 const pagePath=lang==='en'?relative.slice(3):relative;
 const page=Object.entries(routes).find(([_,v])=>v===pagePath)?.[0];
 if(!page)return fs.readFileSync(fileFor(url),'utf8');
 const output=relative.endsWith('.html')?relative:relative+'index.html';
 const depth=output.split('/').length-1;
 return renderSite(data,lang,page,depth?'../'.repeat(depth):'./',credits,url.searchParams.get('id')||'').html;
}
function checkPage(lang,page,category=''){
 const route=(lang==='en'?'en/':'')+routes[page];
 const current=new URL(route+(category?'?id='+category:''),origin);
 const html=renderUrl(current);
 counts.renderedPages++;
 ok((html.match(/<h1\b/g)||[]).length===1,current.href+': expected one h1');
 ok((html.match(/<main\b/g)||[]).length===1,current.href+': expected one main');
 if(lang==='en')ok(!/[\u0600-\u06ff]/.test(visible(html)),current.href+': Persian text in visible English page');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 ok(new Set(ids).size===ids.length,current.href+': duplicate element ids');
 const idSet=new Set(ids);
 for(const tag of html.match(/<img\b[^>]*>/g)||[]){
  const a=attributes(tag);counts.images++;
  ok('alt'in a,current.href+': image missing alt');
  ok(Boolean(a.alt?.trim()),current.href+': image has empty alt');
  const u=new URL(a.src,current);
  ok(u.origin===new URL(origin).origin,current.href+': hotlinked image '+a.src);
  ok(fs.existsSync(fileFor(u)),current.href+': image missing '+a.src);
  if(lang==='en')ok(!/[\u0600-\u06ff]/.test(a.alt),current.href+': Persian alt in English image');
 }
 for(const tag of html.match(/<a\b[^>]*>/g)||[]){
  const a=attributes(tag);
  if(!a.href){ok(['send-whatsapp','send-email'].includes(a.id),current.href+': anchor without href');continue;}
  ok(a.href!=='#'&&!/^javascript:/i.test(a.href),current.href+': placeholder link '+a.href);
  if(/^(mailto:|tel:|https?:)/.test(a.href))continue;
  const u=new URL(a.href,current);counts.internalLinks++;
  ok(fs.existsSync(fileFor(u)),current.href+': dead link '+a.href);
  if(u.hash&&fs.existsSync(fileFor(u))){
   const target=renderUrl(u);
   ok(target.includes('id="'+decodeURIComponent(u.hash.slice(1))+'"'),current.href+': missing fragment '+a.href);
  }
  if(u.pathname.endsWith('/products/detail.html')&&u.searchParams.has('id'))ok(data.categories.some(c=>c.id===u.searchParams.get('id')),current.href+': unknown category '+a.href);
 }
 for(const tag of html.match(/<(input|select|textarea)\b[^>]*>/g)||[]){
  const a=attributes(tag);counts.formFields++;
  ok(a.id&&idSet.has(a.id),current.href+': unnamed form control');
  ok(html.includes('for="'+a.id+'"'),current.href+': missing label for '+a.id);
 }
 const switchTag=(html.match(/<a\b[^>]*data-language-switch[^>]*>/)||[])[0];
 ok(Boolean(switchTag),current.href+': language switch missing');
 if(switchTag){
  const dest=new URL(attributes(switchTag).href,current);
  ok(dest.pathname.includes('/en/')===(lang==='fa'),current.href+': language switch has wrong destination');
  if(category)ok(dest.searchParams.get('id')===category,current.href+': category lost on language switch');
 }
 if(page!=='detail'){
  const generated=fs.readFileSync(fileFor(current),'utf8');
  ok(generated.includes(`<html lang="${lang}" dir="${lang==='fa'?'rtl':'ltr'}">`),current.href+': incorrect static lang/dir');
  ok(generated.includes(html),current.href+': generated HTML is stale; rerun node scripts/build.mjs');
 }
}
for(const lang of ['fa','en']){
 for(const page of pages)checkPage(lang,page);
 for(const c of data.categories)checkPage(lang,'detail',c.id);
}

// Run the production RFQ handlers against a deliberately small DOM contract.
// This verifies message preparation/encoding and state transitions, not browser layout
// or native form-validation behaviour (those remain public-browser checks).
const clientSource=fs.readFileSync(path.join(root,'assets/site.mjs'),'utf8').replace(/^import[^\n]+\n/,'');
async function checkRfq(lang,stored='{}',storageBlocked=false){
 const l=getLabels(lang),events=new Map(),elements=new Map(),saved=new Map([['afra-rfq-draft',stored]]);
 const node=id=>{
  if(elements.has(id))return elements.get(id);
  const e={id,hidden:false,textContent:'',innerHTML:'',href:'',dataset:{},listeners:new Map(),attributes:new Map(),
   addEventListener(type,handler){this.listeners.set(type,handler);},
   setAttribute(key,value){this.attributes.set(key,value);},getAttribute(key){return this.attributes.get(key);},
   contains(){return false;},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}};
  elements.set(id,e);return e;
 };
 const form=node('rfq-form'),review=node('rfq-review');review.hidden=true;
 const keys=['name','company','email','category','item','part','qty','notes'];
 const fields=Object.fromEntries(keys.map(k=>[k,{value:'',error:'',listeners:new Map(),setCustomValidity(message){this.error=message;},addEventListener(type,fn){this.listeners.set(type,fn);},focus(){this.focused=true;}}]));
 form.elements={item(){throw Error('Named item collided with collection.item()');},namedItem:k=>fields[k]};
 form.reportValidity=()=>keys.every(k=>!fields[k].error)&&['name','company','email','category','item','qty'].every(k=>fields[k].value);
 form.reset=()=>{for(const f of Object.values(fields))f.value='';};
 const meta={content:''};
 const document={body:{dataset:{page:'quote',root:'../'}},documentElement:{lang},getElementById:node,
  querySelector:s=>s==='meta[name=description]'?meta:null,querySelectorAll:()=>[],addEventListener:()=>{},createElement:()=>({click(){}})};
 const localStorage={getItem(k){if(storageBlocked)throw Error('Storage blocked');return saved.get(k)||null;},setItem(k,v){if(storageBlocked)throw Error('Storage blocked');saved.set(k,v);},removeItem(k){if(storageBlocked)throw Error('Storage blocked');saved.delete(k);}};
 const context={renderSite,getLabels,routes,document,localStorage,location:{search:'?category=mining',replace:()=>{}},
  fetch:async p=>({ok:true,json:async()=>p.includes('photo-credits')?{photos:credits}:structuredClone(data)}),
  FormData:class{constructor(){this.entries=keys.map(k=>[k,fields[k].value]);}[Symbol.iterator](){return this.entries[Symbol.iterator]();}},
  URL,URLSearchParams,Blob,console,matchMedia:()=>({matches:true}),setTimeout:()=>{},navigator:{clipboard:{writeText:async text=>{events.set('copied',text);}}}};
 await vm.runInNewContext('(async()=>{'+clientSource+'\n})()',context);
 ok(fields.category.value==='mining',lang+': category query not restored into RFQ');
 const values={name:'  QA Reviewer  ',company:'Afra QA & Test',email:'qa@example.com',category:'piping',item:'  Pipe Ø24" A&B  ',part:'P/N 123?x=1&y=2',qty:' 7 m ',notes:lang==='fa'?'بررسی مسیر\nخط دوم: + % & =':'Handover notes\nLine 2: + % & ='};
 Object.entries(values).forEach(([k,v])=>fields[k].value=v);
 form.listeners.get('input')();
 if(!storageBlocked)ok(JSON.parse(saved.get('afra-rfq-draft')).item===values.item,lang+': RFQ item missing from saved draft');
 await form.listeners.get('submit')({preventDefault(){events.set('prevented',true);}});
 const message=node('rfq-summary').textContent;
 ok(Boolean(message)&&message.includes('Pipe Ø24" A&B')&&message.includes(values.notes),lang+': RFQ summary lost source values');
 ok(!message.includes('undefined'),lang+': RFQ message includes undefined');
 ok(form.hidden&&!review.hidden&&review.focused,lang+': RFQ review did not open/focus');
 const wa=new URL(node('send-whatsapp').href),mail=new URL(node('send-email').href);
 ok(wa.hostname==='wa.me'&&wa.pathname==='/'+data.company.whatsapp,lang+': incorrect WhatsApp destination');
 ok(wa.searchParams.get('text')===message,lang+': WhatsApp message encoding mismatch');
 ok(mail.protocol==='mailto:'&&mail.pathname===data.company.email,lang+': incorrect email destination');
 ok(mail.searchParams.get('body')===message,lang+': email body encoding mismatch');
 ok(mail.searchParams.get('subject').includes('Pipe Ø24" A&B'),lang+': email subject encoding mismatch');
 await node('copy-rfq').listeners.get('click')();
 ok(events.get('copied')===message,lang+': copy handler did not copy exact RFQ');
 node('edit-rfq').listeners.get('click')();
 ok(!form.hidden&&review.hidden&&fields.name.focused,lang+': RFQ edit did not return to form');
 node('clear-draft').listeners.get('click')();
 ok(!saved.has('afra-rfq-draft')||storageBlocked,lang+': clear draft retained stored personal data');
 ok(node('form-status').textContent===l.draftCleared,lang+': draft status untranslated');
 fields.item.value='   ';fields.company.value='QA';fields.name.value='QA';fields.email.value='qa@example.com';fields.qty.value='7';fields.category.value='piping';
 await form.listeners.get('submit')({preventDefault(){}});
 ok(fields.item.error===l.valid,lang+': whitespace-only item did not trigger validation');
 ok(!form.hidden&&review.hidden,lang+': invalid whitespace request opened review');
 counts.rfqLogicScenarios++;
}
await checkRfq('fa');
await checkRfq('en','{broken-json');
await checkRfq('en','{}',true);

if(fs.existsSync(path.join(root,'.pages.yml'))){
 const cms=JSON.parse(fs.readFileSync(path.join(root,'.pages.yml'),'utf8'));
 ok(cms.media.input==='assets/photos', 'CMS image upload directory mismatch');
 const settings=cms.content.find(c=>c.path==='content/site.json');
 ok(settings?.type==='file'&&settings.format==='json','CMS must edit the live JSON content file');
 function checkCmsFields(fields,value,p='CMS'){
  for(const field of fields){
   counts.cmsFields++;
   ok(field.name in value,p+': unknown field '+field.name);
   const v=value[field.name];
   if(field.list){ok(Array.isArray(v),p+'.'+field.name+': list shape mismatch');if(field.fields&&v?.length)checkCmsFields(field.fields,v[0],p+'.'+field.name+'[]');}
   else if(field.fields)checkCmsFields(field.fields,v,p+'.'+field.name);
  }
 }
 if(settings)checkCmsFields(settings.fields,data);
}else failures.push('Pages CMS configuration missing');

const report={checkedAt:new Date().toISOString(),counts,failures,limits:['Structural and mocked client-logic checks only: browser rendering, native form validation, viewport overflow, keyboard behaviour, CMS authentication and external handoff need public browser QA.']};
fs.mkdirSync(path.join(root,'qa'),{recursive:true});
fs.writeFileSync(path.join(root,'qa/static-checks.json'),JSON.stringify(report,null,2)+'\n');
if(failures.length){console.error(JSON.stringify(report,null,2));process.exitCode=1;}else console.log(JSON.stringify(report,null,2));
