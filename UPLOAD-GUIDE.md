# دليل الرفع إلى GitHub وربطه بسلة

## ⚠️ قبل الرفع — عدّل سطرين في `twilight.json`
افتح `twilight.json` وغيّر:

```json
"repository": "https://github.com/USERNAME/hamsa-nabd-theme",
"author_email": "you@example.com",
```

ضع اسم حسابك في GitHub وبريدك الحقيقي. **بريد خاطئ أو رابط مستودع غير موجود
من أسباب فشل التحقق عند الاستيراد.**

---

## 1. ترتيب الملفات (مهم جداً)
عند فك الضغط ستجد مجلد `hamsa-nabd-theme`. المطلوب أن تكون **محتوياته** في جذر
المستودع مباشرة، لا المجلد نفسه:

✅ صحيح:
```
مستودعك/
├── twilight.json      ← يجب أن يكون هنا بالضبط
├── package.json
├── .gitignore
├── README.md
└── src/
```

❌ خاطئ (سلة لن تتعرّف على الثيم):
```
مستودعك/
└── hamsa-nabd-theme/
    └── twilight.json
```

## 2. إنشاء المستودع
- GitHub → `+` → **New repository**
- الاسم: `hamsa-nabd-theme` — اختر **Private**
- **لا** تفعّل "Add a README file"

## 3. الرفع عبر Git
```bash
cd مسار/hamsa-nabd-theme
git init
git branch -M main
git add .
git commit -m "Initial theme upload"
git remote add origin https://github.com/USERNAME/hamsa-nabd-theme.git
git push -u origin main
```
> ستحتاج Personal Access Token بدل كلمة المرور:
> Settings → Developer settings → Personal access tokens (classic) → صلاحية `repo`

## 4. الربط مع سلة
salla.partners → **My Themes** → **Create New Theme** → اربط GitHub → اختر المستودع والفرع `main`.

---

## إذا ظهرت رسالة "فشلت عملية التحقق من صحة البيانات المدخلة"
راجع هذه النقاط بالترتيب:

