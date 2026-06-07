import { useLang } from '../context/LangContext';

export default function Footer() {
  const { t } = useLang();
  const f = t('footer');

  return (
    <footer className="site-footer">
      <div className="container footer-layout">
        <div className="footer-contact reveal">
          <h2>{f.title}</h2>
          <ul>
            <li><span>{f.email}</span> acat@example.com</li>
            <li><span>{f.wechat}</span> CY / ACAT</li>
            <li><span>{f.social}</span> @ACAT_CHAN</li>
          </ul>
        </div>

        <form className="footer-form reveal reveal-d2" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder={f.name} aria-label={f.name} />
          <input type="email" placeholder={f.email} aria-label={f.email} />
          <textarea placeholder={f.comment} rows={4} aria-label={f.comment} />
          <button type="submit" className="btn btn-blue">{f.send}</button>
        </form>
      </div>

      <div className="container footer-bottom">
        <div className="footer-brand">
          <img src="/fag-logo.png" alt="" />
          <span>ACAT · 陈吖猫</span>
        </div>
        <p>{f.copy}</p>
      </div>
    </footer>
  );
}
