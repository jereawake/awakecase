import { all } from '../data';
import VideoCard from './VideoCard';

export default function VideoModal({ item, accent, accentDeep, onClose, onOpen }) {
  const related = all.filter((v) => v.cat === item.cat && v.id !== item.id).slice(0, 3);

  const backdropClick = (e) => {
    if (e.target === e.currentTarget || !e.target.closest('[data-stop]')) onClose();
  };

  return (
    <div onClick={backdropClick} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(1,8,18,.82)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '48px 20px', animation: 'awkFade .25s' }}>
      <div data-stop="1" style={{ width: 'min(920px,100%)', background: '#011830', borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.7)', animation: 'awkUp .35s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
          <video key={item.id} src={item.src} controls autoPlay playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <div onClick={onClose} className="awk-btn" style={{ position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(1,16,34,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </div>
        </div>
        <div style={{ padding: '26px 32px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: accent }}>{item.tag}</span>
            <span style={{ fontSize: 11, color: '#72A3C4' }}>Awakelab · 2026</span>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.02em', margin: '0 0 12px' }}>{item.title}</h2>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: '#C7D4E6', margin: 0, maxWidth: 640 }}>{item.desc}</p>

          {related.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#B9C9DC', marginBottom: 14 }}>Más en {item.tag}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                {related.map((r) => (
                  <VideoCard key={r.id} item={r} accent={accent} accentDeep={accentDeep} onOpen={onOpen} variant="related" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
