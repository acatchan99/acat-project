import { useState, useCallback, useEffect } from 'react';
import { cloneDefaultContent } from '../data/defaultContent';
import { api, setAdminToken } from '../lib/api';

const TABS = [
  { id: 'text', label: '文案' },
  { id: 'works', label: '作品集' },
  { id: 'street', label: '街头案例' },
  { id: 'pricing', label: '报价' },
  { id: 'social', label: '社媒' },
  { id: 'events', label: '展览' },
];

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
    setContent({
      ...content,
      translations: {
        ...content.translations,
        [lang]: { ...content.translations[lang], [section]: { ...content.translations[lang][section], ...patchObj } },
      },
    });
  };

  const zh = content.translations.zh;
  const en = content.translations.en;

  return (
    <div className="adm-panel">
      <h2>首页 Hero</h2>
      <Field label="标题行 1（中/英）">
        <div className="adm-bilingual">
          <input className="adm-input" value={zh.hero.headline[0]} onChange={(e) => patch('zh', 'hero', { headline: [e.target.value, zh.hero.headline[1]] })} />
          <input className="adm-input" value={en.hero.headline[0]} onChange={(e) => patch('en', 'hero', { headline: [e.target.value, en.hero.headline[1]] })} />
        </div>
      </Field>
      <Field label="标题行 2（中/英）">
        <div className="adm-bilingual">
          <input className="adm-input" value={zh.hero.headline[1]} onChange={(e) => patch('zh', 'hero', { headline: [zh.hero.headline[0], e.target.value] })} />
          <input className="adm-input" value={en.hero.headline[1]} onChange={(e) => patch('en', 'hero', { headline: [en.hero.headline[0], e.target.value] })} />
        </div>
      </Field>
      <Field label="副标题"><BilingualInput value={{ zh: zh.hero.subline, en: en.hero.subline }} onChange={(v) => { patch('zh', 'hero', { subline: v.zh }); patch('en', 'hero', { subline: v.en }); }} /></Field>
      <Field label="描述"><BilingualInput multiline value={{ zh: zh.hero.desc, en: en.hero.desc }} onChange={(v) => { patch('zh', 'hero', { desc: v.zh }); patch('en', 'hero', { desc: v.en }); }} /></Field>

      <h2>关于 / 艺术家</h2>
      <Field label="艺术家简介"><BilingualInput multiline value={{ zh: zh.artist.lead, en: en.artist.lead }} onChange={(v) => { patch('zh', 'artist', { lead: v.zh }); patch('en', 'artist', { lead: v.en }); }} /></Field>
      <Field label="艺术家详情"><BilingualInput multiline value={{ zh: zh.artist.body, en: en.artist.body }} onChange={(v) => { patch('zh', 'artist', { body: v.zh }); patch('en', 'artist', { body: v.en }); }} /></Field>

      <h2>联系</h2>
      <Field label="名称"><BilingualInput value={{ zh: zh.contact.name, en: en.contact.name }} onChange={(v) => { patch('zh', 'contact', { name: v.zh }); patch('en', 'contact', { name: v.en }); }} /></Field>
      <Field label="说明"><BilingualInput multiline value={{ zh: zh.contact.desc, en: en.contact.desc }} onChange={(v) => { patch('zh', 'contact', { desc: v.zh }); patch('en', 'contact', { desc: v.en }); }} /></Field>
    </div>
  );
}

