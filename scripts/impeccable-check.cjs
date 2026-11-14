"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),http=require("node:http");
const {chromium}=require("playwright");const AxeBuilder=require("@axe-core/playwright").default;
const root=path.resolve(__dirname,".."),out=path.join(root,"qa-artifacts");fs.mkdirSync(out,{recursive:true});
const repo=path.basename(root),html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const cssFile=repo==="afra-tejarat-mad"?"assets/site.css":"impeccable.css";
const css=fs.readFileSync(path.join(root,cssFile),"utf8");
assert.ok(css.includes("Impeccable")&&css.includes("focus-visible"),"Missing accessibility layer");
assert.ok(html.includes('lang="fa"')&&html.includes('dir="rtl"'),"RTL lost");
if(repo==="naavsanat-culture-app"){
 assert.ok(html.includes("impeccable.css?v=20261114"));
 assert.ok(fs.existsSync(path.join(root,"next/assets/fonts/fonts.css")));
}else if(repo==="afra-tejarat-mad"){
 assert.ok(fs.statSync(path.join(root,"assets/fonts/Vazirmatn.ttf")).size>100000);
 assert.ok(html.includes('href="./products/"'));
}else{
 assert.ok(html.includes("impeccable.css?v=20261114"));
 assert.ok(!html.includes("fonts.googleapis.com"));
 assert.ok(fs.statSync(path.join(root,"assets/fonts/Vazirmatn.woff2")).size>100000);
 assert.ok(fs.existsSync(path.join(root,"assets/fonts/OFL-Vazirmatn.txt")));
}
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".woff2":"font/woff2",".ttf":"font/ttf",".png":"image/png",".svg":"image/svg+xml",".webp":"image/webp"};
const server=http.createServer((req,res)=>{
 try{
  let name=decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname);if(name.endsWith("/"))name+="index.html";
  const file=path.resolve(root,"."+name);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end("Not found");return}
   res.writeHead(200,{"Content-Type":mime[path.extname(file)]||"application/octet-stream","Cache-Control":"no-store"});res.end(data)});
 }catch(e){res.writeHead(500);res.end(String(e))}
});
async function main(){
 await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
 try{
  const browser=await chromium.launch({headless:true});
  try{
   for(const width of [390,1366]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:900},isMobile:width===390,hasTouch:width===390});
    try{
     const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
     const response=await page.goto("http://127.0.0.1:"+server.address().port+"/",{waitUntil:"domcontentloaded",timeout:35000});
     assert.equal(response.status(),200);
     const metrics=await page.evaluate(async()=>{await document.fonts.load('400 18px "Vazirmatn"');return {font:getComputedStyle(document.body).fontFamily,loaded:document.fonts.check('400 18px "Vazirmatn"'),overflow:document.documentElement.scrollWidth-innerWidth}});
     assert.ok(metrics.loaded,"Vazirmatn failed "+width);assert.match(metrics.font,/Vazirmatn/);
     await page.screenshot({path:path.join(out,repo+"-"+width+".png"),fullPage:false});
     const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
     const high=axe.violations.filter(x=>["serious","critical"].includes(x.impact));
     console.log("PASS",repo,width,"local font; overflow="+metrics.overflow,"axe serious/critical="+high.length,"runtime warnings="+errors.length);
     if(metrics.overflow>20)throw Error("Severe horizontal overflow "+metrics.overflow+"px at "+width+"px");
    }finally{await context.close()}
   }
  }finally{await browser.close()}
 }finally{server.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
