// AFRA — Strategic Business Model Questionnaire
'use strict';
const Q=(id,label,type,opts=[],help='')=>({id,label,type,opts,help});
const S=[
['وضعیت فعلی و تجربه واقعی','تفکیک فرصت، استعلام، سفارش و درآمد تحقق‌یافته.',[
Q('respondent','نام و سمت پاسخ‌دهنده','text'),
Q('stage','وضعیت امروز شرکت چیست؟','single',['معاملات واقعی و تکرارشونده','معاملات موردی','استعلام و مذاکره فعال، بدون فروش منظم','توسعه شبکه و فرصت‌ها']),
Q('income','از کدام فعالیت‌ها تاکنون درآمد واقعی کسب شده است؟','multi',['خریدوفروش داخلی','واردات','صادرات','کارمزد معرفی طرفین','خدمات تأمین و پیگیری','نمایندگی','هنوز درآمد پایدار نداریم','سایر']),
Q('cases','سه پروژه یا استعلام شاخص را نام ببرید و وضعیت هر یک را بگویید.','long',[],'نمونه‌های قابل بررسی: DBC S-15، سرمته NQ، فلوکولانت معدنی، مواد نسوز صادراتی.'),
Q('strength','مهم‌ترین مزیت موجود و قابل اثبات افرا چیست؟','multi',['روابط مدیرعامل و شبکه شخصی','ارتباط با خریداران صنعتی','دسترسی به تأمین‌کننده ترکیه','روابط تجاری عراق','ارتباط با تولیدکنندگان چین','تجربه فنی محصول','سرعت استعلام و مذاکره','اعتبار شرکت','سایر']),
Q('objective','هدف اصلی ۱۲ ماه آینده چیست؟','single',['جریان نقد و سود مستمر','۳ تا ۵ مشتری ثابت صنعتی','یک بازار و سبد محصول تخصصی','درآمد کمیسیون و خدمات','رشد صادرات','معاملات سفارشی کم‌ریسک','سایر'])]],
['انتخاب میدان بازی | Where to Play','یک ترکیب بازار–محصول–مشتری را در مرکز قرار می‌دهیم.',[
Q('trade','بازرگانی داخلی یا خارجی؟','single',['فقط داخلی','واردات برای بازار ایران','صادرات از ایران','داخلی و خارجی؛ اولویت داخلی','داخلی و خارجی؛ اولویت خارجی','نمایندگی/واسطه‌گری بین دو طرف','هنوز تصمیم نگرفته‌ام']),
Q('model','مدل اصلی پیشنهادی چیست؟','single',['تأمین سفارش‌محور B2B پس از پیش‌پرداخت','کمیسیون و معرفی بدون مالکیت کالا','خریدوفروش به نام افرا با سرمایه محدود','قرارداد تأمین مستمر اقلام مصرفی','نمایندگی یک تولیدکننده','تجارت پروژه‌ای با شریک مالی','مدل ترکیبی با تفکیک واضح']),
Q('focus','دامنه تمرکز مطلوب چقدر است؟','single',['یک بازار × یک خانواده محصول × یک گروه مشتری','یک بازار × ۲ یا ۳ محصول مرتبط × یک گروه مشتری','یک صنعت با چند محصول مکمل','دو مدل مجزا با منابع و KPI جدا','هر فرصت سودآور در هر بازار']),
Q('market','بازار جغرافیایی اولویت اول کجاست؟','text',[],'مقصد فروش را از محل تأمین تفکیک کنید.'),
Q('product','یک خانواده محصول اولویت‌دار چیست؟','text'),
Q('customer','یک گروه مشتری اولویت‌دار چیست؟','text'),
Q('alternative','ترکیب دوم بازار، محصول و مشتری که ارزش بررسی دارد چیست؟','long'),
Q('notdo','برای ساخت تمرکز، چه معاملاتی را باید رد کنیم؟','multi',['نیازمند خرید قبل از وصول از مشتری','نیازمند انبار اختصاصی','کالای عمومی کم‌حاشیه','سفارش بدون خریدار قطعی','فروش نسیه بلندمدت','ریسک فنی بالا','مسیر غیرقابل اجرای قانونی یا بانکی','سایر'])]],
['محصولات | Commodity vs. Specialty','نوع کالا را با سرمایه، تقاضا و قابلیت تحویل بدون انبار تطبیق می‌دهیم.',[
Q('families','کدام خانواده‌های محصول اولویت دارند؟','multi',['دستگاه حفاری و Drill Wagon','سرمته، راد و مصرفی حفاری','قطعات ماشین‌آلات معدنی','قطعات خاص صنعتی و ریلی','فلوکولانت و مواد شیمیایی معدنی','مواد نسوز و فولادسازی','تجهیزات برقی و کنترلی','کالاهای عمومی و پرگردش','سایر']),
Q('type','کالای عمومی یا تخصصی؟','single',['عمومی، استاندارد و رقابتی','خاص، فنی و کم‌رقیب','بیشتر خاص و کمی عمومی','بیشتر عمومی و کمی خاص','فقط براساس سود و شرایط پرداخت']),
Q('size','اندازه مطلوب معامله چیست؟','single',['کوچک و تکرارشونده','متوسط و کم‌ریسک','بزرگ فقط با پیش‌پرداخت پوشش‌دهنده','اندازه مهم نیست اگر سرمایه مشتری تأمین شود']),
Q('complex','چه میزان پیچیدگی فنی قابل پذیرش است؟','single',['استاندارد و بدون ابهام','قطعه با شماره فنی دقیق','محصول نیازمند تأیید مهندسی مشتری','تجهیزات سرمایه‌ای همراه خدمات تخصصی']),
Q('repeat','کدام محصول امکان فروش تکراری بیشتری دارد؟','single',['مصرفی و قطعات حفاری','مواد شیمیایی مصرفی معدن','قطعات تعمیر و نگهداری','ماشین‌آلات سنگین و دستگاه','کالای عمومی صنعتی','هنوز معلوم نیست']),
Q('warehouse','نبود انبار چه اثری بر انتخاب کالا دارد؟','single',['همه سفارش‌ها مستقیم از فروشنده تحویل شوند','از انبار طرف تجاری یا 3PL استفاده می‌کنیم','انبار موقت برای بعضی سفارش‌ها لازم می‌شود','بخشی از کالا نیازمند انبار دائمی است']),
Q('productrank','سه خانواده محصول را به‌ترتیب اولویت و با دلیل معرفی کنید.','long',[],'برای هر گزینه: تقاضای واقعی، سرمایه، سود، تکرار سفارش، دسترسی تأمین‌کننده و زمان تحویل.'),
Q('productveto','خط قرمز در پذیرش محصول چیست؟','multi',['خرید از منابع خودمان','نیاز به انبار','خدمات پس از فروش سنگین','اصالت غیرقابل تأیید','حاشیه سود کم نسبت به ریسک','مجوز دشوار یا عدم انطباق قانونی','عدم تطابق فنی','سایر'])]],
['بازارهای ایران، ترکیه و عراق','دسترسی شخصی را از کانال عملیاتی و تقاضای اثبات‌شده تفکیک می‌کنیم.',[
Q('roles','کشورها چه نقشی در زنجیره ارزش دارند؟','multi',['ایران: بازار فروش','ایران: تولیدکننده صادراتی','ترکیه: منبع تأمین','ترکیه: خریدار صادراتی','عراق: بازار فروش','عراق: شریک تأمین/توزیع','چین: تأمین‌کننده اصلی','کشورهای دیگر']),
Q('turkey','دسترسی واقعی به ترکیه در چه سطحی است؟','single',['معامله و قرارداد سابقه‌دار','تأمین‌کننده/شریک شناخته‌شده','روابط فردی قابل پیگیری','صرفاً مکاتبه و استعلام','مشتری خریدار واقعی در ترکیه']),
Q('iraq','دسترسی واقعی به عراق در چه سطحی است؟','single',['مشتری و تقاضای مشخص','شریک محلی با سابقه همکاری','شبکه روابط شخصی','فقط فرصت احتمالی','هنوز بازار آزمایش نشده']),
Q('direction','جریان اولویت‌دار تجارت چیست؟','single',['ترکیه به ایران','چین به ایران','ایران به ترکیه','ایران به عراق','تجارت درون کشور ترکیه با شریک قانونی','تجارت داخلی ایران','چند مسیر بعد از آزمایش']),
Q('marketproof','شواهد واقعی تقاضا در ترکیه یا عراق را توضیح دهید.','long',[],'محصول، خریدار، بودجه، حجم احتمالی و زمان سفارش.'),
Q('delivery','ترجیح اولیه شرایط تحویل خارجی چیست؟','multi',['EXW','FCA','FOB برای حمل دریایی','CPT','CIP','DAP','بسته به معامله','هنوز نیازمند راهنمایی هستیم']),
Q('destination','خریدار قراردادی، مصرف‌کننده نهایی، مقصد کالا و محل تحویل را چگونه مشخص می‌کنید؟','long'),
Q('compliance','ظرفیت بررسی قانون، مجوز، تحریم و امکان پرداخت چیست؟','single',['فرآیند و کارشناس در اختیار داریم','از مشاور مستقل موردی استفاده می‌کنیم','فرآیند هنوز طراحی نشده','ابهامات جدی وجود دارد'])]],
['مشتریان | Customer Segments','کسی که رابطه داریم لزوماً خریدارِ دارای بودجه و اختیار نیست.',[
Q('segments','مشتریان اولویت‌دار کدام‌اند؟','multi',['شرکت‌های معدنی و اکتشافی','پیمانکاران حفاری','فولاد و صنایع معدنی','کارخانه‌های فرآوری معدن','پتروشیمی و نفت و گاز','تجهیزات ریلی','توزیع‌کنندگان و تجار','خریداران ترکیه/عراق','مشتریان دولتی و مناقصات','سایر']),
Q('decisionmakers','تصمیم‌گیر خرید در سازمان مشتری کیست؟','multi',['مدیرعامل و مالک','مدیر خرید و بازرگانی','مدیر فنی و تعمیرات','مدیر معدن/پروژه','مدیر مالی','کمیته تدارکات','معرفی‌کننده/واسطه','سایر']),
Q('contacts','با چند مشتری دارای امکان جلسه یا استعلام واقعی ارتباط دارید؟','single',['۰ تا ۲','۳ تا ۵','۶ تا ۱۰','بیش از ۱۰','هنوز مشخص نیست']),
Q('orders','چند مشتری هم‌اکنون سفارش/بودجه تأییدشده دارند؟','single',['هیچ‌کدام','۱ تا ۲','۳ تا ۵','بیش از ۵','نمی‌دانم']),
Q('pain','مسئله مهم مشتری چیست؟','multi',['نبود مسیر مطمئن تأمین','قطعه خاص و کمیاب','اصالت و تطابق فنی','زمان تحویل کوتاه','قیمت مناسب','مذاکره با سازنده خارجی','خدمات تأمین تا تحویل','سایر']),
Q('frequency','فراوانی خرید مشتری هدف چیست؟','single',['ماهانه','فصلی','سالانه','پروژه‌ای و موردی','نامشخص']),
Q('customersample','سه مشتری نمونه و نیاز واقعی آن‌ها را بنویسید.','long')]],
['ارزش پیشنهادی | Value Propositions','چرا مشتری باید افرا را انتخاب کند و بابت چه ارزشی پول بدهد؟',[
Q('value','مزیت اصلی پیشنهادی افرا چیست؟','multi',['شناسایی کالای کمیاب/خاص','دسترسی به تولیدکننده معتبر','کاهش زمان و زحمت تأمین','تطبیق شماره فنی و اصالت','قیمت و مقایسه گزینه‌ها','هماهنگی مدارک و تحویل','تسهیل قرارداد مرحله‌ای','شبکه روابط بازار','سایر']),
Q('differentiator','وجه تمایز اصلی نسبت به رقیب چیست؟','single',['دسترسی و شبکه ارتباطی','تخصص محصول','کیفیت خدمات و پیگیری','قیمت پایین‌تر','سرعت و تحویل','هنوز مزیت متمایز روشن نیست']),
Q('promise','کدام وعده واقعاً قابل اجراست؟','multi',['پاسخ اولیه RFQ ظرف ۴۸ ساعت','۲ گزینه تأمین تأییدشده','مدارک اصالت و تطبیق فنی','گزارش منظم وضعیت سفارش','شفافیت هزینه و شرایط تحویل','فقط تعهد موردی و قراردادی']),
Q('technical','مسئول تأیید نهایی جایگزین فنی کیست؟','single',['تیم فنی خریدار','تولیدکننده','بازرس فنی ثالث','کارشناس افرا','با قرارداد تعیین شود']),
Q('valuephrase','در یک جمله ارزش پیشنهادی افرا را تعریف کنید.','long')]],
['کانال‌های فروش و رابطه‌محوری','روابط فردی را به Sales Pipeline و فرآیند تبدیل می‌کنیم.',[
Q('channels','روش‌های اصلی جذب مشتری کدام‌اند؟','multi',['معرفی شخصی مدیرعامل','Referral مشتری قبلی','تماس مستقیم با مدیر تدارکات','WhatsApp و تلفن','وب‌سایت و فرم RFQ','LinkedIn','مناقصه و فهرست تأمین‌کنندگان','نماینده محلی ترکیه/عراق','نمایشگاه تخصصی','سایر']),
Q('firstmove','اولین گام فروش چه باشد؟','single',['جلسه شناخت نیاز','دریافت RFQ واقعی','ارسال معرفی‌نامه/کاتالوگ','مذاکره قرارداد چارچوبی','ثبت و اولویت‌بندی مشتریان']),
Q('owner','مالک رابطه و مسئول پیگیری CRM چه کسی است؟','single',['مدیرعامل','کارشناس توسعه بازار','معرفی‌کننده','تیم کوچک با مسئول مشخص']),
Q('webrole','وب‌سایت چه وظیفه‌ای داشته باشد؟','multi',['اثبات اعتبار شرکت','دریافت RFQ فنی','نمایش محصول تخصصی','جذب مخاطب جدید','داشبورد پیگیری سفارش','معرفی رسمی شرکت']),
Q('conversion','بزرگ‌ترین مانع تبدیل استعلام به سفارش چیست؟','multi',['مشتری هنوز تصمیم نگرفته','قیمت بالا','عدم قطعیت زمان تحویل','پیش‌پرداخت مورد توافق نیست','ابهام اصالت/کیفیت','عدم احراز بودجه خریدار','حمل/پرداخت نامشخص','پیگیری فروش ناکافی','سایر'])]],
['روابط مشتری | Customer Relationships','ساخت اعتماد و فروش تکرارشونده، نه فقط اتکا به یک رابطه شخصی.',[
Q('relationship','مدل رابطه با مشتری چیست؟','single',['شخصی و معامله موردی','Key Account Management','قرارداد تأمین دوره‌ای','نماینده و کارمزد','تیم خدمات تأمین با مسئول ثابت']),
Q('retain','مشتری چرا دوباره از ما خرید می‌کند؟','multi',['اعتماد و ارتباط','قیمت و شفافیت','تحویل دقیق','سرعت پاسخ','اصالت کالا','انعطاف شرایط پرداخت','خدمات و گزارش حرفه‌ای']),
Q('trust','چطور برای دریافت پیش‌پرداخت اعتمادسازی کنیم؟','multi',['قرارداد و Milestone شفاف','مدرک سازنده و Proforma','تضمین متناسب و قابل ارائه','پیشینه معامله و معرفی معتبر','بازرسی و سند آماده‌سازی کالا','سپرده/حساب امانی قانونی در صورت امکان','سایر']),
Q('people_risk','وابستگی فروش به یک شخص چقدر است؟','single',['بسیار زیاد','متوسط','کم؛ CRM و رابطه سازمانی داریم','هنوز معلوم نیست']),
Q('after','تعهد خدمات پس از فروش چقدر باشد؟','multi',['رسیدگی به مغایرت','هماهنگی گارانتی سازنده','نصب/راه‌اندازی با شریک','فقط تحویل قراردادی','به‌صورت موردی'])]],
['مدل درآمد و قرارداد | Revenue Streams','تفاوت سود معامله و کمیسیون را در قرارداد روشن می‌کنیم.',[
Q('revenues','کدام منبع درآمد مناسب است؟','multi',['سود خریدوفروش (Trading Margin)','کمیسیون معرفی','کارمزد ثابت خدمات تأمین','ثابت + Success Fee','Retainer ماهانه','نمایندگی و توزیع','مدیریت خرید پروژه','سایر']),
Q('revenue_main','درآمد اصلی فقط از کدام باشد؟','single',['سود خریدوفروش','کمیسیون','کارمزد ثابت','کارمزد + درصد موفقیت','حق‌الزحمه ماهانه','ترکیبی برحسب قرارداد']),
Q('seller','فروشنده قراردادی کالا چه کسی باشد؟','single',['افرا با مالکیت کالا','تأمین‌کننده مستقیم؛ افرا عامل قراردادی','شریک محلی؛ افرا کارمزدگیر','بسته به ریسک معامله']),
Q('margin','حاشیه سود ناخالص هدف چیست؟','single',['کمتر از ۵٪','۵–۱۰٪','۱۰–۱۵٪','۱۵–۲۵٪','بیش از ۲۵٪','نامشخص']),
Q('fee','برای حفظ کمیسیون کدام سازوکار لازم است؟','multi',['قرارداد معرفی و حق‌العمل','عدم دورزدن در حدود قانون','زمان استحقاق و محاسبه شفاف','حق بررسی اسناد قرارداد/فروش','تمدید و پرداخت مستمر','سایر']),
Q('recurring','چطور درآمد تکرارشونده بسازیم؟','multi',['مصرفی‌های قابل سفارش مجدد','قرارداد چارچوب قطعات','Retainer ماهانه تأمین','کمیسیون تکرارشونده سازنده','نمایندگی محصول','فعلاً معامله موردی']),
Q('pricing','شیوه قیمت‌گذاری چیست؟','single',['بهای تمام‌شده + حاشیه','کمیسیون درصدی','نرخ ثابت خدمات','قیمت مبتنی بر ارزش/فوریت','ترکیبی']),
Q('currencies','ارزهای متداول قرارداد چیست؟','multi',['تومان/ریال','یورو','دلار','لیر ترکیه','دینار عراق','سایر'])]],
['سرمایه در گردش و پیش‌پرداخت','مهم‌ترین فیلتر پذیرش معامله برای افرا: Cash Conversion & Funding Gap.',[
Q('capital','شرایط سرمایه در گردش افرا چیست؟','single',['بسیار محدود؛ اتکا به پول مشتری','محدود، برای هزینه‌های مقدماتی','برای معاملات کوچک سرمایه داریم','شریک مالی در دسترس','مایل به اعلام نیستم']),
Q('maxcash','حداکثر پرداخت از منابع خود افرا قبل از دریافت از مشتری چقدر است؟','text',[],'عدد و واحد پول؛ پاسخ صفر نیز معتبر است.'),
Q('prepayment','سیاست مطلوب دریافت پیش‌پرداخت از مشتری چیست؟','single',['۱۰۰٪ قبل از خرید','به‌اندازه هزینه خرید و حمل اولیه','اقساط متناسب با پرداخت به فروشنده','بخشی از مشتری و بخشی شریک مالی','متناسب با اعتبار مشتری','هنوز مشخص نیست']),
Q('percent','در عمل چه پیش‌پرداختی می‌توان از مشتری گرفت؟','single',['کمتر از ۲۰٪','۲۰–۳۰٪','۳۰–۵۰٪','۵۰–۷۰٪','بیش از ۷۰٪','موردی و متفاوت','نامشخص']),
Q('supplier_terms','تأمین‌کننده معمولاً چه روش پرداختی می‌خواهد؟','single',['پرداخت ۱۰۰٪ قبل از تحویل','۳۰٪ سفارش و ۷۰٪ قبل از تحویل','پرداخت در نقاط پیشرفت','پرداخت مقابل مدارک/تحویل','اعتبار به افرا','متفاوت بر حسب معامله']),
Q('milestones','در چه نقاطی از مشتری وجه بگیریم؟','multi',['امضای قرارداد/ثبت سفارش','تأیید سفارش سازنده','آماده‌شدن کالا و بازرسی','پیش از حمل یا آزادسازی مدارک','تحویل و پذیرش نهایی','پرداخت مستقیم مشتری به فروشنده','سایر']),
Q('gap','اگر پرداخت به فروشنده جلوتر از وصول مشتری بود چه کنیم؟','single',['رد معامله','اصلاح Milestone قرارداد مشتری','تأمین مالی شریک','اعتبار تأمین‌کننده','منابع محدود افرا تا سقف مصوب']),
Q('advanceproof','مشتریان فعلی پیش‌پرداخت را واقعاً می‌پذیرند؟','single',['بله، با سابقه پرداخت','احتمالاً؛ هنوز توافق نشده','فقط با ضمانت','خیر، معمولاً پس از تحویل','نامشخص']),
Q('guarantees','مشتری برای پیش‌پرداخت چه تضمینی می‌خواهد؟','single',['تضمین و توان ارائه داریم','ضمانت لازم است ولی دشوار','قرارداد و اعتماد کافی است','وابسته به قرارداد','هنوز معلوم نیست']),
Q('credit','فروش نسیه بعد از تحویل پذیرفتنی است؟','single',['خیر','فقط با ضمانت معتبر','فقط مشتری معتبر و سقف محدود','با شریک مالی','تصمیم نگرفته‌ایم']),
Q('financial_red','سه خط قرمز مالی هر معامله چیست؟','long',[],'حداکثر شکاف نقدینگی، مدت بلوکه‌شدن سرمایه و سود خالص مورد انتظار.')]],
['فعالیت‌های کلیدی و تحویل سفارش','Supply Chain: از RFQ تا تحویل، با حداقل دارایی و تعهد متناسب.',[
Q('fulfillment','مدل تحویل ترجیحی چیست؟','single',['مستقیم از فروشنده به مشتری','انبار ثالث / 3PL در ترکیه','محل توافقی یا مرز به نماینده مشتری','تأمین داخلی تا محل مشتری','موردی']),
Q('storage','با نداشتن انبار، کدام راه‌حل مناسب است؟','multi',['سفارش بدون موجودی','انبار موقت شخص ثالث با هزینه مشتری','Direct Delivery','شریک دارای انبار','اصلاً وارد کالای انباری نشویم']),
Q('activities','افرا انجام چه فعالیت‌هایی را برعهده بگیرد؟','multi',['شناخت نیاز و RFQ','جست‌وجوی تأمین‌کننده','مذاکره قیمت و زمان','تطبیق فنی و اصالت','قرارداد و پرداخت','بازرسی و حمل','ترخیص با کارگزار مجاز','پیگیری شکایت/گارانتی']),
Q('quote_time','زمان هدف پاسخ به RFQ چیست؟','single',['یک روز کاری','۲ تا ۳ روز','۴ تا ۷ روز','متناسب با پیچیدگی']),
Q('logistics','شریک لجستیک و ترخیص در اختیار داریم؟','single',['بله، سابقه معامله واقعی','بله، هنوز آزمایش نشده','در حال بررسی','خیر']),
Q('quality','چه کسی مغایرت فنی را مدیریت می‌کند؟','single',['سازنده','افرا طبق قرارداد','بازرس مستقل','مشتری با تأیید قبل از سفارش','موردی']),
Q('delivery_risks','مسئولیت تأخیر، خسارت حمل، خرابی و تعویض را شرح دهید.','long'),
Q('systems','چه ابزار ساده‌ای نیاز است؟','multi',['CRM و Pipeline فروش','فرم استاندارد RFQ','چک‌لیست قرارداد','پیگیری پرداخت Milestone','بایگانی فنی و Proforma','همه به‌تدریج'])]],
['منابع و شرکا | Resources & Partners','چه چیز را خودمان انجام بدهیم و چه چیزی را با قرارداد از شبکه بگیریم؟',[
Q('resources','منابع کلیدی مورد نیاز افرا چیست؟','multi',['روابط و اعتبار مدیرعامل','بانک مشتریان و CRM','تأمین‌کنندگان تأییدشده','کارشناس فنی','کارشناس بازرگانی خارجی','وب‌سایت و RFQ','سرمایه اولیه محدود','شریک مالی/عملیاتی']),
Q('staff','ظرفیت واقعی نیروی انسانی چقدر است؟','single',['فقط مدیرعامل','۱ تا ۲ نفر پاره‌وقت','۲ تا ۴ نفر','تیم مستقل ۵ نفر یا بیشتر']),
Q('outsourcing','چه فعالیت‌هایی برون‌سپاری شوند؟','multi',['انبار و حمل','ترخیص','کنترل فنی','قرارداد و حقوقی','پرداخت ارزی قانونی','دیجیتال مارکتینگ','جست‌وجوی تأمین‌کننده']),
Q('partners','شرکای کلیدی کدام‌اند؟','multi',['تولیدکننده','توزیع‌کننده ترکیه','شریک عراق','معرف مشتری','حمل و فورواردر','ترخیص‌کار','مشاور حقوقی/بانکی','تأمین‌کننده مالی','بازرس ثالث']),
Q('partnerproof','کدام شریک هم‌اکنون سابقه معامله یا توافق قابل اثبات دارد؟','long'),
Q('suppliers','راهبرد انتخاب تأمین‌کننده چیست؟','single',['برای هر RFQ چند تأمین‌کننده رقابتی','۲ تا ۳ تأمین‌کننده تأییدشده','نمایندگی ترجیحی سازنده','تأمین‌کننده اصلی و پشتیبان']),
Q('exclusivity','نمایندگی انحصاری چه زمانی جذاب است؟','single',['با تقاضای ثابت و بدون تعهد خرید سنگین','برای محصول تخصصی','اگر انبار و سرمایه نخواهد','فعلاً نمی‌خواهیم']),
Q('partner_fee','پرداخت به شرکای فروش/معرفی چگونه باشد؟','multi',['کمیسیون پس از وصول','کارمزد معرفی موفق','سهم قراردادی از سود','نمایندگی مستقل','توافق موردی']),
Q('dependency','اگر یک شریک یا رابطه شخصی حذف شود، برنامه جایگزین چیست؟','long')]],
['ساختار هزینه و کنترل ریسک','هزینه‌های آشکار و پنهان، مسئولیت قراردادی و انطباق قانونی.',[
Q('costs','هزینه‌های مهم کدام‌اند؟','multi',['سفر و توسعه روابط','کارمزد بازاریابی','استعلام و کنترل فنی','حمل، بیمه و انبار ثالث','گمرک و مالیات','تغییر نرخ ارز','ضمانت و هزینه مالی','وب‌سایت و CRM','قرارداد و مشاور حقوقی']),
Q('fixed','سیاست هزینه ثابت چیست؟','single',['حداقل ثابت و برون‌سپاری','توسعه تدریجی همراه درآمد','تشکیل واحد فروش تخصصی','ساخت زیرساخت و انبار']),
Q('risks','ریسک‌های مهم افرا چیست؟','multi',['عدم وصول وجه مشتری','تأمین‌کننده نامعتبر','مغایرت فنی/تقلبی بودن','نوسان ارز','تأخیر تحویل','تحریم و محدودیت قانونی/بانکی','هزینه انبار','دور زدن واسطه','وابستگی به روابط یک نفر','گارانتی/تعهد نامحدود']),
Q('controls','کنترل‌های لازم قبل از معامله چیست؟','multi',['احراز هویت طرفین و ذی‌نفع نهایی','غربالگری تحریم و کنترل صادرات','بررسی مجوز و امکان پرداخت قانونی','Incoterms و بیمه','تأیید اصالت و شماره فنی','پذیرش فنی مشتری','قرارداد بازپرداخت/فسخ/حل اختلاف']),
Q('profitfloor','حداقل سود خالص یا ناخالص قابل قبول چقدر است؟','text'),
Q('riskcap','سقف ریسک مالی و حقوقی قابل پذیرش چقدر است؟','long'),
Q('reject','چه شرایطی باعث رد فوری معامله است؟','multi',['نامشخص بودن خریدار نهایی','عدم امکان قانونی پرداخت/حمل','عدم انطباق فنی','نبود تأمین مالی سفارش','نیاز به انبار سنگین','ریسک حقوقی نامحدود','سود کمتر از کف تعیین‌شده'])]],
['گزینه نهایی و آزمایش ۹۰روزه','مدل را فرضیه در نظر می‌گیریم، سپس با سفارش واقعی و جریان نقدی تست می‌کنیم.',[
Q('optionA','گزینه راهبردی اول را بنویسید: بازار + محصول + مشتری + مدل درآمد + تأمین مالی.','long'),
Q('optionB','گزینه دوم برای مقایسه چیست؟','long'),
Q('decisioncriteria','در اولویت‌بندی مدل‌ها چه معیارهایی بیشترین وزن دارند؟','multi',['دسترسی به سفارش واقعی','حاشیه سود','سرمایه اندک','امکان پیش‌پرداخت','بدون انبار','ارتباطات ترکیه و عراق','ریسک قانونی و فنی کنترل‌پذیر','تکرار خرید']),
Q('test','اولین آزمایش ۳۰روزه چیست؟','single',['۵ گفت‌وگو و ۲ RFQ معتبر','۳ استعلام فنی از تأمین‌کنندگان','یک مذاکره با پیش‌پرداخت مرحله‌ای','ارزیابی ۳ شریک ترکیه/عراق','یک قرارداد عاملیت/کمیسیون']),
Q('success','چه چیزی موفقیت آزمایش را اثبات می‌کند؟','multi',['PO واقعی','وصول پیش‌پرداخت','حاشیه سود و شکاف نقدی قابل قبول','تأیید تأمین‌کننده معتبر','سفارش مجدد/قرارداد چارچوبی']),
Q('kpi','کدام KPIها ماهانه پایش شوند؟','multi',['RFQ معتبر','نرخ تبدیل RFQ به PO','حاشیه سود تحقق‌یافته','روزهای درگیری سرمایه','مشتری تکراری','تحویل به‌موقع','درآمد کارمزدی']),
Q('review','زمان بازنگری استراتژی چیست؟','single',['۳۰ روز','۶۰ روز','۹۰ روز','پس از ۲ معامله واقعی']),
Q('last','ملاحظات یا پیشنهادهای تکمیلی آقای بوداغی','long')]]
];
const groups=S.map((a,i)=>({id:i,title:a[0],subtitle:a[1],questions:a[2]}));
const all=groups.flatMap(x=>x.questions),STORE='afra-bmc-v1-2026';
let values={},current=0,result=false;
const $=s=>document.getElementById(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function has(v){return Array.isArray(v)?v.length>0:typeof v==='string'&&v.trim().length>0;}
function val(id){let v=values[id];return has(v)?Array.isArray(v)?v.join('، '):String(v):'هنوز پاسخ داده نشده';}
function safe(){try{localStorage.setItem(STORE,JSON.stringify({version:1,updatedAt:new Date().toISOString(),answers:values}));$('saveText').textContent='آخرین ذخیره در این مرورگر: '+new Date().toLocaleTimeString('fa-IR')}catch(e){$('saveText').textContent='ذخیره مرورگر ممکن نیست؛ فایل را دریافت کنید.'}}
function load(){try{let a=JSON.parse(localStorage.getItem(STORE)||'{}');values=a.answers&&typeof a.answers==='object'&&!Array.isArray(a.answers)?a.answers:{}}catch(e){values={}}}
function progress(){let n=all.filter(q=>has(values[q.id])).length,p=Math.round(n*100/all.length);$('progressText').textContent=n.toLocaleString('fa-IR')+' از '+all.length.toLocaleString('fa-IR')+' پرسش پاسخ داده شده';$('progress').setAttribute('aria-valuenow',p);$('meterFill').style.width=p+'%';return p}
function makeNav(){let out=groups.map((g,i)=>{let done=g.questions.filter(q=>has(values[q.id])).length;return '<button class="nav-item '+(!result&&current===i?'active':'')+'" type="button" data-step="'+i+'"><span class="nav-number">'+(i+1).toLocaleString('fa-IR')+'</span><span>'+esc(g.title)+'</span><span class="nav-check">'+(done===g.questions.length?'✓':done?done.toLocaleString('fa-IR'):'')+'</span></button>'}).join('');$('sectionList').innerHTML=out+'<button class="nav-item '+(result?'active':'')+'" type="button" data-result="true"><span class="nav-number">✓</span>خروجی و بوم اولیه</button>';}
function question(q,i){let h='<section class="question"><div class="q-head"><span class="q-index">'+(i+1).toLocaleString('fa-IR')+'</span><label class="qlabel" for="q_'+q.id+'">'+esc(q.label)+'</label></div>'+(q.help?'<p class="help">'+esc(q.help)+'</p>':'');const v=values[q.id];
if(q.type==='text')h+='<input class="field" id="q_'+q.id+'" data-answer="'+q.id+'" type="text" autocomplete="off" placeholder="پاسخ خود را بنویسید…" value="'+esc(v||'')+'">';
if(q.type==='long')h+='<textarea class="field long" id="q_'+q.id+'" data-answer="'+q.id+'" rows="3" placeholder="توضیح، مصداق یا عدد مورد نظر…">'+esc(v||'')+'</textarea>';
if(q.type==='single')h+='<div class="selectwrap"><select class="field" id="q_'+q.id+'" data-answer="'+q.id+'"><option value="">یک گزینه را انتخاب کنید…</option>'+q.opts.map(o=>'<option value="'+esc(o)+'" '+(v===o?'selected':'')+'>'+esc(o)+'</option>').join('')+'</select></div>';
if(q.type==='multi')h+='<div class="choices">'+q.opts.map(o=>'<label class="choice '+((v||[]).includes(o)?'selected':'')+'"><input type="checkbox" data-answer="'+q.id+'" value="'+esc(o)+'" '+((v||[]).includes(o)?'checked':'')+'><span>'+esc(o)+'</span></label>').join('')+'</div>';
if(q.type!=='long')h+='<details class="notes" '+(has(values[q.id+'_note'])?'open':'')+'><summary>توضیح تکمیلی یا پاسخ آزاد (اختیاری)</summary><textarea class="field long" rows="2" data-note="'+q.id+'" placeholder="جزئیات، محدودیت‌ها یا گزینه‌ای که در فهرست نیست…">'+esc(values[q.id+'_note']||'')+'</textarea></details>';
return h+'</section>';}
function render(){makeNav();let p=progress();if(result)return renderResult(p);let g=groups[current];$('content').innerHTML='<div class="stephead"><div><span class="step-no">بخش '+(current+1).toLocaleString('fa-IR')+' از '+groups.length.toLocaleString('fa-IR')+'</span><h2>'+esc(g.title)+'</h2><p>'+esc(g.subtitle)+'</p></div><span class="stepcount">'+g.questions.length.toLocaleString('fa-IR')+' پرسش</span></div>'+g.questions.map(question).join('')+'<div class="foot-actions"><button class="btn btn-out" id="prev" type="button" '+(current===0?'disabled':'')+'>مرحله قبل</button><button class="btn btn-primary" id="next" type="button">'+(current===groups.length-1?'مشاهده بوم اولیه':'ذخیره و مرحله بعد')+' ←</button></div>';
$('prev').onclick=()=>move(Math.max(0,current-1));$('next').onclick=()=>current===groups.length-1?showResult():move(current+1);
$('content').querySelectorAll('[data-answer]').forEach(el=>el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',e=>{let t=e.target,id=t.dataset.answer;if(t.type==='checkbox'){values[id]=Array.from($('content').querySelectorAll('input[data-answer="'+id+'"]:checked')).map(x=>x.value);t.closest('label').classList.toggle('selected',t.checked)}else values[id]=t.value;safe();progress();makeNav()}));
$('content').querySelectorAll('[data-note]').forEach(el=>el.addEventListener('input',e=>{values[e.target.dataset.note+'_note']=e.target.value;safe()}));}
function move(i){current=i;result=false;render();window.scrollTo({top:0,behavior:'smooth'})}
function showResult(){result=true;render();window.scrollTo({top:0,behavior:'smooth'})}
const BMC=[
['Customer Segments | مشتریان',['segments','customer','customersample']],
['Value Propositions | ارزش پیشنهادی',['value','differentiator','valuephrase']],
['Channels | کانال‌ها',['channels','webrole']],
['Customer Relationships | روابط',['relationship','retain','trust']],
['Revenue Streams | درآمد',['revenues','revenue_main','recurring']],
['Key Resources | منابع',['resources','staff']],
['Key Activities | فعالیت‌ها',['activities','systems']],
['Key Partners | شرکا',['partners','partnerproof']],
['Cost Structure | هزینه‌ها',['costs','fixed','financial_red']]
];
function block(ids){return ids.filter(id=>has(values[id])).map(id=>val(id)).join(' / ')||'نیازمند اطلاعات و شواهد بیشتر';}
function checks(){let a=[];if(!has(values.market)||!has(values.product)||!has(values.customer))a.push('ترکیب بازار، محصول و مشتری اصلی هنوز کامل نشده است.');if(!has(values.advanceproof)||values.advanceproof==='نامشخص')a.push('امکان واقعی دریافت پیش‌پرداخت از مشتری هنوز نیازمند اعتبارسنجی است.');if(!has(values.maxcash))a.push('سقف مجاز استفاده از منابع خود افرا مشخص نشده است.');if(values.warehouse==='بخشی از کالا نیازمند انبار دائمی است')a.push('مدل نیازمند انبار با محدودیت زیرساخت فعلی تضاد دارد؛ هزینه انبار ثالث یا حذف محصول بررسی شود.');if(values.people_risk==='بسیار زیاد')a.push('وابستگی فروش به رابطه شخصی باید با CRM و چند رابط سازمانی کاهش پیدا کند.');if(values.advanceproof==='خیر، معمولاً پس از تحویل')a.push('شرایط واقعی خریدار با مدل پیش‌پرداخت‌محور سازگار نیست؛ کمیسیون/نمایندگی یا تأمین مالی شریک را مقایسه کنید.');a.push('در تجارت خارجی، پیش از قرارداد باید انطباق مقررات، طرفین، کالا، پرداخت قانونی و مسئولیت تحویل بررسی شود.');a.push('این بوم فرضیه است؛ تنها PO، پیش‌پرداخت، تحویل و سود تحقق‌یافته مدل را تأیید می‌کنند.');return a}
function renderResult(p){$('content').innerHTML='<div class="stephead"><div><span class="step-no">Business Model Canvas | Draft</span><h2>خلاصه تصمیم‌ها و بوم اولیه افرا</h2><p>بر اساس پاسخ‌های ثبت‌شده؛ خانه‌های بدون شواهد به‌صورت خالیِ تصمیمی باقی می‌مانند.</p></div><span class="stepcount">'+p.toLocaleString('fa-IR')+'٪ تکمیل</span></div><div class="summary-top"><h3>Strategic Choice — انتخاب‌های اصلی</h3><p><b>مقصد بازار:</b> '+esc(val('market'))+'<br><b>محصول اصلی:</b> '+esc(val('product'))+'<br><b>گروه مشتری:</b> '+esc(val('customer'))+'<br><b>مدل معامله:</b> '+esc(val('model'))+'<br><b>مدل درآمد:</b> '+esc(val('revenue_main'))+'<br><b>پیش‌پرداخت:</b> '+esc(val('prepayment'))+'</p></div><h3>Business Model Canvas — نسخه اولیه</h3><div class="canvas">'+BMC.map(x=>'<article class="canvas-card"><h3>'+esc(x[0])+'</h3><p>'+esc(block(x[1]))+'</p></article>').join('')+'</div><h3>موارد نیازمند اعتبارسنجی</h3><ol class="decision-list">'+checks().map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><h3>مرور جزئیات پاسخ‌ها</h3>'+groups.map(g=>'<details class="notes" style="display:block;border-bottom:1px solid #dfe7e8;padding:13px 0"><summary style="font-size:16px">'+esc(g.title)+'</summary>'+g.questions.map(q=>'<div class="review-answer"><strong>'+esc(q.label)+'</strong><p>'+esc(val(q.id))+'</p>'+(has(values[q.id+'_note'])?'<p>توضیح: '+esc(values[q.id+'_note'])+'</p>':'')+'</div>').join('')+'</details>').join('')+'<div class="sharebar"><button class="btn btn-gold" type="button" id="txt">گزارش قابل ارسال</button><button class="btn btn-out" type="button" id="json">دریافت پاسخ‌ها (JSON)</button><button class="btn btn-out" type="button" id="import">واردکردن پاسخ‌ها</button><button class="btn btn-out" type="button" id="pdf">چاپ / PDF</button><button class="btn btn-out" type="button" id="share">اشتراک‌گذاری</button></div><div class="foot-actions"><button class="btn btn-out" type="button" id="back">بازگشت به پرسشنامه</button><button class="btn btn-primary" type="button" id="focusagain">اصلاح انتخاب‌های اصلی</button></div><input type="file" id="importfile" accept=".json,application/json" hidden>';
$('txt').onclick=downloadReport;$('json').onclick=downloadData;$('pdf').onclick=()=>window.print();$('share').onclick=shareReport;$('back').onclick=()=>move(groups.length-1);$('focusagain').onclick=()=>move(1);$('import').onclick=()=>$('importfile').click();$('importfile').onchange=importData;}
function reportText(){let lines=['AFRA TEJARAT MAD — BUSINESS MODEL DESIGN','تاریخ خروجی: '+new Date().toLocaleDateString('fa-IR'),'','انتخاب بازار: '+val('market'),'محصول: '+val('product'),'مشتری: '+val('customer'),'مدل معامله: '+val('model'),'پیش‌پرداخت: '+val('prepayment'),'','BUSINESS MODEL CANVAS'];for(let b of BMC)lines.push('• '+b[0]+'\n'+block(b[1]));lines.push('','توجه: این بوم اولیه و فرضیه‌ای است.','',...checks().map(x=>'• '+x),'','پاسخ کامل پرسشنامه:');for(let g of groups){lines.push('','━━ '+g.title+' ━━');for(let q of g.questions){lines.push(q.label,'پاسخ: '+val(q.id));if(has(values[q.id+'_note']))lines.push('توضیح: '+values[q.id+'_note']);lines.push('')}}return lines.join('\n')}
function dl(name,content,mime){const u=URL.createObjectURL(new Blob([content],{type:mime}));let a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500)}
function downloadReport(){dl('Afra-Business-Model-Report.txt',reportText(),'text/plain;charset=utf-8');toast('گزارش دریافت شد. فایل را برای بررسی ارسال کنید.')}
function downloadData(){dl('Afra-Business-Model-Answers.json',JSON.stringify({name:'Afra business model',version:1,createdAt:new Date().toISOString(),answers:values},null,2),'application/json;charset=utf-8');toast('فایل پاسخ‌ها برای ادامه در دستگاه دیگر دریافت شد.')}
function importData(e){let f=e.target.files&&e.target.files[0];if(!f)return;let reader=new FileReader();reader.onload=()=>{try{let obj=JSON.parse(String(reader.result));if(!obj.answers||typeof obj.answers!=='object'||Array.isArray(obj.answers))throw Error('Invalid');let ids=new Set(all.map(x=>x.id));let clean={};for(let k of Object.keys(obj.answers)){if(ids.has(k)||k.endsWith('_note')&&ids.has(k.slice(0,-5))){let v=obj.answers[k];if(typeof v==='string'||Array.isArray(v)&&v.every(x=>typeof x==='string'))clean[k]=v;}}if(!confirm('پاسخ‌های فعلی با فایل انتخاب‌شده جایگزین شوند؟'))return;values=clean;safe();render();toast('پاسخ‌ها با موفقیت وارد شدند.')}catch(err){toast('فایل انتخاب‌شده ساختار معتبر پرسشنامه را ندارد.')}};reader.readAsText(f)}
async function shareReport(){try{let f=new File([reportText()],'Afra-Business-Model-Report.txt',{type:'text/plain'});if(navigator.canShare&&navigator.canShare({files:[f]})&&navigator.share){await navigator.share({title:'Business Model Afra',files:[f]});return}}catch(e){if(e.name==='AbortError')return}downloadReport();toast('فایل گزارش را در واتس‌اپ یا ایمیل پیوست کنید.')}
function toast(m){let t=$('toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,4500)}
$('sectionList').addEventListener('click',e=>{let b=e.target.closest('button');if(!b)return;if(b.dataset.step!==undefined)move(Number(b.dataset.step));else if(b.dataset.result)showResult()});
$('reviewBtn').onclick=showResult;$('exportBtn').onclick=downloadReport;
load();render();