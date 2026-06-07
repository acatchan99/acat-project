import { useState, useCallback, useEffect } from 'react';
import { cloneDefaultContent } from '../data/defaultContent';
import { api, setAdminToken } from '../lib/api';
import {
  newWork,
  newAlbum,
  newStreetCase,
  newPricingItem,
  newSocialLink,
  newExhibition,
  newMissionPillar,
  newProcessStep,
} from './templates';

const TABS = [
  { id: 'text', label: '文案' },
  { id: 'albums', label: '作品集分类' },
  { id: 'works', label: '作品条目' },
  { id: 'street', label: '街头案例' },
  { id: 'pricing', label: '报价' },
  { id: 'social', label: '社媒' },
  { id: 'contact', label: '扩列二维码' },
  { id: 'events', label: '展览' },
];

const STREET_LAYOUTS = ['hero', 'tall', 'wide', 'square'];

function PanelHead({ title, count, onAdd, addLabel = '+ 新增一项' }) {
  return (
    <div className="adm-panel-head">
      <div>
        <h2>{title}{count != null ? ` (${count})` : ''}</h2>
        <p className="adm-panel-tip">新增后会自动出现在网站对应模块，记得点右上角「保存全部」</p>
      </div>
      {onAdd && (
        <button type="button" className="adm-btn adm-btn--ghost" onClick={onAdd}>{addLabel}</button>
      )}
    </div>
  );
}

function RemoveBtn({ onClick, label = '删除此项' }) {
  return (
    <button type="button" className="adm-btn adm-btn--danger" onClick={onClick}>{label}</button>
  );
}

function Field({ label, children }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      {children}
    </label>
  );
}

function BilingualInput({ value, onChange, multiline = false }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="adm-bilingual">
      <Tag
        className="adm-input"
        value={value?.zh ?? ''}
        placeholder="中文"
        rows={multiline ? 3 : undefined}
        onChange={(e) => onChange({ ...value, zh: e.target.value })}
      />
      <Tag
        className="adm-input"
        value={value?.en ?? ''}
        placeholder="English"
        rows={multiline ? 3 : undefined}
        onChange={(e) => onChange({ ...value, en: e.target.value })}
      />
    </div>
  );
}

function ImageUpload({ value, folder, onChange }) {
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await api.upload(file, folder);
      onChange(url);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="adm-image">
      {value && <img src={value} alt="" className="adm-thumb" />}
      <input className="adm-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/path/image.jpg" />
      <label className="adm-upload-btn">
        {busy ? '上传中…' : '上传图片'}
        <input type="file" accept="image/*" hidden onChange={handleFile} />
      </label>
    </div>
  );
}

