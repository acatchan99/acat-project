import { useState, useCallback } from 'react';
import { useLang } from '../context/LangContext';

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  return ok;
}

function DirectRow({ label, value, href, copyValue }) {
  const { t } = useLang();
  const f = t('footer');
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyText(copyValue ?? value);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, [copyValue, value]);

  const content = (
    <>
      <span className="contact-direct-value">{value}</span>
      <span className="contact-direct-action">{copied ? f.copied : f.tapCopy}</span>
    </>
  );

  return (
    <li className="contact-direct-item">
      <span className="contact-direct-label">{label}</span>
      {href ? (
        <a className="contact-direct-btn" href={href} onClick={onCopy}>
          {content}
        </a>
      ) : (
        <button type="button" className="contact-direct-btn" onClick={onCopy}>
          {content}
        </button>
      )}
    </li>
  );
}

export default function ContactDirect({ className = '' }) {
  const { t } = useLang();
  const f = t('footer');

  return (
    <ul className={`contact-direct${className ? ` ${className}` : ''}`}>
      <DirectRow label={f.phone} value={f.phoneValue} href={`tel:${f.phoneValue.replace(/\s/g, '')}`} />
      <DirectRow label={f.qq} value={f.qqValue} />
      <DirectRow label={f.wechat} value={f.wechatValue} copyValue={f.wechatCopy} />
    </ul>
  );
}
