import { usePageTransition } from '../context/PageTransitionContext';

export default function PageTransition() {
  const { state } = usePageTransition();
  if (!state) return null;

  return (
    <div
      className={`page-transition page-transition--${state.phase}`}
      aria-hidden="true"
    >
      <div className="page-transition-inner">
        <img src="/fag-logo.png" alt="" className="page-transition-logo" />
        <span className="page-transition-series">{state.subtitle}</span>
        <span className="page-transition-title">{state.title}</span>
      </div>
    </div>
  );
}
