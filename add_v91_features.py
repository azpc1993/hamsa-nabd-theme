import json, os, textwrap
root='/mnt/data/hamsa91_work'
compdir=os.path.join(root,'src/views/components/home'); os.makedirs(compdir,exist_ok=True)

def comp(path, title_ar,title_en, icon, fields):
    return {'key': __import__('uuid').uuid4().__str__(), 'title':{'ar':title_ar,'en':title_en},'icon':icon,'path':path,'fields':fields}

def field(id,label,typ='string',fmt='text',**kw):
    d={'type':typ,'format':fmt,'id':id,'label':label,'value':kw.pop('value',None),'required':kw.pop('required',False)}
    d.update(kw); return d

def col(id,label,item_label,fields,minLength=1,maxLength=12):
    return {'id':id,'type':'collection','format':'collection','required':False,'minLength':minLength,'maxLength':maxLength,'label':label,'item_label':item_label,'value':[],'fields':fields}

D=json.load(open(os.path.join(root,'twilight.json')))
existing={c['path'] for c in D['components']}
new=[]
new.append(comp('home.product-reels','ريلز المنتجات','Product Reels','sicon-video',[
 col('items','مقاطع المنتجات','مقطع',[
  field('items.media','رابط الفيديو أو الصورة','string','text',required=True,maxLength=500,description='رابط مباشر لملف MP4 أو صورة'),
  field('items.poster','صورة الغلاف','string','image',maxLength=500),
  field('items.product_name','اسم المنتج','string','text',multilanguage=True,maxLength=100),
  field('items.caption','الوصف','string','text',multilanguage=True,maxLength=160),
  field('items.url','رابط المنتج','string','text',maxLength=500),
 ],maxLength=12)
]))
new.append(comp('home.buy-together','اشترِ معًا','Buy Together','sicon-shopping-bag',[
 field('title','العنوان','string','text',multilanguage=True,maxLength=100),
 field('subtitle','الوصف','string','text',multilanguage=True,maxLength=160),
 col('items','المنتجات','منتج',[
  field('items.image','صورة المنتج','string','image',required=True,maxLength=500),
  field('items.name','اسم المنتج','string','text',multilanguage=True,required=True,maxLength=100),
  field('items.price','السعر','string','text',maxLength=40),
  field('items.url','رابط المنتج','string','text',maxLength=500),
 ],maxLength=6),
 field('button_text','نص الزر','string','text',multilanguage=True,maxLength=40),
 field('button_url','رابط الزر','string','text',maxLength=500)
]))
new.append(comp('home.campaign-countdown','عداد الحملة','Campaign Countdown','sicon-timer',[
 field('title','العنوان','string','text',multilanguage=True,maxLength=100,required=True),
 field('subtitle','الوصف','string','text',multilanguage=True,maxLength=160),
 field('ends_at','تاريخ ووقت الانتهاء','string','text',required=True,maxLength=80,description='مثال: 2026-12-31T23:59:59+03:00'),
 field('url','رابط الحملة','string','text',maxLength=500),
 field('button_text','نص الزر','string','text',multilanguage=True,maxLength=40)
]))
new.append(comp('home.promo-popup','نافذة العرض','Promotion Popup','sicon-discount',[
 field('image','الصورة','string','image',maxLength=500),
 field('title','العنوان','string','text',multilanguage=True,maxLength=100),
 field('text','النص','string','textarea',multilanguage=True,maxLength=300),
 field('coupon','رمز الخصم','string','text',maxLength=50),
 field('button_text','نص الزر','string','text',multilanguage=True,maxLength=40),
 field('url','رابط الزر','string','text',maxLength=500),
 field('delay','التأخير بالثواني','number','number',value=4,minimum=0,maximum=60)
]))
new.append(comp('home.tiktok-gallery','معرض TikTok','TikTok Gallery','sicon-video',[
 field('title','العنوان','string','text',multilanguage=True,maxLength=100),
 col('items','المقاطع','مقطع',[
  field('items.thumbnail','الصورة المصغرة','string','image',required=True,maxLength=500),
  field('items.url','رابط TikTok','string','text',required=True,maxLength=500),
  field('items.title','العنوان','string','text',multilanguage=True,maxLength=100)
 ],maxLength=8)
]))
new.append(comp('home.faq','الأسئلة الشائعة','FAQ','sicon-help',[
 field('title','العنوان','string','text',multilanguage=True,maxLength=100),
 col('items','الأسئلة','سؤال',[
  field('items.question','السؤال','string','text',multilanguage=True,required=True,maxLength=180),
  field('items.answer','الإجابة','string','textarea',multilanguage=True,required=True,maxLength=600)
 ],maxLength=12)
]))
new.append(comp('home.animated-brands','ماركات متحركة','Animated Brands','sicon-tag',[
 field('title','العنوان','string','text',multilanguage=True,maxLength=100),
 col('items','الماركات','ماركة',[
  field('items.image','الشعار','string','image',required=True,maxLength=500),
  field('items.name','اسم الماركة','string','text',multilanguage=True,maxLength=80),
  field('items.url','الرابط','string','text',maxLength=500)
 ],maxLength=20)
]))
new.append(comp('home.whatsapp-order','اطلب عبر واتساب','WhatsApp Order','sicon-whatsapp',[
 field('title','العنوان','string','text',multilanguage=True,maxLength=100),
 field('text','النص','string','textarea',multilanguage=True,maxLength=240),
 field('phone','رقم واتساب','string','text',maxLength=30,description='مثال: 9665XXXXXXXX'),
 field('button_text','نص الزر','string','text',multilanguage=True,maxLength=40),
 field('message','رسالة الطلب الافتراضية','string','text',multilanguage=True,maxLength=240)
]))
for c in new:
    if c['path'] not in existing: D['components'].append(c)
