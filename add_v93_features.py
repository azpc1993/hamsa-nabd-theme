import json, uuid, os, re
root='/mnt/data/v93_work'
tw=os.path.join(root,'twilight.json')
d=json.load(open(tw,encoding='utf-8'))
d['version']='9.3.0'
d['description']['ar']=d['description']['ar'].replace('9.2','9.3').replace('تجربة شراء متقدمة','تجارة ذكية وتجربة شراء متقدمة')
d['description']['en']=d['description']['en'].replace('9.2','9.3').replace('advanced shopping experience','smart commerce and an advanced shopping experience')
# helpers

def comp(path): return next(c for c in d['components'] if c['path']==path)
def field(id,label,typ='string',fmt='text',**kw):
    x={'id':id,'type':typ,'format':fmt,'label':label,'value':None,'required':False}
    x.update(kw); return x

def set_title(c,ar,en): c['title']={'ar':ar,'en':en}

# Gift Finder 2.0: add budget and richer result metadata
c=comp('home.gift-finder'); set_title(c,'مساعد اختيار الهدية 2.0','Gift Finder 2.0')
# replace fields while preserving existing schemas mostly
for f in c['fields']:
    if f['id']=='recipients':
        f['label']='من تريد أن تهدي؟'
    elif f['id']=='occasions':
        f['label']='ما المناسبة؟'
    elif f['id']=='results':
        # enrich result item fields
        ids={z['id']:z for z in f['fields']}
        f['fields'] += [field('results.budget','نطاق الميزانية'), field('results.reason','سبب الترشيح',multilanguage=True,maxLength=120)]
budget=field('budgets','الميزانية', 'collection','collection', minLength=1,maxLength=8,item_label='نطاق',value=[],fields=[
    field('budgets.label','النطاق',multilanguage=True,maxLength=60),
    field('budgets.value','المعرف',maxLength=60),
    field('budgets.icon','الأيقونة','string','image',maxLength=500)
])
if not any(f['id']=='budgets' for f in c['fields']): c['fields'].insert(3,budget)

# Smart Box 2.0 replaces the simple presentation with a configurable builder
c=comp('home.build-a-box'); set_title(c,'Smart Box 2.0 — كوّن صندوقك','Smart Box 2.0')
# preserve title/subtitle/image and replace steps with options
new=[]
for f in c['fields']:
    if f['id'] not in ('steps','url','button_text'): new.append(f)
new += [
 field('box_options','خيارات الصندوق','collection','collection',minLength=1,maxLength=8,item_label='صندوق',value=[],fields=[
   field('box_options.name','اسم الصندوق',multilanguage=True,maxLength=80), field('box_options.price','السعر',multilanguage=True,maxLength=40), field('box_options.image','الصورة','string','image',maxLength=500), field('box_options.value','المعرف',maxLength=60)
 ]),
 field('item_options','محتويات الصندوق','collection','collection',minLength=1,maxLength=20,item_label='منتج',value=[],fields=[
   field('item_options.name','اسم المنتج',multilanguage=True,maxLength=100), field('item_options.price','السعر',multilanguage=True,maxLength=40), field('item_options.image','الصورة','string','image',maxLength=500), field('item_options.value','المعرف',maxLength=60)
 ]),
 field('extra_options','الإضافات','collection','collection',minLength=0,maxLength=8,item_label='إضافة',value=[],fields=[
   field('extra_options.name','اسم الإضافة',multilanguage=True,maxLength=80), field('extra_options.price','السعر',multilanguage=True,maxLength=40), field('extra_options.value','المعرف',maxLength=60)
 ]),
 field('url','رابط إكمال الطلب',maxLength=500), field('button_text','نص الزر',multilanguage=True,maxLength=40)
]
c['fields']=new

# Smart Campaign upgrades existing countdown
c=comp('home.campaign-countdown'); set_title(c,'Smart Campaign — الحملة الذكية','Smart Campaign')
# add fields before ends_at
existing={f['id'] for f in c['fields']}
extras=[field('badge','شارة الحملة',multilanguage=True,maxLength=50),field('code','كود الخصم',maxLength=60),field('message','رسالة الحملة',multilanguage=True,maxLength=180),field('background','صورة الخلفية','string','image',maxLength=500),field('urgency','إظهار التنبيه العاجل','boolean','switch',value=True,selected=True,icon='sicon-toggle-off')]
c['fields']=[f for f in c['fields'] if f['id'] not in ('url','button_text')] + extras + [field('url','رابط الحملة',maxLength=500),field('button_text','نص الزر',multilanguage=True,maxLength=40)]

