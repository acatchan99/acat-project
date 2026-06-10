import { useState } from 'react';
import { api } from '../lib/api';
import { DEFAULT_HERO_VIDEO, normalizeHeroVideoConfig } from '../data/heroBackgroundVideo';

function Field({ label, children, hint }) {
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      {hint && <span className="adm-panel-tip">{hint}</span>}
      {children}
    </label>
  );
}

function MediaUpload({ value, onChange, onUpload, accept, idleLabel, previewType = 'video' }) {
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await onUpload(file);
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
      {value && previewType === 'video' && (
        <video className="adm-thumb adm-thumb--video" src={value} muted playsInline controls />
      )}
      {value && previewType === 'image' && (
        <img src={value} alt="" className="adm-thumb" />
      )}
      <input
        className="adm-input"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="上传后自动填入 URL"
      />
      <label className="adm-upload-btn">
        {busy ? '上传中…' : idleLabel}
        <input type="file" accept={accept} hidden onChange={handleFile} />
      </label>
    </div>
  );
}

function patchHeroVideo(setContent, patch) {
  setContent((prev) => ({
    ...prev,
    ...normalizeHeroVideoConfig({ ...DEFAULT_HERO_VIDEO, ...prev, ...patch }),
  }));
}

export default function HeroVideoPanel({ content, setContent }) {
  const cfg = normalizeHeroVideoConfig(content ?? DEFAULT_HERO_VIDEO);

  return (
    <div className="adm-panel">
      <h2>首页 Hero 背景视频</h2>
      <p className="adm-panel-tip">
        视频显示在首屏卡片背后作为氛围层。手机端与桌面端请分别上传竖版 / 横版视频。改完后点右上角「保存全部」。
      </p>

      <Field label="启用背景视频">
        <label className="adm-check">
          <input
            type="checkbox"
            checked={cfg.heroBackgroundVideoEnabled}
            onChange={(e) => patchHeroVideo(setContent, { heroBackgroundVideoEnabled: e.target.checked })}
          />
          <span>开启后首页 Hero 区域显示视频背景</span>
        </label>
      </Field>

      <Field
        label="手机端竖版视频"
        hint="建议尺寸 720×1280，通过专用接口上传"
      >
        <MediaUpload
          value={cfg.heroBackgroundVideoMobile}
          onChange={(url) => patchHeroVideo(setContent, { heroBackgroundVideoMobile: url })}
          onUpload={(file) => api.uploadHeroVideoMobile(file)}
          accept="video/mp4,video/webm,video/quicktime"
          idleLabel="上传手机端视频"
        />
      </Field>

      <Field
        label="桌面端横版视频"
        hint="建议尺寸 1280×720，通过专用接口上传"
      >
        <MediaUpload
          value={cfg.heroBackgroundVideoDesktop}
          onChange={(url) => patchHeroVideo(setContent, { heroBackgroundVideoDesktop: url })}
          onUpload={(file) => api.uploadHeroVideoDesktop(file)}
          accept="video/mp4,video/webm,video/quicktime"
          idleLabel="上传桌面端视频"
        />
      </Field>

      <Field label="视频封面图（Poster）" hint="视频加载前显示，避免首屏空白">
        <MediaUpload
          value={cfg.heroBackgroundVideoPoster}
          onChange={(url) => patchHeroVideo(setContent, { heroBackgroundVideoPoster: url })}
          onUpload={(file) => api.uploadHeroVideoPoster(file)}
          accept="image/*"
          idleLabel="上传封面图"
          previewType="image"
        />
      </Field>

      <Field label={`暗色遮罩透明度（${cfg.heroBackgroundVideoOverlayOpacity}）`}>
        <input
          className="adm-input"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={cfg.heroBackgroundVideoOverlayOpacity}
          onChange={(e) => patchHeroVideo(setContent, {
            heroBackgroundVideoOverlayOpacity: Number(e.target.value),
          })}
        />
      </Field>

      <Field label="底部黑色渐变">
        <label className="adm-check">
          <input
            type="checkbox"
            checked={cfg.heroBottomGradientEnabled}
            onChange={(e) => patchHeroVideo(setContent, { heroBottomGradientEnabled: e.target.checked })}
          />
          <span>启用 Hero 底部渐变，与下方内容自然衔接</span>
        </label>
      </Field>

      <Field label="底部渐变高度">
        <input
          className="adm-input"
          value={cfg.heroBottomGradientHeight}
          placeholder="20%"
          onChange={(e) => patchHeroVideo(setContent, { heroBottomGradientHeight: e.target.value })}
        />
      </Field>
    </div>
  );
}
