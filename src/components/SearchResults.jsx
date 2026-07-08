import VideoCard from './VideoCard';

export default function SearchResults({ query, results, accent, accentDeep, onOpen }) {
  return (
    <div style={{ padding: '104px 56px 60px', minHeight: '100vh', animation: 'awkFade .3s' }}>
      <div style={{ fontSize: 13, color: '#72A3C4', marginBottom: 6 }}>Resultados para</div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', marginBottom: 28 }}>&ldquo;{query}&rdquo;</div>
      {results.length === 0 && (
        <div style={{ color: '#72A3C4', fontSize: 15 }}>Sin coincidencias. Prueba con &ldquo;Vivens&rdquo;, &ldquo;Intro&rdquo; o &ldquo;curso&rdquo;.</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
        {results.map((item) => (
          <VideoCard key={item.id} item={item} accent={accent} accentDeep={accentDeep} onOpen={onOpen} variant="search" />
        ))}
      </div>
    </div>
  );
}