# Recommendations 2.0: segments/reason
c=comp('home.smart-recommendations'); set_title(c,'Recommendations 2.0 — توصيات ذكية','Recommendations 2.0')
if not any(f['id']=='tabs' for f in c['fields']):
    c['fields'].insert(1, field('tabs','فئات التوصيات','collection','collection',minLength=1,maxLength=6,item_label='فئة',value=[],fields=[field('tabs.value','المعرف',maxLength=40),field('tabs.label','اسم الفئة',multilanguage=True,maxLength=60)]))
for f in c['fields']:
    if f['id']=='items':
        if not any(z['id']=='items.segment' for z in f['fields']):
            f['fields'] += [field('items.segment','فئة التوصية',maxLength=40),field('items.reason','سبب الترشيح',multilanguage=True,maxLength=100)]

# New Smart Bundle component
bundle={
 'key':str(uuid.uuid4()), 'title':{'ar':'Smart Bundle — البكجات الذكية','en':'Smart Bundle'}, 'icon':'sicon-products','path':'home.smart-bundle',
 'fields':[
   field('title','العنوان',multilanguage=True,maxLength=100),field('subtitle','الوصف',multilanguage=True,maxLength=180),
   field('items','البكجات','collection','collection',minLength=1,maxLength=10,item_label='بكج',value=[],fields=[
      field('items.name','اسم البكج',multilanguage=True,maxLength=100),field('items.image','الصورة','string','image',maxLength=500),field('items.price','السعر',multilanguage=True,maxLength=40),field('items.discount','الخصم',multilanguage=True,maxLength=40),field('items.products','محتويات البكج',multilanguage=True,maxLength=180),field('items.url','الرابط',maxLength=500)
   ])
 ]}
if not any(x['path']==bundle['path'] for x in d['components']): d['components'].append(bundle)

# 5 V9.3 controls (one per named feature, recommendations included)
settings=[
 ('hn_enable_v93_gift_finder','تفعيل Gift Finder 2.0','تشغيل مساعد اختيار الهدية المطوّر.'),
 ('hn_enable_v93_smart_box','تفعيل Smart Box 2.0','تشغيل منشئ صندوق الهدايا التفاعلي.'),
 ('hn_enable_v93_smart_bundle','تفعيل Smart Bundle','تشغيل عروض البكجات الذكية.'),
 ('hn_enable_v93_smart_campaign','تفعيل Smart Campaign','تشغيل الحملة الذكية والعد التنازلي.'),
 ('hn_enable_v93_recommendations','تفعيل Recommendations 2.0','تشغيل توصيات المنتجات القابلة للتقسيم.')]
for sid,label,desc in settings:
    if not any(s.get('id')==sid for s in d['settings']):
        d['settings'].append({'id':sid,'type':'boolean','format':'switch','label':label,'description':desc,'icon':'sicon-toggle-off','required':False,'value':True,'selected':True})
json.dump(d,open(tw,'w',encoding='utf-8'),ensure_ascii=False,indent=2)

