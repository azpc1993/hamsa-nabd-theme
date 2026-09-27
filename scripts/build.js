/**
 * بناء بسيط بدون أي حزم خارجية (لا يعتمد على webpack أو أي devDependency).
 * ملفاتنا CSS/JS مكتوبة يدوياً وبسيطة (بدون Sass أو استيراد وحدات)،
 * لذا لا حاجة فعلية لأداة تجميع — هذا السكربت فقط ينسخ src/assets
 * إلى public/ بنفس الأسماء التي تستخدمها القوالب عبر مرشّح |asset.
 *
 * مهم: نفّذ `npm run production` بعد أي تعديل على src/assets قبل الـ push،
 * حتى تنعكس التعديلات فعلياً على public/ (وهو ما يرفعه سلة إلى الـ CDN).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'assets');
const OUT = path.join(ROOT, 'public');

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

function copyFile(from, to) {
    ensureDir(path.dirname(to));
    fs.copyFileSync(from, to);
    console.log('  ✓', path.relative(ROOT, to));
}

console.log('Building theme assets into public/ ...');
ensureDir(OUT);

// CSS و JS المشتركة (نفس الاسم من src إلى public)
const sharedFiles = [
    ['styles/style.css', 'style.css'],
    ['styles/components.css', 'components.css'],
    ['js/app.js', 'app.js'],
    ['js/components.js', 'components.js'],
];
sharedFiles.forEach(([from, to]) => {
    const src = path.join(SRC, from);
    if (fs.existsSync(src)) copyFile(src, path.join(OUT, to));
});

// ملفات JavaScript الخاصة بالصفحات — يجب أن تكون موجودة في المصدر حتى لا ننشر placeholder صامتاً.
const pageEntries = ['home.js', 'category.js', 'product.js'];
pageEntries.forEach((name) => {
    const src = path.join(SRC, 'js', 'pages', name);
    const dest = path.join(OUT, name);
    if (!fs.existsSync(src)) {
        throw new Error(`Missing required page asset: ${src}`);
    }
    copyFile(src, dest);
});

// نسخ أي صور موجودة في src/assets/images إلى public/images
const imagesDir = path.join(SRC, 'images');
if (fs.existsSync(imagesDir)) {
    const outImages = path.join(OUT, 'images');
    ensureDir(outImages);
    fs.readdirSync(imagesDir).forEach((file) => {
        copyFile(path.join(imagesDir, file), path.join(outImages, file));
    });
}

console.log('Done.');