function TextPanel({ content, setContent }) {
  const patch = (lang, section, patchObj) => {
    setContent((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: {
          ...prev.translations[lang],
          [section]: { ...prev.translations[lang][section], ...patchObj },
        },
      },
    }));
  };

  /** 同一字段中英双语一次更新，避免连续 patch 互相覆盖 */
  const patchBilingual = (section, key, value) => {
    setContent((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        zh: {
          ...prev.translations.zh,
          [section]: { ...prev.translations.zh[section], [key]: value.zh },
        },
        en: {
          ...prev.translations.en,
          [section]: { ...prev.translations.en[section], [key]: value.en },
        },
      },
    }));
  };

  const patchMissionPillars = (zhPillars, enPillars) => {
    setContent((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        zh: { ...prev.translations.zh, mission: { ...prev.translations.zh.mission, pillars: zhPillars } },
        en: { ...prev.translations.en, mission: { ...prev.translations.en.mission, pillars: enPillars } },
      },
    }));
  };

  const patchProcessSteps = (zhSteps, enSteps) => {
    setContent((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        zh: { ...prev.translations.zh, process: { ...prev.translations.zh.process, steps: zhSteps } },
        en: { ...prev.translations.en, process: { ...prev.translations.en.process, steps: enSteps } },
      },
    }));
  };

  const zh = content.translations.zh;
  const en = content.translations.en;

  return (
    <div className="adm-panel">
      <h2>首页 Hero</h2>
      <Field label="标题行 1（中/英）">
        <div className="adm-bilingual">
          <input className="adm-input" value={zh.hero.headline?.[0] ?? ''} onChange={(e) => patch('zh', 'hero', { headline: [e.target.value, zh.hero.headline?.[1] ?? ''] })} />
          <input className="adm-input" value={en.hero.headline?.[0] ?? ''} onChange={(e) => patch('en', 'hero', { headline: [e.target.value, en.hero.headline?.[1] ?? ''] })} />
        </div>
      </Field>
      <Field label="标题行 2（中/英）">
        <div className="adm-bilingual">
          <input className="adm-input" value={zh.hero.headline?.[1] ?? ''} onChange={(e) => patch('zh', 'hero', { headline: [zh.hero.headline?.[0] ?? '', e.target.value] })} />
          <input className="adm-input" value={en.hero.headline?.[1] ?? ''} onChange={(e) => patch('en', 'hero', { headline: [en.hero.headline?.[0] ?? '', e.target.value] })} />
        </div>
      </Field>
      <Field label="副标题"><BilingualInput value={{ zh: zh.hero.subline, en: en.hero.subline }} onChange={(v) => patchBilingual('hero', 'subline', v)} /></Field>
      <Field label="描述"><BilingualInput multiline value={{ zh: zh.hero.desc, en: en.hero.desc }} onChange={(v) => patchBilingual('hero', 'desc', v)} /></Field>

      <h2>关于 / 艺术家</h2>
      <Field label="艺术家简介"><BilingualInput multiline value={{ zh: zh.artist.lead, en: en.artist.lead }} onChange={(v) => patchBilingual('artist', 'lead', v)} /></Field>
      <Field label="艺术家详情"><BilingualInput multiline value={{ zh: zh.artist.body, en: en.artist.body }} onChange={(v) => patchBilingual('artist', 'body', v)} /></Field>

      <h2>联系</h2>
      <Field label="名称"><BilingualInput value={{ zh: zh.contact.name, en: en.contact.name }} onChange={(v) => patchBilingual('contact', 'name', v)} /></Field>
      <Field label="说明"><BilingualInput multiline value={{ zh: zh.contact.desc, en: en.contact.desc }} onChange={(v) => patchBilingual('contact', 'desc', v)} /></Field>

      <h2>关于 · 三大支柱</h2>
      {zh.mission.pillars.map((pillar, i) => (
        <div key={i} className="adm-card adm-card--compact">
          <Field label={`支柱 ${i + 1} · 标题`}>
            <BilingualInput
              value={{ zh: pillar.title, en: en.mission.pillars[i]?.title ?? '' }}
              onChange={(v) => {
                const zhPillars = [...zh.mission.pillars];
                const enPillars = [...en.mission.pillars];
                zhPillars[i] = { ...zhPillars[i], title: v.zh };
                enPillars[i] = { ...(enPillars[i] ?? { title: '', desc: '' }), title: v.en };
                patchMissionPillars(zhPillars, enPillars);
              }}
            />
          </Field>
          <Field label="描述">
            <BilingualInput
              multiline
              value={{ zh: pillar.desc, en: en.mission.pillars[i]?.desc ?? '' }}
              onChange={(v) => {
                const zhPillars = [...zh.mission.pillars];
                const enPillars = [...en.mission.pillars];
                zhPillars[i] = { ...zhPillars[i], desc: v.zh };
                enPillars[i] = { ...(enPillars[i] ?? { title: '', desc: '' }), desc: v.en };
                patchMissionPillars(zhPillars, enPillars);
              }}
            />
          </Field>
          <RemoveBtn onClick={() => {
            patchMissionPillars(
              zh.mission.pillars.filter((_, idx) => idx !== i),
              en.mission.pillars.filter((_, idx) => idx !== i),
            );
          }} />
        </div>
      ))}
      <button
        type="button"
        className="adm-btn adm-btn--ghost"
        onClick={() => {
          const item = newMissionPillar();
          patchMissionPillars(
            [...zh.mission.pillars, item.zh],
            [...en.mission.pillars, item.en],
          );
        }}
      >
        + 新增支柱
      </button>

      <h2>创作流程 · 步骤</h2>
      {zh.process.steps.map((step, i) => (
        <div key={i} className="adm-card adm-card--compact">
          <Field label={`步骤 ${i + 1}`}>
            <BilingualInput
              multiline
              value={{ zh: step, en: en.process.steps[i] ?? '' }}
              onChange={(v) => {
                const zhSteps = [...zh.process.steps];
                const enSteps = [...en.process.steps];
                zhSteps[i] = v.zh;
                enSteps[i] = v.en;
                patchProcessSteps(zhSteps, enSteps);
              }}
            />
          </Field>
          <RemoveBtn onClick={() => {
            patchProcessSteps(
              zh.process.steps.filter((_, idx) => idx !== i),
              en.process.steps.filter((_, idx) => idx !== i),
            );
          }} />
        </div>
      ))}
      <button
        type="button"
        className="adm-btn adm-btn--ghost"
        onClick={() => {
          const item = newProcessStep();
          patchProcessSteps(
            [...zh.process.steps, item.zh],
            [...en.process.steps, item.en],
          );
        }}
      >
        + 新增步骤
      </button>
    </div>
  );
}

