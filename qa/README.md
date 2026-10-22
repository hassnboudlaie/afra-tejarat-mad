# Public release QA

The live production website passed **456 browser acceptance checks** (149.6 seconds) in Cloud Chrome, across Persian and English and CSS viewport widths 360, 390, 768 and 1440. The same functional suite had passed on the isolated preview before promotion.

The shared release code completed **32 axe-core accessibility cases with zero automatic violations** after contrast corrections. Gradient text and native textarea findings were reviewed manually; see `manual-accessibility.md`. This does not constitute a WCAG conformance certification.

- Functional suite: `browser.html` (runs on demand; never sends an external message).
- Accessibility suite: `accessibility.html` (locally bundled axe-core; not loaded by corporate pages).
- Result summary: `release-checks.json`.
- Static source and mocked RFQ checks: `static-checks.json`.
- Actual live-site screenshot: `afra-live-fa.jpg`.

Physical Android devices, Firefox/Safari engines, actual WhatsApp/email message delivery and the owner’s Pages CMS authentication were not tested. The local editor add/edit/import flow was tested. The final admin-label change is a display-only usability improvement.

The screenshot contains the licensed mine photograph by Peabody Energy, Inc. (CC BY-SA 4.0). Full image source and licence: https://hassnboudlaie.github.io/afra-tejarat-mad/credits/#alternate-hero