# add popup global settings
settings=D['settings']
ids={s.get('id') for s in settings}
for s in [
 {'id':'hn_enable_promo_popup','type':'boolean','format':'switch','label':'تفعيل نافذة العرض الترويجية','description':'تظهر نافذة العرض عند فتح المتجر وفق إعداد المكوّن.','icon':'sicon-toggle-off','required':False,'value':False,'selected':False},
 {'id':'hn_enable_dark_mode','type':'boolean','format':'switch','label':'تفعيل الوضع الداكن','description':'يسمح للمتجر باستخدام الوضع الداكن.','icon':'sicon-moon','required':False,'value':False,'selected':False}
]:
 if s['id'] not in ids: settings.append(s)
json.dump(D,open(os.path.join(root,'twilight.json'),'w'),ensure_ascii=False,indent=2)

files={
'product-reels.twig':'''{% set items = component.items|default([]) %}\n{% if items|length %}<section component-id="{{ componentId }}" class="s-block hn-reels"><div class="s-block__title"><h2>{{ component.title|default(trans('hn.features.reels_title')) }}</h2></div><div class="hn-reels__track">{% for item in items %}<article class="hn-reel">{% if item.media ends with '.mp4' or item.media ends with '.webm' %}<video class="hn-reel__media" controls muted playsinline preload="metadata" poster="{{ item.poster }}"><source src="{{ item.media }}"></video>{% else %}<img class="hn-reel__media" src="{{ item.media }}" alt="{{ item.product_name }}" loading="lazy">{% endif %}<div class="hn-reel__body">{% if item.product_name %}<h3>{{ item.product_name }}</h3>{% endif %}{% if item.caption %}<p>{{ item.caption }}</p>{% endif %}{% if item.url %}<a href="{{ item.url }}" class="hn-btn hn-btn--gold">{{ trans('hn.features.shop_now') }}</a>{% endif %}</div></article>{% endfor %}</div></section>{% endif %}''',
'buy-together.twig':'''{% set items = component.items|default([]) %}\n{% if items|length %}<section component-id="{{ componentId }}" class="s-block hn-buy-together"><div class="s-block__title"><h2>{{ component.title|default(trans('hn.features.buy_together_title')) }}</h2>{% if component.subtitle %}<p>{{ component.subtitle }}</p>{% endif %}</div><div class="hn-buy-together__items">{% for item in items %}<a class="hn-bundle-item" href="{{ item.url|default('#') }}"><img src="{{ item.image }}" alt="{{ item.name }}" loading="lazy"><span>{{ item.name }}</span>{% if item.price %}<strong>{{ item.price }}</strong>{% endif %}</a>{% endfor %}</div>{% if component.button_url %}<a href="{{ component.button_url }}" class="hn-btn hn-btn--gold">{{ component.button_text|default(trans('hn.features.shop_bundle')) }}</a>{% endif %}</section>{% endif %}''',
'campaign-countdown.twig':'''<section component-id="{{ componentId }}" class="s-block hn-campaign" data-hn-countdown="{{ component.ends_at }}"><div class="hn-campaign__content"><h2>{{ component.title }}</h2>{% if component.subtitle %}<p>{{ component.subtitle }}</p>{% endif %}<div class="hn-campaign__timer"><span><b data-unit="days">00</b><small>{{ trans('hn.features.days') }}</small></span><span><b data-unit="hours">00</b><small>{{ trans('hn.features.hours') }}</small></span><span><b data-unit="minutes">00</b><small>{{ trans('hn.features.minutes') }}</small></span><span><b data-unit="seconds">00</b><small>{{ trans('hn.features.seconds') }}</small></span></div>{% if component.url %}<a href="{{ component.url }}" class="hn-btn hn-btn--gold">{{ component.button_text|default(trans('hn.features.shop_campaign')) }}</a>{% endif %}</div></section>''',
'promo-popup.twig':'''{% if component.title or component.image %}<section component-id="{{ componentId }}" class="hn-promo-popup" data-hn-promo-popup data-delay="{{ component.delay|default(4) }}" aria-hidden="true"><div class="hn-promo-popup__overlay" data-hn-promo-close></div><div class="hn-promo-popup__card" role="dialog" aria-modal="true"> <button class="hn-promo-popup__close" type="button" data-hn-promo-close aria-label="{{ trans('hn.features.close') }}">×</button>{% if component.image %}<img src="{{ component.image }}" alt="{{ component.title }}" loading="lazy">{% endif %}<div class="hn-promo-popup__body"><h2>{{ component.title }}</h2>{% if component.text %}<p>{{ component.text }}</p>{% endif %}{% if component.coupon %}<code>{{ component.coupon }}</code>{% endif %}{% if component.url %}<a href="{{ component.url }}" class="hn-btn hn-btn--gold">{{ component.button_text|default(trans('hn.features.shop_now')) }}</a>{% endif %}</div></div></section>{% endif %}''',
'tiktok-gallery.twig':'''{% set items = component.items|default([]) %}{% if items|length %}<section component-id="{{ componentId }}" class="s-block hn-tiktok"><div class="s-block__title"><h2>{{ component.title|default(trans('hn.features.tiktok_title')) }}</h2></div><div class="hn-tiktok__grid">{% for item in items %}<a href="{{ item.url }}" target="_blank" rel="noopener noreferrer" class="hn-tiktok__item"><img src="{{ item.thumbnail }}" alt="{{ item.title }}" loading="lazy"><span class="hn-tiktok__play">▶</span>{% if item.title %}<b>{{ item.title }}</b>{% endif %}</a>{% endfor %}</div></section>{% endif %}''',
'faq.twig':'''{% set items = component.items|default([]) %}{% if items|length %}<section component-id="{{ componentId }}" class="s-block hn-faq"><div class="s-block__title"><h2>{{ component.title|default(trans('hn.features.faq_title')) }}</h2></div><div class="hn-faq__list">{% for item in items %}<details class="hn-faq__item"><summary>{{ item.question }}</summary><div>{{ item.answer }}</div></details>{% endfor %}</div></section>{% endif %}''',
'animated-brands.twig':'''{% set items = component.items|default([]) %}{% if items|length %}<section component-id="{{ componentId }}" class="s-block hn-animated-brands"><div class="s-block__title"><h2>{{ component.title|default(trans('hn.features.brands_title')) }}</h2></div><div class="hn-animated-brands__track">{% for repeat in 1..2 %}{% for item in items %}<a href="{{ item.url|default('#') }}" class="hn-animated-brand" {{ repeat == 2 ? 'aria-hidden="true"' : '' }}><img src="{{ item.image }}" alt="{{ item.name }}" loading="lazy"><span>{{ item.name }}</span></a>{% endfor %}{% endfor %}</div></section>{% endif %}''',
'whatsapp-order.twig':'''<section component-id="{{ componentId }}" class="s-block hn-whatsapp-order"><div><h2>{{ component.title|default(trans('hn.features.whatsapp_title')) }}</h2>{% if component.text %}<p>{{ component.text }}</p>{% endif %}</div>{% set phone = component.phone|default(store.contacts.whatsapp) %}{% if phone %}<a class="hn-btn hn-btn--whatsapp" target="_blank" rel="noopener noreferrer" href="https://wa.me/{{ phone|replace({' ': '', '+': ''}) }}?text={{ (component.message|default(trans('hn.features.whatsapp_message')))|url_encode }}">{{ component.button_text|default(trans('hn.features.whatsapp_button')) }}</a>{% endif %}</section>'''
}
for fn,content in files.items(): open(os.path.join(compdir,fn),'w').write(content)