# Templates
open(os.path.join(root,'src/views/components/home/gift-finder.twig'),'w',encoding='utf-8').write(r'''{% if component.recipients|length and component.occasions|length %}
<section component-id="{{ componentId }}" class="s-block hn-gift-finder hn-gift-finder--v2" data-hn-gift-finder-v2 data-results='{{ component.results|default([])|json_encode }}'>
  <div class="hn-gift-finder__head"><span class="hn-badge hn-badge--gold">Gift Finder 2.0</span><h2>{{ component.title|default(trans('hn.v93.gift_finder_title')) }}</h2>{% if component.subtitle %}<p>{{ component.subtitle }}</p>{% endif %}</div>
  <div class="hn-gift-finder__body">
    <div class="hn-gift-finder__step is-active" data-hn-gf2-step="0"><span class="hn-gift-finder__step-label">{{ trans('hn.v93.gift_step_recipient') }}</span><div class="hn-gift-finder__options">{% for r in component.recipients %}<button type="button" class="hn-gift-finder__option" data-hn-gf2-recipient="{{ r.label }}">{% if r.icon %}<img src="{{ r.icon }}" alt="">{% endif %}<span>{{ r.label }}</span></button>{% endfor %}</div></div>
    <div class="hn-gift-finder__step" data-hn-gf2-step="1"><span class="hn-gift-finder__step-label">{{ trans('hn.v93.gift_step_occasion') }}</span><div class="hn-gift-finder__options">{% for o in component.occasions %}<button type="button" class="hn-gift-finder__option" data-hn-gf2-occasion="{{ o.label }}">{% if o.icon %}<img src="{{ o.icon }}" alt="">{% endif %}<span>{{ o.label }}</span></button>{% endfor %}</div><button type="button" class="hn-gift-finder__back" data-hn-gf2-back>{{ trans('hn.gift_finder.back') }}</button></div>
    <div class="hn-gift-finder__step" data-hn-gf2-step="2"><span class="hn-gift-finder__step-label">{{ trans('hn.v93.gift_step_budget') }}</span><div class="hn-gift-finder__options">{% for b in component.budgets %}<button type="button" class="hn-gift-finder__option" data-hn-gf2-budget="{{ b.value|default(b.label) }}">{% if b.icon %}<img src="{{ b.icon }}" alt="">{% endif %}<span>{{ b.label }}</span></button>{% endfor %}</div><button type="button" class="hn-gift-finder__back" data-hn-gf2-back>{{ trans('hn.gift_finder.back') }}</button></div>
    <div class="hn-gift-finder__result" data-hn-gf2-result hidden><span class="hn-badge hn-badge--gold">{{ trans('hn.v93.gift_match') }}</span><img data-hn-gf2-img src="" alt=""><h3 data-hn-gf2-title></h3><p data-hn-gf2-reason></p><a class="hn-btn hn-btn--navy" data-hn-gf2-link href="#">{{ trans('hn.gift_finder.shop_now') }}</a><button type="button" class="hn-gift-finder__restart" data-hn-gf2-restart>{{ trans('hn.gift_finder.try_again') }}</button></div>
  </div>
</section>{% endif %}''')

open(os.path.join(root,'src/views/components/home/build-a-box.twig'),'w',encoding='utf-8').write(r'''{% if component.box_options|length and component.item_options|length %}
<section component-id="{{ componentId }}" class="s-block hn-smart-box" data-hn-smart-box>
 <div class="hn-smart-box__head"><span class="hn-badge hn-badge--gold">Smart Box 2.0</span><h2>{{ component.title|default(trans('hn.v93.box_title')) }}</h2>{% if component.subtitle %}<p>{{ component.subtitle }}</p>{% endif %}</div>
 <div class="hn-smart-box__layout"><div><h3>{{ trans('hn.v93.choose_box') }}</h3><div class="hn-smart-box__grid">{% for x in component.box_options %}<label class="hn-smart-box__choice"><input type="radio" name="hnbox-{{ componentId }}" value="{{ x.value|default(loop.index) }}" data-price-label="{{ x.price }}"><span>{% if x.image %}<img src="{{ x.image }}" alt="">{% endif %}<strong>{{ x.name }}</strong><small>{{ x.price }}</small></span></label>{% endfor %}</div></div>
 <div><h3>{{ trans('hn.v93.choose_items') }}</h3><div class="hn-smart-box__grid">{% for x in component.item_options %}<label class="hn-smart-box__choice"><input type="checkbox" value="{{ x.value|default(loop.index) }}" data-price-label="{{ x.price }}"><span>{% if x.image %}<img src="{{ x.image }}" alt="">{% endif %}<strong>{{ x.name }}</strong><small>{{ x.price }}</small></span></label>{% endfor %}</div></div>
 {% if component.extra_options|length %}<div><h3>{{ trans('hn.v93.choose_extras') }}</h3><div class="hn-smart-box__extras">{% for x in component.extra_options %}<label><input type="checkbox" value="{{ x.value|default(loop.index) }}"><span>{{ x.name }}</span><small>{{ x.price }}</small></label>{% endfor %}</div></div>{% endif %}
 </div><div class="hn-smart-box__summary"><strong>{{ trans('hn.v93.box_summary') }}</strong><span data-hn-smart-box-count>0</span><span data-hn-smart-box-note>{{ trans('hn.v93.box_select_hint') }}</span>{% if component.url %}<a href="{{ component.url }}" class="hn-btn hn-btn--navy">{{ component.button_text|default(trans('hn.v93.complete_box')) }}</a>{% endif %}</div>
</section>{% endif %}''')

