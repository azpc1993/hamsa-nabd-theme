# ثيم همسة نبض 9.3.0 — Salla Twilight

ثيم **همسة نبض** هو ثيم تجاري لمنصة سلة مبني على Twilight، مع 30 مكوّنًا مخصصًا، إعدادات عامة، تجربة متجاوبة للجوال والكمبيوتر، ومجموعة إعداد موجّهة تساعد التاجر على فهم كل مكوّن وتعبئته من خلال أمثلة جاهزة.

## الإصدار الحالي

**9.3.0 — Guided Merchant Setup**

### أهم ما يتضمنه الإصدار

- 30 مكوّنًا مخصصًا للصفحة الرئيسية.
- إعدادات عامة للهوية والألوان والخطوط والمزايا.
- أمثلة عربية جاهزة داخل حقول المكونات.
- Collections تحتوي على بيانات مثال قابلة للتعديل.
- إرشادات عملية لمقاسات الصور.
- معاينة/إرشاد لكل مكوّن عبر بيانات `twilight.json`.
- صور مثال أصلية داخل `src/assets/images/`.
- تكاملات Twilight الأساسية في القوالب.
- صفحات رئيسية للمتجر، التصنيف، المنتج، السلة، الحساب، الولاء، المدونة، العلامات التجارية وغيرها.
- ملفات JavaScript وCSS المصدرية مع نسخة `public/` الجاهزة للنشر.
- دليل إعداد ودليل استخدام وتقارير QA.

## بنية المستودع

```text
.
├── twilight.json
├── package.json
├── README.md
├── UPLOAD-GUIDE.md
├── VARIABLES.md
├── V9.3-USER-GUIDE.md
├── V9.3-GUIDED-SETUP.md
├── V9.3-QA.md
├── V9.3-CHANGELOG.md
├── scripts/
│   └── build.js
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── js/
│   │   └── styles/
│   ├── locales/
│   └── views/
└── public/
    ├── images/
    ├── *.js
    └── *.css
```

## أهم ملف في الثيم

`twilight.json` موجود مباشرة في جذر المستودع، ويحتوي على معلومات الثيم والإعدادات والمزايا والمكونات المخصصة. هذا هو المكان الذي تعتمد عليه Salla Partners Portal لمزامنة إعدادات الثيم. 

## تشغيل البناء

بعد تعديل أي ملف داخل `src/assets/` شغّل:

```bash
npm run production
```

وسيتم تحديث ملفات `public/` من ملفات المصدر.

## المعاينة

إذا كانت Salla CLI مثبتة لديك:

```bash
salla login
salla theme preview
```

## GitHub + Salla

ارفع محتويات هذا المستودع كما هي إلى **جذر مستودع GitHub** المرتبط بحساب Salla Partners.

يجب أن يكون `twilight.json` بهذا الشكل:

```text
GitHub Repository/
├── twilight.json
├── package.json
├── src/
├── public/
└── scripts/
```

لا تضع ملفات الثيم داخل مجلد فرعي إضافي.

## بيانات الربط الحالية

- Theme name: `همسة نبض`
- Version: `9.3.0`
- Repository: `https://github.com/azpc1993/hamsa-nabd-theme`
- Support URL: `https://hamsa-nabd.com`
- Author email: `znonstor@gmail.com`

> إذا كنت ستستخدم مستودع GitHub مختلفًا، عدّل `repo_url` داخل `twilight.json` قبل المزامنة.

## المراجع والملفات المساعدة

- `UPLOAD-GUIDE.md` — خطوات الرفع والنشر.
- `V9.3-GUIDED-SETUP.md` — نظام الإعداد الموجّه.
- `V9.3-USER-GUIDE.md` — دليل استخدام التاجر.
- `V9.3-QA.md` — تقرير فحص الإصدار.
- `V9.3-CHANGELOG.md` — سجل تغييرات الإصدار.
- `VARIABLES.md` — مرجع المتغيرات المستخدمة في الثيم.

## ملاحظة مهمة قبل إعادة النشر

بعد ربط المستودع في Salla Partners Portal، راجع **Theme Preview** وتأكد بصريًا من ظهور صور المعاينة داخل إعدادات المكونات. الصور المحلية الموجودة في `src/assets/images/` تم تجهيزها ضمن الثيم، لكن التحقق النهائي من طريقة عرضها داخل بوابة الشركاء يجب أن يتم من داخل Salla نفسها.
