import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../content/site.json',import.meta.url)));
const names={company:'Company identity / هویت شرکت',hero:'Homepage hero / تصویر و تیتر خانه',intro:'Introduction / معرفی',about:'About Afra / درباره افرا',categories:'Products & industries / محصولات و صنایع',services:'Capabilities / توانمندی‌ها',process:'Working process / مراحل همکاری',markets:'Markets / بازارها',fa:'فارسی',en:'English',image:'Image / تصویر',imageAlt:'Image description / شرح تصویر',title:'Title / عنوان',description:'Description / توضیحات',items:'Sourcing examples / نمونه اقلام',requirements:'RFQ guidance / راهنمای استعلام',id:'Unique ID (keep stable) / شناسه ثابت',email:'Email / ایمیل',phone:'Office phone / تلفن دفتر',mobile:'Management phone / تلفن مدیریت',whatsapp:'WhatsApp international digits / شماره واتساپ',address:'Address / نشانی',ceo:'CEO / مدیرعامل',representative:'Representative / نماینده',role:'Role in this market / نقش بازار',name:'Name / نام',eyebrow:'Section label / برچسب تیتر',approach:'Working approach / رویکرد همکاری',flag:'Country flag / پرچم کشور',icon:'Icon / آیکون'};
function field(name,value){
 const f={name,label:names[name]||name};
 if(name==='image')return {...f,type:'image'};
 if(Array.isArray(value)){const sample=value[0];return typeof sample==='object'?{...f,type:'object',list:true,fields:Object.entries(sample).map(([k,v])=>field(k,v))}:{...f,type:'string',list:true};}
 if(value&&typeof value==='object')return {...f,type:'object',fields:Object.entries(value).map(([k,v])=>field(k,v))};
 return {...f,type:String(value).length>90||String(value).includes('\n')?'text':'string'};
}
const config={media:{input:'assets/photos',output:'/assets/photos',extensions:['jpg','jpeg','png','webp'],rename:'safe'},content:[{name:'site',label:'Afra website / وب‌سایت افرا',type:'file',path:'content/site.json',format:'json',fields:Object.entries(data).filter(([k])=>k!=='version').map(([k,v])=>field(k,v))}]};
fs.writeFileSync(new URL('../.pages.yml',import.meta.url),JSON.stringify(config,null,2)+'\n');
console.log('Pages CMS configuration generated.');
