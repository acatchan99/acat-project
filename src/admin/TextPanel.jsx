import {
  patchTranslation,
  patchTranslationBilingual,
  patchTranslationBoth,
} from './contentState';
import { newMissionPillar, newProcessStep } from './templates';

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
  const safe = { zh: value?.zh ?? '', en: value?.en ?? '' };
  return (
    <div className="adm-bilingual">
      <Tag
        className="adm-input"
        value={safe.zh}
        placeholder="中文"
        rows={multiline ? 3 : undefined}
        onChange={(e) => onChange({ ...safe, zh: e.target.value })}
      />
      <Tag
        className="adm-input"
        value={safe.en}
        placeholder="English"
        rows={multiline ? 3 : undefined}
        onChange={(e) => onChange({ ...safe, en: e.target.value })}
      />
    </div>
  );
}

function HeadlineRow({ label, index, zh, en, setContent }) {
  return (
    <Field label={label}>
      <div className="adm-bilingual">
        <input
          className="adm-input"
          value={zh?.[index] ?? ''}
          onChange={(e) => {
            const next = [...(zh ?? ['', ''])];
            next[index] = e.target.value;
            patchTranslation(setContent, 'zh', 'hero', { headline: next });
          }}
        />
        <input
          className="adm-input"
          value={en?.[index] ?? ''}
          onChange={(e) => {
            const next = [...(en ?? ['', ''])];
            next[index] = e.target.value;
            patchTranslation(setContent, 'en', 'hero', { headline: next });
          }}
        />
      </div>
    </Field>
  );
}

function StatementRow({ label, index, zh, en, setContent }) {
  return (
    <Field label={label}>
      <div className="adm-bilingual">
        <input
          className="adm-input"
          value={zh?.[index] ?? ''}
          onChange={(e) => {
            const next = [...(zh ?? ['', ''])];
            next[index] = e.target.value;
            patchTranslation(setContent, 'zh', 'mission', { statement: next });
          }}
        />
        <input
          className="adm-input"
          value={en?.[index] ?? ''}
          onChange={(e) => {
            const next = [...(en ?? ['', ''])];
            next[index] = e.target.value;
            patchTranslation(setContent, 'en', 'mission', { statement: next });
          }}
        />
      </div>
    </Field>
  );
}

function NavFields({ zh, en, setContent }) {
  const keys = Object.keys(zh.nav ?? {});
  return keys.map((key) => (
    <Field key={key} label={`导航 · ${key}`}>
      <BilingualInput
        value={{ zh: zh.nav?.[key], en: en.nav?.[key] }}
        onChange={(v) => patchTranslationBoth(setContent, 'nav', { [key]: v.zh }, { [key]: v.en })}
      />
    </Field>
  ));
}

function FooterFields({ zh, en, setContent }) {
  const keys = Object.keys(zh.footer ?? {});
  return keys.map((key) => (
    <Field key={key} label={`页脚 · ${key}`}>
      <BilingualInput
        value={{ zh: zh.footer?.[key], en: en.footer?.[key] }}
        onChange={(v) => patchTranslationBoth(setContent, 'footer', { [key]: v.zh }, { [key]: v.en })}
      />
    </Field>
  ));
}

function DetailFields({ zh, en, setContent }) {
  const scalarKeys = ['size', 'series', 'artist', 'material', 'close', 'cta', 'swipeHint', 'navPrev', 'navNext'];
  return (
    <>
      {scalarKeys.map((key) => (
        <Field key={key} label={`作品详情 · ${key}`}>
          <BilingualInput
            value={{ zh: zh.detail?.[key], en: en.detail?.[key] }}
            onChange={(v) => patchTranslationBoth(setContent, 'detail', { [key]: v.zh }, { [key]: v.en })}
          />
        </Field>
      ))}
      <Field label="作品详情 · sizes（逗号分隔，中英各一行）">
        <BilingualInput
          value={{
            zh: (zh.detail?.sizes ?? []).join(', '),
            en: (en.detail?.sizes ?? []).join(', '),
          }}
          onChange={(v) => {
            const toArr = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);
            patchTranslationBoth(
              setContent,
              'detail',
              { sizes: toArr(v.zh) },
              { sizes: toArr(v.en) },
            );
          }}
        />
      </Field>
    </>
  );
}

