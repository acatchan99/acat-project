/**
 * @param {{ posterUrl?: string, className?: string }} props
 */
export default function HeroPosterFallback({ posterUrl = '', className = '' }) {
  if (!posterUrl) {
    return <div className={`m-hero-poster-fallback m-hero-poster-fallback--empty ${className}`.trim()} aria-hidden="true" />;
  }

  return (
    <div
      className={`m-hero-poster-fallback ${className}`.trim()}
      aria-hidden="true"
      style={{ backgroundImage: `url("${posterUrl}")` }}
    />
  );
}
