# Afra Tejarat Mad — industrial sourcing website

Public website: https://hassnboudlaie.github.io/afra-tejarat-mad/

English: https://hassnboudlaie.github.io/afra-tejarat-mad/en/

An image-rich bilingual corporate website. Each main section has its own static URL, and every English route is independent of the Persian page. Navigation stays in the selected language. `?lang=en` / `?lang=fa` links are supported for older shared URLs; `pilot-v2.html` redirects to the current site.

## مدیریت بدون برنامه‌نویسی

۱. صفحه `admin/` را باز کنید و وارد Pages CMS شوید: https://app.pagescms.org/

۲. با حساب GitHub مالک وارد شوید و دسترسی را فقط برای مخزن `hassnboudlaie/afra-tejarat-mad` فعال کنید. اتصال اولیه حساب باید توسط مالک انجام شود؛ سایت رمز یا توکن GitHub دریافت نمی‌کند.

۳. در Pages CMS شاخه `main` و بخش **Afra website / وب‌سایت افرا** را انتخاب کنید. متن فارسی و English کنار هم در فیلدهای مجزا قرار دارند. برای محصول یا دسته جدید از افزودن آیتم در **Products & industries** استفاده کنید و شناسه انگلیسی یکتا بدهید. شناسه دسته‌های فعلی را پس از انتشار لینک تغییر ندهید.

۴. تصویر جدید را از Media بارگذاری و در فیلد Image انتخاب کنید. تنها تصاویر متعلق به شرکت یا دارای مجوز تجاری را بارگذاری کنید. برای تصاویر نیازمند Attribution، اطلاعات منبع و مجوز را نیز به `assets/photo-credits.json` اضافه کنید. هیچ قیمت خرید، حاشیه سود، اطلاعات مشتری یا مکاتبه محرمانه‌ای را وارد محتوا نکنید.

۵. Save را بزنید؛ بعد از اتمام انتشار GitHub Pages، صفحه را Refresh کنید. سایت فایل `content/site.json` را با `no-cache` می‌خواند؛ برای ویرایش معمولی نیازی به Build یا تغییر کد نیست.

ویرایشگر محلی `admin/` بدون Login هم امکان تغییر متن، انتخاب تصاویر موجود و افزودن دسته را دارد. این حالت فقط خروجی `site.json` می‌دهد و عمومی نمی‌کند. فایل خروجی را در مسیر `content/site.json` مخزن جایگزین کنید. فایل محتوای یک سایت عمومی محل نگهداری اطلاعات محرمانه نیست.

GitHub Pages و Pages CMS برای این ساختار در پلن رایگان قابل استفاده‌اند. دامنه اختصاصی یا هر سرویس آینده جداگانه هزینه دارد. هیچ سرویس پولی، دیتابیس یا اشتراک جدیدی در این تغییر فعال نشده است.

## RFQ behaviour

The form validates required fields, saves a draft only in the visitor’s browser, and presents the message for review. The visitor chooses WhatsApp or email and controls the final send. **The website does not store inquiries on a server, confirm receipt, or attach files automatically.** Drawings can be attached in the chosen messaging application. Text can also be copied or downloaded. Clearing the draft removes the locally saved request.

The corporate email is `info@afratejaratmad.com`; procurement WhatsApp remains the verified existing contact `+98 912 215 3235`. Management contact and office details follow the supplied corporate banner. No live inquiry is sent during automated QA.

## Source and maintenance

- `content/site.json`: public bilingual business content.
- `assets/site-render.mjs`: shared safe renderer used by the static build and live content refresh.
- `assets/site.mjs`: navigation, search, RFQ and language-route compatibility.
- `assets/site.css`: responsive visual system and local fonts.
- `assets/photos/` and `assets/photo-credits.json`: local licensed photographs and provenance.
- `admin/`: local visual editor and authenticated CMS entry point.
- `.pages.yml`: Pages CMS schema; no OAuth secret or API key.
- `scripts/build.mjs`: regenerates the static HTML, metadata and sitemap using Node 18+ without dependencies.

Run `node scripts/build.mjs` after changing templates or the initial content snapshot. Run `node scripts/check.mjs` for structural checks. Ordinary CMS changes appear through the live content refresh; regenerate static HTML periodically to refresh the no-JavaScript/SEO snapshot.

The pre-redesign Git commit is `58f9ac5c528eb66e12b742bbb92d47011928f4c4`, retained on `backup/pre-redesign-20261020`. Restore selected files from that branch or revert the redesign commit to roll back. The unrelated personal-site HTML and ZIP in the original repository are preserved.

The four countries describe markets and sourcing connections, not owned offices. Brand references are application examples, not dealership claims. Photographs are illustrative, not Afra inventory or delivery records. The mine hero is CC BY-SA 4.0; its transformed photo remains under that licence. The Epiroc drilling image is CC BY 4.0; both have visible links to full source credits. Local fonts are SIL Open Font License; licence files are included in `assets/fonts/`.
