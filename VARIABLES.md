# خريطة المتغيّرات الحقيقية — ثيم همسة نبض

هذا الملف يوثّق **المتغيّرات الفعلية** التي تمرّرها منصة سلة (Twilight) لكل صفحة،
كما هي في المستودع الرسمي [SallaApp/theme-raed](https://github.com/SallaApp/theme-raed).
كل ملف `.twig` في الثيم يبدأ الآن بجدول المتغيّرات الخاص به في تعليق أعلى الملف.

---

## ⚠️ ثلاث حقائق معمارية غيّرت تصميم الثيم

### 1) الصفحة الرئيسية لا تُبنى من متغيّرات، بل من عناصر يرتّبها التاجر
`pages/index.twig` يحتوي سطراً واحداً: `{% component home %}`.
لا يوجد شيء اسمه `home.banners` أو `home.best_sellers`.

**الحل المطبّق:** سجّلنا مكوّناتنا المخصّصة في قسم `components` داخل `twilight.json`
مع حقول (`fields`) قابلة للتعبئة من لوحة التحكم. يقرأ المكوّن بياناته من `component.*`:

```twig
{% for slide in component.slides %}
    <img src="{{ slide.image }}">
{% endfor %}
```

بهذا يظهر "بانر همسة نبض" و"تصنيفات بأيقونات" للتاجر كعناصر يضيفها ويرتّبها بنفسه.

### 2) صفحة التصنيف لا تعطيك مصفوفة منتجات
لا يوجد `category.products` للمرور عليه. المنتجات تُجلب عبر مكوّن الويب
`<salla-products-list>` (تحميل تدريجي + فلترة حيّة)، والفلاتر عبر `<salla-filters>`.

**الحل المطبّق:** استخدمنا المكوّنَين الرسميَّين وتحكّمنا في شكلهما عبر CSS
بدل بناء شبكة وفلاتر يدوية (التي كانت ستبقى فارغة على متجر حقيقي).

### 3) خطوات الدفع مستضافة من سلة
الثيم يتحكّم في **صفحة السلة** فقط. `salla.cart.submit()` ينقل العميل
إلى صفحة الدفع الآمنة الخاصة بسلة، وهي غير قابلة للتخصيص من الثيم.

---

## متغيّرات مشتركة (كل الصفحات)
| المتغيّر | النوع | ملاحظات |
|---|---|---|
| `store.name` `.logo` `.url` `.description` | Store | |
| `store.social` | object | instagram, snapchat, twitter, youtube, facebook, maroof |
| `store.contacts` | object | mobile, phone, email, whatsapp, telegram |
| `store.settings.tax.number` | ?string | |
| `store.settings.cart.apply_coupon_enabled` | bool | |
| `theme.is_rtl` | bool | استخدمه لتحديد `dir` |
| `theme.settings.get('key', default)` | mixed | قيم قسم `settings` في twilight.json |
| `language.code` | string | لخاصية `lang` |
| `cart.items_count` / `cart.total` | int / string | `cart.total` **منسّق مسبقاً** |

## صفحة المنتج — `pages/product/single.twig`
| المتغيّر | ملاحظات |
|---|---|
| `product.id` `.name` `.description` `.subtitle` `.promotion_title` | `description` تحتوي HTML → استخدم `\|raw` |
| `product.image.url` / `product.images[].url` | الصورة كائن وليست نصاً |
| `product.rating.stars` / `.count` | |
| `product.price` `.sale_price` `.regular_price` | مرّرها عبر `\|money` |
| `product.is_on_sale` `.is_available` `.is_out_of_stock` `.is_in_wishlist` | |
| `product.discount_percentage` | نص جاهز ex: `"20%"` |
| `product.has_options` / `product.options` | الخيارات عبر `pages.partials.product.options` |
| `product.has_size_guide` | استخدم `<salla-size-guide>` |
| `product.max_quantity` `.can_show_remained_quantity` | |
| `product.add_to_cart_label` | نص الزر يحدّده التاجر |

## صفحة التصنيف — `pages/product/index.twig`
| المتغيّر | ملاحظات |
|---|---|
| `page.title` (HTML) `page.slug` `page.id` | تُمرَّر لـ `<salla-products-list>` |
| `category.name` `.url` `.sub_categories` | |
| `filters` | bool — هل الفلاتر مفعّلة |
| `sort_options[].id/.name/.is_selected` | ourSuggest, bestSell, topRated, priceFromTopToLow, priceFromLowToTop |

## صفحة السلة — `pages/cart.twig`
| المتغيّر | ملاحظات |
|---|---|
| `cart.sub_total` `.discount` `.total` `.tax_amount` | **ليس** `cart.real_discount` |
| `cart.coupon` | كود الخصم المطبّق |
| `cart.free_shipping_bar.percent` / `.remaining` / `.has_free_shipping` | `percent` من 0 إلى 100 |
| `cart.items[].id` | معرّف **عنصر السلة** وليس المنتج |
| `cart.items[].product_id` `.product_name` `.product_image` `.url` | |
| `cart.items[].quantity` `.price` `.total` | |
| `cart.items[].can_add_note` `.notes` `.can_upload_file` `.is_available` | |
| `cart.items[].offer.names` `.offer.discount` | |

---

## مكوّنات الويب الرسمية المستخدمة (بدل بنائها يدوياً)
| المكوّن | يحل محل |
|---|---|
| `<salla-search inline-search>` | البحث الفوري المخصّص |
| `<salla-menu source="header\|footer">` | قوائم التصنيفات والروابط |
| `<salla-cart-summary>` | عدّاد السلة + السلة المنزلقة |
| `<salla-wishlist-counter>` | عدّاد المفضلة |
| `<salla-user-menu>` | قائمة الحساب |
| `<salla-slider type="thumbs">` | معرض صور المنتج + التكبير + المصغّرات |
| `<salla-products-list>` | شبكة منتجات التصنيف |
| `<salla-filters>` | فلاتر السعر/اللون/المقاس |
| `<salla-add-product-button>` | زر الإضافة للسلة (يشمل حالة نفاد الكمية والتنبيه) |
| `<salla-quantity-input>` | محدّد الكمية |
| `<salla-rating-stars>` | نجوم التقييم |
| `<salla-size-guide>` | دليل المقاسات |
| `<salla-coupon>` | تطبيق كود الخصم |
| `<salla-breadcrumb>` | مسار التنقل |

استخدام هذه المكوّنات ليس تنازلاً عن التميّز — فهي تضمن عمل الثيم مع بيانات المتجر
الحقيقية والتحديثات المستقبلية للمنصة، ومطلوبة في المراجعة الفنية لسلة.
**التميّز البصري يتحقّق عبر CSS** (الهوية، التخطيط، الحركة) وعبر مكوّناتنا المخصّصة
في الصفحة الرئيسية.

---

## الخطوة التالية قبل النشر
1. `salla theme preview` واربطه بمتجر تجريبي فيه منتجات حقيقية.
2. تحقّق من مفاتيح الترجمة المستخدمة (`trans('pages.cart.total')` وغيرها) مقابل
   ملفات اللغة في theme-raed، وأضف أي مفتاح ناقص إلى `src/locales/ar.json`.
3. صمّم أنماط `<salla-products-list>` و`<salla-filters>` عبر CSS variables
   المذكورة في وثائق سلة لتطابق هوية نيفي/ذهبي.
