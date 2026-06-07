import { useLang } from '../context/LangContext';
import ContactQrCard from './ContactQrCard';
import ContactDirect from './ContactDirect';

export default function Footer() {
  const { t } = useLang();
  const f = t('footer');

  return (
    <footer className="site-footer">
      <div className="container footer-layout">
        <div className="footer-contact reveal">
          <div className="footer-contact-info">
            <h2>{f.title}</h2>
            <ContactDirect />
            <ul className="footer-contact-extra">
              <li><span>{f.social}</span> {f.socialValue}</li>
            </ul>
          </div>

          <ContactQrCard className="reveal reveal-d2" />
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-brand">
          <img src="/fag-logo.png" alt="ACAT 陈吖猫" />
          <span>ACAT · 陈吖猫</span>
        </div>
        <p>{f.copy}</p>
      </div>
    </footer>
  );
}