function AlbumsPanel({ content, setContent }) {
  const items = content.albums ?? [];
  const workCounts = Object.fromEntries(
    items.map((a) => [a.id, content.worksManifest.filter((w) => w.album === a.id).length]),
  );

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, albums: next });
  };

  const add = () => {
    setContent({ ...content, albums: [...items, newAlbum()] });
  };

  const remove = (index) => {
    const album = items[index];
    const count = workCounts[album.id] ?? 0;
    const msg = count
      ? `该分类下有 ${count} 件作品。删除后这些作品仍会保留，但可能无法在前台正确显示。确定删除？`
      : '确定删除此作品集分类？';
    if (!window.confirm(msg)) return;
    setContent({ ...content, albums: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="作品集分类" count={items.length} onAdd={add} addLabel="+ 新增系列" />
      <p className="adm-panel-tip">
        每个分类对应前台一个大的系列模块（如 FAG、电子大头）。新增后可在「作品条目」里往该分类添加图片。
      </p>
      {items.map((item, i) => (
        <div key={item.id + i} className="adm-card">
          <Field label={`分类 ID（英文标识，${workCounts[item.id] ?? 0} 件作品）`}>
            <input
              className="adm-input"
              value={item.id}
              onChange={(e) => update(i, { id: e.target.value.trim().replace(/\s+/g, '-') })}
            />
          </Field>
          <Field label="封面图">
            <ImageUpload
              value={item.cover}
              folder={`albums/${item.id}`}
              onChange={(url) => update(i, { cover: url })}
            />
          </Field>
          <Field label="名称（中 / 英）">
            <BilingualInput value={item.title} onChange={(title) => update(i, { title })} />
          </Field>
          <Field label="副标题（中 / 英）">
            <BilingualInput value={item.subtitle} onChange={(subtitle) => update(i, { subtitle })} />
          </Field>
          <Field label="系列名（中 / 英）">
            <BilingualInput value={item.series} onChange={(series) => update(i, { series })} />
          </Field>
          <Field label="材质（中 / 英）">
            <BilingualInput value={item.material} onChange={(material) => update(i, { material })} />
          </Field>
          <Field label="尺寸（中 / 英，或填同一文字）">
            <BilingualInput
              value={typeof item.size === 'string' ? { zh: item.size, en: item.size } : item.size}
              onChange={(size) => update(i, { size })}
            />
          </Field>
          <Field label="价格说明（中 / 英）">
            <BilingualInput value={item.price} onChange={(price) => update(i, { price })} />
          </Field>
          <Field label="系列介绍（中 / 英）">
            <BilingualInput multiline value={item.description} onChange={(description) => update(i, { description })} />
          </Field>
          <RemoveBtn onClick={() => remove(i)} label="删除此分类" />
        </div>
      ))}
    </div>
  );
}

function WorksPanel({ content, setContent }) {
  const items = content.worksManifest;
  const albums = content.albums ?? [];

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, worksManifest: next });
  };

  const add = () => {
    const defaultAlbum = albums[0]?.id ?? 'fag';
    setContent({
      ...content,
      worksManifest: [...items, newWork(defaultAlbum)],
    });
  };

  const remove = (index) => {
    if (!window.confirm('确定删除这件作品？')) return;
    setContent({ ...content, worksManifest: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="作品条目" count={items.length} onAdd={add} />
      {items.map((item, i) => (
        <div key={item.id + i} className="adm-card">
          <div className="adm-card-row">
            <Field label="所属分类">
              <select className="adm-input" value={item.album} onChange={(e) => update(i, { album: e.target.value })}>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.title?.zh ?? a.id}</option>
                ))}
              </select>
            </Field>
            <Field label="ID"><input className="adm-input" value={item.id} onChange={(e) => update(i, { id: e.target.value })} /></Field>
            <Field label="标题"><input className="adm-input" value={item.title} onChange={(e) => update(i, { title: e.target.value })} /></Field>
          </div>
          <Field label="图片">
            <ImageUpload value={item.image} folder={`albums/${item.album}`} onChange={(url) => update(i, { image: url })} />
          </Field>
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}
    </div>
  );
}

