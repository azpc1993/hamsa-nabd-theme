# همسة نبض 11.0.0

ملاحظة: كان فرع `main` قد استبدل ثيم Twig بثيم React (commit bba7f41). بقرار المالك استُعيد ثيم Twig من 23cd4f6، واستُعيد `scripts/` من 71db83b^. رقم الإصدار في package.json كان 11.0.0 مسبقاً.

## إصلاحات الأساس
- حذف المفاتيح العليا `version` و`theme_name` و`repo_url`. حذف 30 رابط jsdelivr. كتابة twilight.json بشكل مضغوط (169KB ← 121.5KB).
- `is_more_button_enabled` (من theme-raed) مسجّل الآن. ربط `show_product_offers` و`hn_enable_promo_popup` (كانا بلا أثر).
- مفاتيح `blocks.hamsa.*` ← `hn.blocks.*`، وأُضيفت `hn.v93.*`.
- سكربتات `scripts/qa/`: qa-json, qa-fields, qa-trans, qa-refs, qa-preview.js.

## إضافات
- الوضع الداكن/الفاتح: زر في الهيدر، حفظ في localStorage، اتباع prefers-color-scheme، سكربت inline في head يمنع الوميض، 3 لوحات فاتحة و3 داكنة.
- `home.before-after`: مقارنة قبل/بعد (ماوس، لمس، لوحة مفاتيح، role=slider).
- `home.featured-spotlight`: منتج واحد بحقل products المستخدم في theme-raed.
- `home.articles-slider`: مقالات مختارة يدوياً.
- تسجيل `home.custom-testimonials` (بديل home.testimonials الأساسي).
- بنر صورة التصنيف وصور التصنيفات الفرعية في صفحة التصنيف.
- شاشة تحميل (3 أشكال) ونقش خلفية المتجر.

## توسعات
- بطاقة المنتج: 5 نماذج، تكبير عند hover (للأجهزة التي تدعمه فقط)، نمط الزر، شكل الملصق ولونه، توحيد الارتفاع.
- الإعدادات: من 34 إلى 63 إعداداً فعّالاً في 12 مجموعة (+23 عنواناً وفاصلاً).
- department-grid: عرض شبكة/سلايدر و`popup_id` يفتح promo-popup (حقل `popup_id` جديد في promo-popup).
- icon-categories: الشكل المستطيل.
- hero-banner: فيديو MP4 لكل شريحة مع صورة بديلة، ومفتاح التشغيل التلقائي.
- مقاسات الصور المقترحة في أوصاف حقول المكوّنات الجديدة والموسّعة، مأخوذة من CSS.

## لم يُنفّذ
راجع BLOCKERS.md: المتغيرات على البطاقة، تسجيل home.testimonials، بنر السلة والقائمة، الصفحات الرئيسية المتعددة، زر إيقاف السلايدر للزائر.