| السبب | الفحص |
|---|---|
| `twilight.json` ليس في الجذر | افتح صفحة المستودع — هل ترى الملف مباشرة؟ |
| `repository` أو `author_email` غير صحيحين | حدّثهما بقيمك الحقيقية |
| اسم ميزة غير مدعوم في `features` | استخدم الأسماء الموجودة في الملف الحالي فقط |
| خطأ صياغة JSON | تحقق عبر [jsonlint.com](https://jsonlint.com) |
| الفرع غير صحيح | تأكد أنه `main` وليس `master` |
| المستودع خاص ولم تُمنح الصلاحية | امنح تطبيق سلة صلاحية الوصول للمستودعات الخاصة |

### ما تم إصلاحه في هذه النسخة
النسخة السابقة كانت تفشل في التحقق لثلاثة أسباب، صُحّحت كلها:
1. **أسماء ميزات مخترعة** في `features` (مثل `component-header`) — استُبدلت بالأسماء المعتمدة من الثيم الرسمي.
2. **`settings` بصيغة `settings-group` المتداخلة** — غير مدعومة؛ حُوّلت إلى مصفوفة مسطّحة بأنواع مثبتة (`boolean/switch`, `static/title`, `static/line`).
3. **حقول المجموعات بدون بادئة** — يجب أن يكون معرّف الحقل الفرعي `slides.image` وليس `image`.

كذلك أُزيلت إعدادات الألوان المخصّصة، واللون الأساسي صار يُقرأ من ميزة `color`
الرسمية (`theme.color.primary`) التي يتحكم بها التاجر من لوحة التحكم.

---

## فشل GitHub Action باسم "Twilight CDN" (Unexpected Error)

### السبب
عند ربط المستودع بلوحة الشركاء، تضيف سلة تلقائياً إجراء (GitHub Action) يرفع
محتوى مجلد **`public/`** إلى شبكة توزيع المحتوى (CDN) الخاصة بها — وهذا المجلد
هو ما تشير إليه القوالب فعلياً عبر مرشّح `|asset` (وليس `src/assets/` مباشرة).

النسخة السابقة من الثيم لم تحتوِ على مجلد `public/` إطلاقاً ولا على أي سكربت
بناء (`build`) حقيقي، فكان الإجراء يفشل مباشرة عند محاولة الرفع أو تنفيذ
سكربت غير موجود — وهذا سبب رسالة *"Unexpected error stopped the uploading
process"*.

### الإصلاح
- أُضيف `scripts/build.js`: سكربت Node بسيط بدون أي حزم خارجية (لا `npm install`
  يفشل بسببه) ينسخ ملفات `src/assets/styles` و`src/assets/js` إلى `public/`
  بنفس الأسماء التي تتوقعها القوالب.
- `package.json` الآن يحتوي أوامر `production` و`development` (بنفس تسمية
  ثيم رائد الرسمي) تُشغّل هذا السكربت، بحيث ينجح أي أمر بناء يحاول تنفيذه
  إجراء سلة تلقائياً.
- مجلد `public/` **مُضمَّن بالفعل ومملوء** بالملفات الجاهزة في هذه الحزمة —
  لست بحاجة لتشغيل شيء يدوياً لأول رفعة.

### قاعدة مهمة لأي تعديل مستقبلي
في كل مرة تُعدّل ملفاً داخل `src/assets/styles/` أو `src/assets/js/`، **شغّل
الأمر التالي قبل `git push`** لتحديث `public/` بالتغييرات:
```bash
npm run production
git add public/
git commit -m "Update built assets"
git push
```
لو نسيت هذه الخطوة، التعديل سيظهر في الكود المصدري لكن **لن ينعكس فعلياً على
المتجر** لأن `public/` (الذي يُرفع فعلياً) سيبقى بالنسخة القديمة.

### بعد الدفع
1. ادخل تبويب **Actions** في مستودعك على GitHub
2. تأكد أن "Twilight CDN" أصبح ✅ (وليس ❌)
3. لو ظهر فشل مختلف هذه المرة، افتح "View more details" وأرسل لي نص الخطأ الكامل

---

## سبب رفض الطلب الأول — وكل ما تم إصلاحه

سلة رفضت الطلب الأول لأربعة أسباب، هذا ملخص الإصلاح لكل واحد:

### 1) هوكس (Hooks) مطلوبة غير مضافة
أُضيفت جميعها بالضبط بنفس نمط `s-blocks-wrapper` المستخدم في ثيم رائد الرسمي:
- `product/single.twig`: `before_product_info`, `before_customer_reviews`, `before_product_recommendations`, `after_product_recommendations`
- `product/index.twig`: `before_products_group_with_filter`, `after_products_group_with_filter`, `after_testimonials` (مع إضافة مكوّن `home.testimonials` قبله فعلياً، وليس فقط الهوك فارغاً)
- ملف جديد بالكامل `page-single.twig` (لم يكن موجوداً إطلاقاً) بهوك `information_page.information_page`

### 2) لا يوجد رقم 2 في رسالة الرفض
رسالة سلة قفزت من 1 إلى 3 مباشرة — لا يوجد بند ناقص من جهتنا، هذا كل ما ورد فعلياً.

### 3) السجل التجاري/سجل العمل الحر غير ظاهر بالفوتر
أُضيف `<salla-trust-badges>` داخل الفوتر (بالضبط كما في ثيم رائد) — يعرض هذه البيانات تلقائياً من إعدادات المتجر **بدون أي خيار إخفاء** في إعدادات الثيم، تماماً كما اشترطت سلة.

### 4) سعر الثيم الخاص أقل من الحد الأدنى (150 بدل 1000 ريال)
**هذا ليس خطأ كود** — يُعدَّل من لوحة الشركاء مباشرة:
Partners Portal → ثيمك → قسم "سعر الثيم" → غيّر السعر إلى **1000 ريال أو أكثر** قبل إعادة الإرسال.

### 5) قوالب Twig مفقودة (تسبب أخطاء عرض)
- أُنشئ الملف الناقص فعلياً: `src/views/pages/partials/product/options.twig` (يستخدم `<salla-product-options>` ومحتوى دليل المقاسات والملاحظات/المرفقات، بنفس منطق ثيم رائد)
- المرجع الوهمي `product.similar-products` (لم يكن موجوداً أصلاً في نظام سلة) استُبدل بالمكوّن الرسمي المباشر `<salla-products-slider source="related">` كما في ثيم رائد تماماً — لا حاجة لملف مكوّن منفصل له

كذلك أجريت فحصاً شاملاً آلياً على كل الثيم للتأكد عدم وجود أي مرجع `{% component %}` أو `{% include %}` آخر لملف غير موجود، فلم يظهر أي شيء إضافي.

### قبل إعادة الإرسال
1. `npm run production` ثم `git add . && git commit -m "Fix rejection issues" && git push`
2. غيّر سعر الثيم في لوحة الشركاء إلى 1000 ريال فأكثر
3. افتح المتجر التجريبي وتصفّح صفحة منتج وصفحة تصنيف وصفحة معلومات ثابتة (مثل "من نحن") للتأكد أن كل شيء يعمل بدون أخطاء في الـ Console
4. أعد إرسال طلب النشر
