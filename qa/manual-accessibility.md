# Manual accessibility review — 2026-10-20

The public preview ran 32 axe-core cases across eight routes, Persian/English, and 390/1440 CSS-pixel widths. After corrections, it returned **zero automatic violations**. The automated result retained one manual-review rule group per case, for gradient text or the native textarea.

The CTA uses a radial gradient with the lightest declared colour `#1d5368`. Ratios below use that least favourable declared background. All exceed the 4.5:1 threshold for normal text:

| Element | Foreground | Background | Contrast |
|---|---|---|---:|
| CTA heading | #ffffff | #1d5368 | 8.44:1 |
| CTA section label | #e2b967 | #1d5368 | 4.57:1 |
| CTA body | #b8ccd5 | #1d5368 | 5.08:1 |
| RFQ textarea | #173342 | #ffffff | 13.22:1 |
| Small section labels | #80571b | #f3f3ef | 5.73:1 |
| Image number badge | #ffffff | #092c3e | 14.57:1 |

The RFQ notes textarea was focused through the real public browser UI and visually checked. The field, label and focus ring were fully visible and were not covered by the sticky header in that normal interaction. Axe had reported partial occlusion during its automated scroll.

The functional suite also exercised mobile menu, Escape focus return, labels, native required validation and the reviewed RFQ flow. No external message was sent. These tests do not establish complete WCAG conformance; physical Android hardware, assistive technology combinations and other browser engines remain untested.
