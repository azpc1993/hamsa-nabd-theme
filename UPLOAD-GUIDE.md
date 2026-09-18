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
