import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {renderSite,pages,routes,esc} from '../assets/site-render.mjs';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const d=JSON.parse(fs.readFileSync(path.join(dir,'content/site.json'))),credits=JSON.parse(fs.readFileSync(path.join(dir,'assets/photo-credits.json'))).photos;
const origin='https://hassnboudlaie.github.io/afra-tejarat-mad/';
const urls=[];
for(const lang of ['fa','en'])for(const page of pages){
 const relative=(lang==='en'?'en/':'')+routes[page]; const output=relative.endsWith('.html')?relative:relative+'index.html';
 const depth=output.split('/').length-1,root=depth?'../'.repeat(depth):'./';
 const result=renderSite(d,lang,page,root,credits,'');
 const schema={"@context":"https://schema.org","@type":"Organization",name:'Afra Tejarat Mad',url:origin,email:d.company.email,telephone:d.company.phone,address:{'@type':'PostalAddress',streetAddress:d.company.address.en,addressLocality:'Tehran',addressCountry:'IR'}};
 const doc=`<!doctype html>\n<html lang="${lang}" dir="${lang==='fa'?'rtl':'ltr'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#092c3e"><title>${esc(result.title)}</title><meta name="description" content="${esc(result.description)}"><link rel="canonical" href="${origin+relative}"><link rel="alternate" hreflang="fa" href="${origin+routes[page]}"><link rel="alternate" hreflang="en" href="${origin+'en/'+routes[page]}"><link rel="alternate" hreflang="x-default" href="${origin+routes[page]}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(result.title)}"><meta property="og:description" content="${esc(result.description)}"><meta property="og:image" content="${origin+d.hero.image}"><link rel="icon" href="${root}assets/brand/favicon.svg" type="image/svg+xml"><link rel="preload" href="${root}assets/fonts/${lang==='fa'?'Vazirmatn':'Manrope'}.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="${root}assets/site.css?v=20261020-4"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script></head><body data-page="${page}" data-root="${root}"><div id="site">${result.html}</div><script id="site-fallback" type="application/json">${JSON.stringify(d).replace(/</g,'\\u003c')}</script><script type="module" src="${root}assets/site.mjs?v=20261020-3"></script></body></html>\n`;
 const target=path.join(dir,output);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,doc);if(page!=='detail')urls.push(origin+relative);
}
fs.writeFileSync(path.join(dir,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>\n');
fs.writeFileSync(path.join(dir,'robots.txt'),'User-agent: *\nAllow: /\nDisallow: /afra-tejarat-mad/admin/\nSitemap: '+origin+'sitemap.xml\n');
fs.writeFileSync(path.join(dir,'.nojekyll'),'');
fs.writeFileSync(path.join(dir,'pilot-v2.html'),`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>افرا تجارت ماد</title></head><body><p><a href="./">وب‌سایت افرا تجارت ماد</a> · <a href="en/">English website</a></p><script>const p=new URLSearchParams(location.search);location.replace(p.get('lang')==='en'?'en/':'./');</script></body></html>`);
console.log('Generated '+pages.length*2+' bilingual pages and sitemap.');
