# ثيم همسة نبض — Salla Twilight Theme (نسخة احترافية مستقلة)

ثيم مبني على محرك **Twilight** مع واجهة وهوية مخصصة، ويعتمد على مكونات Salla الرسمية في الوظائف الأساسية مثل السلة والبحث والحساب والمنتجات، مع مكونات همسة نبض المخصصة فوقها.

## أبرز الميزات التنافسية
- **هيدر متقدم**: شريط عروض متحرك (Marquee)، بحث فوري مباشر، قائمة كبيرة (Mega Menu) بملء الشاشة بدل القوائم المنسدلة التقليدية، شارات ثقة، شريط تنقل سفلي مخصص للجوال
- **سلة منزلقة (Cart Drawer)** بدل صفحة سلة تقليدية، مع شريط تقدّم "شحن مجاني"
- **بطاقة منتج غنية**: تبديل الصورة عند الهوفر، قلب مفضلة، أزرار إضافة سريعة/معاينة سريعة (Quick View) بدون مغادرة الصفحة، سواتش ألوان، شارات ديناميكية (خصم/جديد/كمية محدودة)
- **صفحة تصنيف احترافية**: فلاتر جانبية (نطاق سعري بمقبضين، سواتش ألوان، تشيبس مقاسات/ماركات)، شريط فرز وتبديل عرض شبكي/قائمة
- **صفحة منتج متكاملة**: معرض صور بتكبير (Zoom) وصور مصغرة، دليل مقاسات كنافذة منبثقة، تبويبات (وصف/شحن/تقييمات)، شريط "أضف للسلة" ثابت يظهر في الجوال عند التمرير
- **أقسام تسويقية**: عرض منتج بارز (Spotlight)، أطقم منتجات (Bundles)، شبكة ماركات/تصنيفات بصور كبيرة، معرض انستقرام، "شاهدته مؤخراً"
- هوية بصرية نيفي/ذهبي كاملة، خطوط Tajawal/Almarai، كل الألوان والخطوط قابلة للتعديل من إعدادات الثيم بدون كود

## 1. المتطلبات قبل البدء
1. حساب [Salla Partners Portal](https://salla.partners).
2. حساب GitHub لمزامنة كود الثيم.
3. [Node.js](https://nodejs.org) (LTS) + تثبيت Salla CLI:
   ```bash
   npm install -g @salla.sa/cli
   salla login
   ```

## 2. المعاينة المحلية
```bash
npm install
salla theme preview
```

## 3. الرفع والنشر
1. ارفع محتوى هذا المجلد إلى مستودع GitHub خاص بك.
2. من لوحة الشركاء: My Themes → Create New Theme → اربط المستودع.
3. بعد الاختبار: My Themes → اختر الثيم → Submit for Review لإرساله لمراجعة فريق سلة (سواء للنشر العام في متجر الثيمات أو للاستخدام الخاص فقط بمتجرك).

## 4. مهم جداً — ربط بيانات المتجر الحقيقية
كل المكونات مبنية بمتغيرات عامة (`product`, `home.banners`, `category.products`...) لتكون مرنة وقابلة لإعادة الاستخدام. **قبل النشر تحتاج تربطها بمتغيرات Twilight الفعلية** التي توفرها سلة لكل صفحة (متوفرة في وثائق [docs.salla.dev](https://docs.salla.dev) الخاصة بكل صفحة: الرئيسية، المنتج، التصنيف، السلة) — لأن أسماء المتغيرات الحقيقية للمنتجات/العروض/السلة تُحدَّد من Twilight نفسه وقد تختلف قليلاً حسب إصدار المنصة.

وظائف البحث والمفضلة والسلة تعتمد على مكونات Salla/Twilight الرسمية عند توفرها، بينما "شاهدته مؤخراً" يحفظ معرفات المنتجات محلياً في جلسة المتصفح، ولا يستبدل بيانات المنتجات الرسمية من سلة.

## هيكل الملفات
```
twilight.json
src/views/layouts/master.twig      → القالب المشترك (هوكس + CSS/JS متغيرات)
src/views/pages/
  index.twig                       → الرئيسية
  category.twig                    → صفحة التصنيف
  product.twig                     → صفحة المنتج
src/views/components/
  header/   → header, announcement-bar, main-header, mega-menu, trust-badges, mobile-bottom-nav
  footer/   → footer, newsletter, main-footer
  home/     → hero-banner, section-divider, best-seller-spotlight, bundle-section,
              icon-categories, brand-showcase, instagram-gallery, recently-viewed
  product/  → product-card, quick-view-modal, image-gallery, sticky-add-to-cart, size-guide-modal
  category/ → filters-sidebar, toolbar
  cart/     → cart-drawer
  shared/   → rating-stars, wishlist-button
src/assets/styles/style.css        → المتغيرات + عناصر الصفحة الرئيسية الأصلية
src/assets/styles/components.css   → تنسيق كل المكونات المتقدمة الجديدة
src/assets/js/app.js               → سلايدر الهيرو، بوب أب، عداد تنازلي
src/assets/js/components.js        → مينيو، سلة منزلقة، معاينة سريعة، فلاتر، معرض صور، تبويبات...
src/locales/ar.json, en.json
```


## V10 Presets
V10 preserves V9.3 and adds six optional visual presets: Sports, Fashion, Gifts, Electronics, Beauty, Kids. General is the default when none is enabled. If multiple presets are enabled, priority is Sports → Fashion → Gifts → Electronics → Beauty → Kids.