function WorksPanel({ content, setContent }) {
  const items = content.worksManifest;

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, worksManifest: next });
  };

  const add = () => {
    const id = `new-${Date.now()}`;
    setContent({
      ...content,
      worksManifest: [...items, { album: 'fag', id, title: '新作品', image: '/uploads/new.jpg' }],
    });
  };

  const remove = (index) => {
    setContent({ ...content, worksManifest: items.filter((_, i) => i !== index) });
  };

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <h2>作品集 ({items.length})</h2>
        <button type="button" className="adm-btn adm-btn--ghost" onClick={add}>+ 新增</button>
      </div>
      {items.map((item, i) => (
        <div key={item.id + i} className="adm-card">
          <div className="adm-card-row">
            <Field label="专辑">
              <select className="adm-input" value={item.album} onChange={(e) => update(i, { album: e.target.value })}>
                <option value="fag">FAG</option>
                <option value="digital">电子大头</option>
                <option value="odod">ODOD</option>
              </select>
            </Field>
            <Field label="ID"><input className="adm-input" value={item.id} onChange={(e) => update(i, { id: e.target.value })} /></Field>
            <Field label="标题"><input className="adm-input" value={item.title} onChange={(e) => update(i, { title: e.target.value })} /></Field>
          </div>
          <Field label="图片">
            <ImageUpload value={item.image} folder={`albums/${item.album}`} onChange={(url) => update(i, { image: url })} />
          </Field>
          <button type="button" className="adm-btn adm-btn--danger" onClick={() => remove(i)}>删除</button>
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

  return (
    <div className="adm-panel">
      <h2>街头案例</h2>
      {items.map((item, i) => (
        <div key={item.id} className="adm-card">
          <Field label="标题"><BilingualInput value={item.title} onChange={(v) => update(i, { title: v })} /></Field>
          <Field label="地点"><BilingualInput value={item.location} onChange={(v) => update(i, { location: v })} /></Field>
          <Field label="图片"><ImageUpload value={item.image} folder="street-cases" onChange={(url) => update(i, { image: url })} /></Field>
        </div>
      ))}
    </div>
  );
}

function PricingPanel({ content, setContent }) {
  const items = content.pricing;

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, pricing: next });
  };

  return (
    <div className="adm-panel">
      <h2>委托报价</h2>
      {items.map((item, i) => (
        <div key={item.id} className="adm-card">
          <Field label="规格"><BilingualInput value={item.size} onChange={(v) => update(i, { size: v })} /></Field>
          <Field label="产品"><BilingualInput value={item.product} onChange={(v) => update(i, { product: v })} /></Field>
          <Field label="价格"><input className="adm-input" value={item.price} onChange={(e) => update(i, { price: e.target.value })} /></Field>
          <Field label="图片"><ImageUpload value={item.image} folder="pricing" onChange={(url) => update(i, { image: url })} /></Field>
        </div>
      ))}
    </div>
  );
}

function SocialPanel({ content, setContent }) {
  const items = content.socialLinks;

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, socialLinks: next });
  };

  return (
    <div className="adm-panel">
      <h2>社媒链接</h2>
      {items.map((item, i) => (
        <div key={`${item.platform}-${i}`} className="adm-card adm-card--compact">
          <span className="adm-chip">{item.platform}</span>
          <Field label="分组">
            <select className="adm-input" value={item.ip} onChange={(e) => update(i, { ip: e.target.value })}>
              <option value="呆">呆 · DANOSO</option>
              <option value="猫">猫 · ACAT</option>
              <option value="ACAT">ACAT · 国际</option>
            </select>
          </Field>
          <Field label="链接"><input className="adm-input" value={item.url} onChange={(e) => update(i, { url: e.target.value })} /></Field>
        </div>
      ))}
    </div>
  );
}

function EventsPanel({ content, setContent }) {
  const items = content.exhibitions;

  const update = (index, patch) => {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setContent({ ...content, exhibitions: next });
  };

  const add = () => {
    setContent({
      ...content,
      exhibitions: [...items, { year: '2026', title: { zh: '新活动', en: 'New event' } }],
    });
  };

  return (
    <div className="adm-panel">
      <div className="adm-panel-head">
        <h2>展览与活动</h2>
        <button type="button" className="adm-btn adm-btn--ghost" onClick={add}>+ 新增</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="adm-card adm-card--compact">
          <Field label="年份"><input className="adm-input" value={item.year} onChange={(e) => update(i, { year: e.target.value })} /></Field>
          <Field label="标题"><BilingualInput value={item.title} onChange={(v) => update(i, { title: v })} /></Field>
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.fetchContent();
      setContent(data);
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
              alert(err.message);
            }
          }}
        >
          <h1>ACAT 内容管理</h1>
          <p>登录后可修改网站文案、图片与链接</p>
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
    works: <WorksPanel content={content} setContent={setContent} />,
    street: <StreetPanel content={content} setContent={setContent} />,
    pricing: <PricingPanel content={content} setContent={setContent} />,
    social: <SocialPanel content={content} setContent={setContent} />,
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