export default function TextPanel({ content, setContent }) {
  const zh = content.translations.zh;
  const en = content.translations.en;

  const patchMissionPillars = (zhPillars, enPillars) => {
    patchTranslationBoth(setContent, 'mission', { pillars: zhPillars }, { pillars: enPillars });
  };

  const patchProcessSteps = (zhSteps, enSteps) => {
    patchTranslationBoth(setContent, 'process', { steps: zhSteps }, { steps: enSteps });
  };

  const bi = (section, key, multiline = false) => (
    <BilingualInput
      multiline={multiline}
      value={{ zh: zh[section]?.[key], en: en[section]?.[key] }}
      onChange={(v) => patchTranslationBilingual(setContent, section, key, v)}
    />
  );

  return (
    <div className="adm-panel">
      <p className="adm-panel-tip">
        本页涵盖网站所有固定文案。修改后请点击右上角「保存全部」，再刷新官网查看。
      </p>

      <h2>首页 Hero</h2>
      <HeadlineRow label="标题行 1（中/英）" index={0} zh={zh.hero?.headline} en={en.hero?.headline} setContent={setContent} />
      <HeadlineRow label="标题行 2（中/英）" index={1} zh={zh.hero?.headline} en={en.hero?.headline} setContent={setContent} />
      <Field label="副标题">{bi('hero', 'subline')}</Field>
      <Field label="描述">{bi('hero', 'desc', true)}</Field>
      <Field label="按钮文字">{bi('hero', 'cta')}</Field>

      <h2>关于 · 主标题</h2>
      <StatementRow label="主标题行 1" index={0} zh={zh.mission?.statement} en={en.mission?.statement} setContent={setContent} />
      <StatementRow label="主标题行 2" index={1} zh={zh.mission?.statement} en={en.mission?.statement} setContent={setContent} />

      <h2>关于 · 三大支柱</h2>
      {(zh.mission?.pillars ?? []).map((pillar, i) => (
        <div key={i} className="adm-card adm-card--compact">
          <Field label={`支柱 ${i + 1} · 标题`}>
            <BilingualInput
              value={{ zh: pillar.title, en: en.mission?.pillars?.[i]?.title ?? '' }}
              onChange={(v) => {
                const zhPillars = [...zh.mission.pillars];
                const enPillars = [...(en.mission?.pillars ?? [])];
                zhPillars[i] = { ...zhPillars[i], title: v.zh };
                enPillars[i] = { ...(enPillars[i] ?? { title: '', desc: '' }), title: v.en };
                patchMissionPillars(zhPillars, enPillars);
              }}
            />
          </Field>
          <Field label="描述">
            <BilingualInput
              multiline
              value={{ zh: pillar.desc, en: en.mission?.pillars?.[i]?.desc ?? '' }}
              onChange={(v) => {
                const zhPillars = [...zh.mission.pillars];
                const enPillars = [...(en.mission?.pillars ?? [])];
                zhPillars[i] = { ...zhPillars[i], desc: v.zh };
                enPillars[i] = { ...(enPillars[i] ?? { title: '', desc: '' }), desc: v.en };
                patchMissionPillars(zhPillars, enPillars);
              }}
            />
          </Field>
          <button
            type="button"
            className="adm-btn adm-btn--danger"
            onClick={() => patchMissionPillars(
              zh.mission.pillars.filter((_, idx) => idx !== i),
              (en.mission?.pillars ?? []).filter((_, idx) => idx !== i),
            )}
          >
            删除此项
          </button>
        </div>
      ))}
      <button
        type="button"
        className="adm-btn adm-btn--ghost"
        onClick={() => {
          const item = newMissionPillar();
          patchMissionPillars(
            [...zh.mission.pillars, item.zh],
            [...(en.mission?.pillars ?? []), item.en],
          );
        }}
      >
        + 新增支柱
      </button>

      <h2>作品集模块</h2>
      <Field label="区块标题">{bi('works', 'title')}</Field>
      <Field label="副标题">{bi('works', 'sub')}</Field>
      <Field label="委托徽章">{bi('works', 'badge')}</Field>
      <Field label="「了解更多」">{bi('works', 'moreInfo')}</Field>
      <Field label="「查看」">{bi('works', 'view')}</Field>
      <Field label="件数单位">{bi('collections', 'pieces')}</Field>

      <h2>艺术家</h2>
      <Field label="标签">{bi('artist', 'tag')}</Field>
      <Field label="简介">{bi('artist', 'lead', true)}</Field>
      <Field label="详情">{bi('artist', 'body', true)}</Field>
      <Field label="按钮">{bi('artist', 'cta')}</Field>
      <Field label="图片说明">{bi('artist', 'caption')}</Field>

      <h2>街头案例</h2>
      <Field label="眉标">{bi('streetCases', 'eyebrow')}</Field>
      <Field label="标题">{bi('streetCases', 'title')}</Field>
      <Field label="描述">{bi('streetCases', 'desc', true)}</Field>
      <Field label="计数标签">{bi('streetCases', 'countLabel')}</Field>
      <Field label="关闭按钮">{bi('streetCases', 'close')}</Field>

      <h2>委托报价</h2>
      <Field label="眉标">{bi('pricing', 'eyebrow')}</Field>
      <Field label="标题">{bi('pricing', 'title')}</Field>
      <Field label="表头 · 规格">{bi('pricing', 'colSpec')}</Field>
      <Field label="表头 · 价格">{bi('pricing', 'colPrice')}</Field>
      <Field label="底部说明">{bi('pricing', 'note', true)}</Field>
      <Field label="咨询按钮">{bi('pricing', 'cta')}</Field>

      <h2>创作流程</h2>
      <Field label="眉标">{bi('process', 'eyebrow')}</Field>
      <Field label="标题">{bi('process', 'title')}</Field>
      <Field label="引言">{bi('process', 'intro', true)}</Field>
      {(zh.process?.steps ?? []).map((step, i) => (
        <div key={i} className="adm-card adm-card--compact">
          <Field label={`步骤 ${i + 1}`}>
            <BilingualInput
              multiline
              value={{ zh: step, en: en.process?.steps?.[i] ?? '' }}
              onChange={(v) => {
                const zhSteps = [...zh.process.steps];
                const enSteps = [...(en.process?.steps ?? [])];
                zhSteps[i] = v.zh;
                enSteps[i] = v.en;
                patchProcessSteps(zhSteps, enSteps);
              }}
            />
          </Field>
          <button
            type="button"
            className="adm-btn adm-btn--danger"
            onClick={() => patchProcessSteps(
              zh.process.steps.filter((_, idx) => idx !== i),
              (en.process?.steps ?? []).filter((_, idx) => idx !== i),
            )}
          >
            删除此项
          </button>
        </div>
      ))}
      <button
        type="button"
        className="adm-btn adm-btn--ghost"
        onClick={() => {
          const item = newProcessStep();
          patchProcessSteps(
            [...zh.process.steps, item.zh],
            [...(en.process?.steps ?? []), item.en],
          );
        }}
      >
        + 新增步骤
      </button>

      <h2>展览与活动</h2>
      <Field label="区块标题">{bi('events', 'title')}</Field>

      <h2>联系 · 社媒矩阵</h2>
      <Field label="眉标">{bi('contact', 'eyebrow')}</Field>
      <Field label="标题">{bi('contact', 'title')}</Field>
      <Field label="名称">{bi('contact', 'name')}</Field>
      <Field label="说明">{bi('contact', 'desc', true)}</Field>
      <Field label="粉丝标签">{bi('contact', 'followers')}</Field>

      <h2>顶部导航</h2>
      <NavFields zh={zh} en={en} setContent={setContent} />

      <h2>页脚联系信息</h2>
      <FooterFields zh={zh} en={en} setContent={setContent} />

      <h2>作品详情弹窗</h2>
      <DetailFields zh={zh} en={en} setContent={setContent} />
    </div>
  );
}