function StreetPanel({ content, setContent }) {
  const items = content.streetCases;

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, streetCases: next });
  };

  const add = () => {
    setContent({ ...content, streetCases: [...items, newStreetCase()] });
  };

  const remove = (index) => {
    if (!window.confirm('确定删除此案例？')) return;
    setContent({ ...content, streetCases: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="街头案例" count={items.length} onAdd={add} />
      {items.map((item, i) => (
        <div key={item.id + i} className="adm-card">
          <Field label="布局">
            <select className="adm-input" value={item.layout} onChange={(e) => update(i, { layout: e.target.value })}>
              {STREET_LAYOUTS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="标题"><BilingualInput value={item.title} onChange={(v) => update(i, { title: v })} /></Field>
          <Field label="地点"><BilingualInput value={item.location} onChange={(v) => update(i, { location: v })} /></Field>
          <Field label="图片"><ImageUpload value={item.image} folder="street-cases" onChange={(url) => update(i, { image: url })} /></Field>
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}
    </div>
  );
}

function PricingPanel({ content, setContent }) {
  const items = content.pricing;

  const update = (index, patchObj) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patchObj } : item));
    setContent({ ...content, pricing: next });
  };

  const add = () => {
    setContent({ ...content, pricing: [...items, newPricingItem()] });
  };

  const remove = (index) => {
    if (!window.confirm('确定删除此报价项？')) return;
    setContent({ ...content, pricing: items.filter((_, i) => i !== index) });
  };

  const updateImage = (index, imgIndex, url) => {
    const item = items[index];
    const images = [...(item.images ?? (item.image ? [item.image] : []))];
    images[imgIndex] = url;
    update(index, { images, image: images[0] ?? '' });
  };

  const addImage = (index) => {
    const item = items[index];
    const images = [...(item.images ?? (item.image ? [item.image] : [])), '/uploads/new.jpg'];
    update(index, { images, image: images[0] ?? '' });
  };

  const removeImage = (index, imgIndex) => {
    const item = items[index];
    const images = (item.images ?? []).filter((_, i) => i !== imgIndex);
    update(index, { images, image: images[0] ?? '' });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="委托报价" count={items.length} onAdd={add} />
      {items.map((item, i) => {
        const images = item.images ?? (item.image ? [item.image] : []);
        return (
          <div key={item.id + i} className="adm-card">
            <Field label="规格"><BilingualInput value={item.size} onChange={(v) => update(i, { size: v })} /></Field>
            <Field label="产品"><BilingualInput value={item.product} onChange={(v) => update(i, { product: v })} /></Field>
            <Field label="价格"><input className="adm-input" value={item.price} onChange={(e) => update(i, { price: e.target.value })} /></Field>
            <Field label={`展示图片 (${images.length})`}>
              {images.map((src, imgIdx) => (
                <div key={imgIdx} className="adm-image-row">
                  <ImageUpload value={src} folder="pricing" onChange={(url) => updateImage(i, imgIdx, url)} />
                  <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => removeImage(i, imgIdx)}>删</button>
                </div>
              ))}
              <button type="button" className="adm-btn adm-btn--ghost" onClick={() => addImage(i)}>+ 添加图片框</button>
            </Field>
            <RemoveBtn onClick={() => remove(i)} />
          </div>
        );
      })}
    </div>
  );
}

