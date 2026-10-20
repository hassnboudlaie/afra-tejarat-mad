const frame=document.getElementById('audit-frame'),list=document.getElementById('results'),status=document.getElementById('status'),json=document.getElementById('json-result'),rerun=document.getElementById('rerun');
const root=new URL('../',location.href),sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const tags=['wcag2a','wcag2aa','wcag21a','wcag21aa'];
let result,deadline=Infinity;
function update(){
 result.violationCount=result.pages.reduce((n,p)=>n+p.violations.length,0);
 result.incompleteCount=result.pages.reduce((n,p)=>n+p.incomplete.length,0);
 result.completedCases=result.pages.length;
 window.AFRA_ACCESSIBILITY_RESULT=result;
 status.textContent=`${result.status.toUpperCase()} · ${result.completedCases}/${result.plannedCases} page/viewport cases · ${result.violationCount} violations · ${result.incompleteCount} manual-review findings`;
 json.textContent=JSON.stringify(result,null,2);
}
function row(text,type='pass'){const li=document.createElement('li');li.className=type;li.textContent=text;list.append(li);}
async function until(fn,timeout=10000){const start=performance.now();while(performance.now()-start<timeout&&performance.now()<deadline){try{if(fn())return true;}catch{}await sleep(40);}return false;}
async function bounded(promise,ms,message){
 let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),Math.max(1,Math.min(ms,deadline-performance.now())));})]);}finally{clearTimeout(timer);}
}
async function load(route){
 if(performance.now()>=deadline)throw Error('Accessibility test time limit reached');
 const url=new URL(route,root);url.searchParams.set('a11y-qa',String(Date.now()));
 const loaded=new Promise(resolve=>frame.onload=resolve);frame.src=url.href;
 await bounded(loaded,12000,'Page load timed out: '+route);
 const doc=frame.contentDocument,win=frame.contentWindow;
 if(!await until(()=>doc.body?.dataset.ready==='true'))throw Error('Client-ready marker missing: '+route);
 if(doc.fonts?.ready)await bounded(doc.fonts.ready,8000,'Local fonts not ready: '+route);
 const imgs=[...doc.images];imgs.forEach(im=>im.loading='eager');await until(()=>imgs.every(im=>im.complete),6000);
 const script=doc.createElement('script');script.src=new URL('qa/vendor/axe.min.js',root).href;
 const injected=new Promise((resolve,reject)=>{script.onload=resolve;script.onerror=()=>reject(Error('Could not load local axe-core dependency'));});
 doc.head.append(script);await bounded(injected,8000,'axe-core load timed out');
 if(win.axe?.version!=='4.10.3')throw Error('Unexpected axe-core version: '+win.axe?.version);
 return {doc,win};
}
function findings(items){return items.map(v=>({id:v.id,impact:v.impact,description:v.description,help:v.help,helpUrl:v.helpUrl,tags:v.tags,nodes:v.nodes.map(n=>({target:n.target,impact:n.impact,failureSummary:n.failureSummary||null}))}));}
async function run(){
 rerun.disabled=true;list.replaceChildren();deadline=performance.now()+240000;
 result={status:'running',startedAt:new Date().toISOString(),root:root.href,engine:'axe-core',version:'4.10.3',wcagTags:tags,plannedCases:32,completedCases:0,violationCount:0,incompleteCount:0,pages:[],errors:[],limits:['Automated WCAG rules do not establish complete accessibility conformance. Incomplete findings need manual review.','Runs in the current browser engine at CSS viewport widths; physical Android devices and other browser engines are not covered.','No RFQ data, element HTML or form values are captured. Existing local draft and language preferences are restored.']};update();
 let draft=null,language=null,storageRead=false;
 try{
  draft=localStorage.getItem('afra-rfq-draft');language=localStorage.getItem('afra-language');storageRead=true;localStorage.removeItem('afra-rfq-draft');
  const routes=['','products/','products/detail.html?id=piping','capabilities/','how-we-work/','markets/','about/','request-quote/'];
  for(const lang of ['fa','en'])for(const route of routes){
   frame.style.width='390px';frame.width=390;
   const actual=(lang==='en'?'en/':'')+route,{doc,win}=await load(actual);
   for(const width of [390,1440]){
    if(performance.now()>=deadline)throw Error('Accessibility test time limit reached before all cases completed');
    frame.style.width=width+'px';frame.width=width;
    await new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
    if(doc.fonts?.ready)await bounded(doc.fonts.ready,5000,'Font readiness timed out');
    const started=performance.now();
    const audit=await bounded(win.axe.run(doc,{runOnly:{type:'tag',values:tags},resultTypes:['violations','incomplete','passes','inapplicable'],iframes:false}),12000,'axe-core audit timed out: '+actual);
    const entry={route:actual||'./',language:lang,width,actualViewport:win.innerWidth,durationMs:Math.round(performance.now()-started),passedRuleCount:audit.passes.length,inapplicableRuleCount:audit.inapplicable.length,violations:findings(audit.violations),incomplete:findings(audit.incomplete)};
    result.pages.push(entry);
    row(`${lang.toUpperCase()} ${actual||'home'} @${width}: ${entry.violations.length} violations; ${entry.incomplete.length} manual-review findings; ${entry.passedRuleCount} rules passed`,entry.violations.length?'fail':entry.incomplete.length?'review':'pass');
    for(const violation of entry.violations)row(`${violation.impact||'issue'} · ${violation.id} · ${violation.help} · ${violation.nodes.map(n=>n.target.join(' > ')).join('; ')}`,'fail');
    update();
   }
  }
 }catch(e){result.errors.push(e.message);row('Audit runner: '+e.message,'fail');}
 finally{
  if(storageRead)try{if(draft===null)localStorage.removeItem('afra-rfq-draft');else localStorage.setItem('afra-rfq-draft',draft);if(language===null)localStorage.removeItem('afra-language');else localStorage.setItem('afra-language',language);}catch(e){result.errors.push('Could not restore local state: '+e.message);}
  result.finishedAt=new Date().toISOString();result.durationSeconds=Math.round((Date.parse(result.finishedAt)-Date.parse(result.startedAt))/100)/10;
  result.status=result.errors.length||result.completedCases!==result.plannedCases?'incomplete':result.violationCount?'violations-found':result.incompleteCount?'manual-review-needed':'passed';
  update();rerun.disabled=false;
 }
}
rerun.addEventListener('click',run);run();