# add locale keys
for lang in ['ar','en']:
 p=os.path.join(root,'src/locales',lang+'.json'); d=json.load(open(p))
 ar={'shop_now':'تسوق الآن','buy_together_title':'اشترِ معًا','shop_bundle':'تسوق المجموعة','days':'يوم','hours':'ساعة','minutes':'دقيقة','seconds':'ثانية','shop_campaign':'تسوق العرض','close':'إغلاق','tiktok_title':'تابعنا على TikTok','faq_title':'الأسئلة الشائعة','brands_title':'ماركاتنا','whatsapp_title':'اطلب عبر واتساب','whatsapp_button':'اطلب الآن عبر واتساب','whatsapp_message':'مرحبًا، أرغب بالاستفسار عن منتجات المتجر.','reels_title':'ريلز المنتجات'}
 en={'shop_now':'Shop now','buy_together_title':'Buy together','shop_bundle':'Shop the bundle','days':'Days','hours':'Hours','minutes':'Minutes','seconds':'Seconds','shop_campaign':'Shop campaign','close':'Close','tiktok_title':'Follow us on TikTok','faq_title':'Frequently asked questions','brands_title':'Our brands','whatsapp_title':'Order via WhatsApp','whatsapp_button':'Order on WhatsApp','whatsapp_message':'Hello, I would like to ask about your products.','reels_title':'Product Reels'}
 # place under hn.features
 d.setdefault('hn',{}).setdefault('features',{}).update(ar if lang=='ar' else en)
 json.dump(d,open(p,'w'),ensure_ascii=False,indent=2)