function SocialPanel({ content, setContent }) {
  const items = content.socialLinks;

  const update = (index, patchObj) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patchObj } : item));
    setContent({ ...content, socialLinks: next });
  };

  const add = () => {
    setContent({ ...content, socialLinks: [...items, newSocialLink()] });
  };

  const remove = (index) => {
    if (!window.confirm('确定删除此社媒链接？')) return;
    setContent({ ...content, socialLinks: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="社媒链接" count={items.length} onAdd={add} />
      {items.map((item, i) => (
        <div key={`${item.platform}-${i}`} className="adm-card adm-card--compact">
          <Field label="平台名称">
            <input className="adm-input" value={item.platform} onChange={(e) => update(i, { platform: e.target.value })} />
          </Field>
          <Field label="分组">
            <select className="adm-input" value={item.ip} onChange={(e) => update(i, { ip: e.target.value })}>
              <option value="呆">呆 · DANOSO</option>
              <option value="猫">猫 · ACAT</option>
              <option value="ACAT">ACAT · 国际</option>
            </select>
          </Field>
          <Field label="链接"><input className="adm-input" value={item.url} onChange={(e) => update(i, { url: e.target.value })} /></Field>
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}
    </div>
  );
}

function ContactCardPanel({ content, setContent }) {
  const card = content.contactCard ?? { image: '', hint: { zh: '', en: '' } };

  const patch = (updates) => {
    setContent({
      ...content,
      contactCard: {
        ...card,
        ...updates,
        hint: updates.hint ? { ...card.hint, ...updates.hint } : card.hint,
      },
    });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="扩列二维码" />
      <p className="adm-panel-tip">
        显示在网站最底部：桌面页脚左侧、手机「联系」页最下方。访客刷到底即可扫码加好友。
      </p>
      <Field label="二维码 / 扩列图">
        <ImageUpload
          value={card.image}
          folder="contact"
          onChange={(url) => patch({ image: url })}
        />
      </Field>
      <Field label="扫码提示（中 / 英）">
        <BilingualInput
          value={card.hint ?? { zh: '', en: '' }}
          onChange={(hint) => patch({ hint })}
        />
      </Field>
    </div>
  );
}

function EventsPanel({ content, setContent }) {
  const items = content.exhibitions;

  const update = (index, patchObj) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patchObj } : item));
    setContent({ ...content, exhibitions: next });
  };

  const add = () => {
    setContent({ ...content, exhibitions: [...items, newExhibition()] });
  };

  const remove = (index) => {
    if (!window.confirm('确定删除此活动？')) return;
    setContent({ ...content, exhibitions: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="adm-panel">
      <PanelHead title="展览与活动" count={items.length} onAdd={add} />
      {items.map((item, i) => (
        <div key={i} className="adm-card adm-card--compact">
          <Field label="年份"><input className="adm-input" value={item.year} onChange={(e) => update(i, { year: e.target.value })} /></Field>
          <Field label="标题"><BilingualInput value={item.title} onChange={(v) => update(i, { title: v })} /></Field>
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('acat-admin-token'));
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState('text');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.ok && setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchContent();
      const defaults = cloneDefaultContent();
      setContent({
        ...data,
        albums: data.albums ?? defaults.albums,
        contactCard: data.contactCard ?? defaults.contactCard,
      });
    } catch {
      setContent(cloneDefaultContent());
      setMsg('后端未连接，使用本地默认数据（保存需启动 server）');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  if (!authed) {
    return (
      <div className="adm-login">
        <form
          className="adm-login-box"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const { token } = await api.login(password);
              setAdminToken(token);
              setAuthed(true);
              load();
            } catch (err) {
              const msg = err.message === 'Failed to fetch' || err.name === 'TypeError'
                ? '无法连接后端。请先在项目目录运行：npm run dev'
                : err.message;
              alert(msg);
            }
          }}
        >
          <h1>ACAT 内容管理</h1>
          <p>登录后可修改网站文案、图片与链接</p>
          {apiOnline === false && (
            <p className="adm-login-warn">
              后端未启动。请在终端运行：<code>npm run dev</code>
            </p>
          )}
          {apiOnline === true && (
            <p className="adm-login-ok">后端已连接，可以登录</p>
          )}
          <input
            className="adm-input"
            type="password"
            placeholder="管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="adm-btn adm-btn--primary">登录</button>
          <a className="adm-back" href="/">← 返回网站</a>
        </form>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await api.saveContent(content);
      setMsg('已保存 · 刷新前台即可看到更新');
    } catch (err) {
      setMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return <div className="adm-loading">加载中…</div>;
  }

  const panels = {
    text: <TextPanel content={content} setContent={setContent} />,
    albums: <AlbumsPanel content={content} setContent={setContent} />,
    works: <WorksPanel content={content} setContent={setContent} />,
    street: <StreetPanel content={content} setContent={setContent} />,
    pricing: <PricingPanel content={content} setContent={setContent} />,
    social: <SocialPanel content={content} setContent={setContent} />,
    contact: <ContactCardPanel content={content} setContent={setContent} />,
    events: <EventsPanel content={content} setContent={setContent} />,
  };

  return (
    <div className="adm-shell">
      <header className="adm-header">
        <div>
          <h1>ACAT CMS</h1>
          <p>{msg || '修改后点击保存'}</p>
        </div>
        <div className="adm-header-actions">
          <a className="adm-btn adm-btn--ghost" href="/" target="_blank" rel="noreferrer">预览网站</a>
          <button type="button" className="adm-btn adm-btn--primary" disabled={saving} onClick={handleSave}>
            {saving ? '保存中…' : '保存全部'}
          </button>
          <button
            type="button"
            className="adm-btn adm-btn--ghost"
            onClick={() => { setAdminToken(''); setAuthed(false); }}
          >
            退出
          </button>
        </div>
      </header>
      <div className="adm-body">
        <nav className="adm-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`adm-nav-btn${tab === t.id ? ' adm-nav-btn--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <main className="adm-main">{panels[tab]}</main>
      </div>
    </div>
  );
}
