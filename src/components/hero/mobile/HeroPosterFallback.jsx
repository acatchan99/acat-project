/**
 * @param {{ posterUrl?: string, className?: string, dimmed?: boolean }} props
 */
export default function HeroPosterFallback({ posterUrl = '', className = '', dimmed = false }) {
  const classes = [
    'm-hero-poster-fallback',
    !posterUrl ? 'm-hero-poster-fallback--empty' : '',
    dimmed ? 'm-hero-poster-fallback--dimmed' : '',
    className,
  ].filter(Boolean).join(' ');

  if (!posterUrl) {
    return <div className={classes} aria-hidden="true" />;
  }

  return (
    <div
      className={classes}
      aria-hidden="true"
      role="presentation"
    >
      <img
        className="m-hero-poster-fallback__img"
        src={posterUrl}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