open(os.path.join(root,'src/views/components/home/campaign-countdown.twig'),'w',encoding='utf-8').write(r'''<section component-id="{{ componentId }}" class="s-block hn-campaign hn-smart-campaign" data-hn-countdown="{{ component.ends_at }}"{% if component.background %} style="--hn-campaign-bg:url('{{ component.background }}')"{% endif %}><div class="hn-campaign__content"><span class="hn-badge hn-badge--gold">{{ component.badge|default('Smart Campaign') }}</span><h2>{{ component.title }}</h2>{% if component.message or component.subtitle %}<p>{{ component.message|default(component.subtitle) }}</p>{% endif %}{% if component.code %}<div class="hn-smart-campaign__code">{{ trans('hn.v93.campaign_code') }} <strong>{{ component.code }}</strong></div>{% endif %}<div class="hn-campaign__timer"><span><b data-unit="days">00</b><small>{{ trans('hn.features.days') }}</small></span><span><b data-unit="hours">00</b><small>{{ trans('hn.features.hours') }}</small></span><span><b data-unit="minutes">00</b><small>{{ trans('hn.features.minutes') }}</small></span><span><b data-unit="seconds">00</b><small>{{ trans('hn.features.seconds') }}</small></span></div>{% if component.url %}<a href="{{ component.url }}" class="hn-btn hn-btn--gold">{{ component.button_text|default(trans('hn.features.shop_campaign')) }}</a>{% endif %}</div></section>''')

open(os.path.join(root,'src/views/components/home/smart-recommendations.twig'),'w',encoding='utf-8').write(r'''{% set items = component.items|default([]) %}{% if items|length %}<section component-id="{{ componentId }}" class="s-block hn-recommendations hn-recommendations--v2" data-hn-recommendations>{% if component.title %}<div class="s-block__title"><h2>{{ component.title }}</h2></div>{% endif %}{% if component.tabs|length %}<div class="hn-rec-tabs" role="tablist">{% for tab in component.tabs %}<button type="button" class="hn-rec-tab{% if loop.first %} is-active{% endif %}" data-hn-rec-tab="{{ tab.value }}">{{ tab.label }}</button>{% endfor %}</div>{% endif %}<div class="hn-recommendations__grid">{% for item in items %}<article class="hn-rec" data-hn-rec-item="{{ item.segment|default('all') }}"><a href="{{ item.url|default('#') }}"><img src="{{ item.image }}" alt="{{ item.name }}" loading="lazy"><div><small>{{ item.reason }}</small><h3>{{ item.name }}</h3><span>{{ item.price }}</span></div></a></article>{% endfor %}</div></section>{% endif %}''')

open(os.path.join(root,'src/views/components/home/smart-bundle.twig'),'w',encoding='utf-8').write(r'''{% if component.items|length %}<section component-id="{{ componentId }}" class="s-block hn-smart-bundle"><div class="s-block__title"><h2>{{ component.title|default(trans('hn.v93.bundle_title')) }}</h2>{% if component.subtitle %}<p>{{ component.subtitle }}</p>{% endif %}</div><div class="hn-smart-bundle__grid">{% for b in component.items %}<article class="hn-smart-bundle__card"><img src="{{ b.image }}" alt="{{ b.name }}" loading="lazy"><div class="hn-smart-bundle__body"><span class="hn-badge hn-badge--gold">{{ b.discount }}</span><h3>{{ b.name }}</h3><p>{{ b.products }}</p><strong>{{ b.price }}</strong>{% if b.url %}<a href="{{ b.url }}" class="hn-btn hn-btn--navy">{{ trans('hn.v93.view_bundle') }}</a>{% endif %}</div></article>{% endfor %}</div></section>{% endif %}''')
