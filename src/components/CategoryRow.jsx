import { useRef } from 'react';
import VideoCard from './VideoCard';

export default function CategoryRow({ row, accent, accentDeep, onOpen }) {
  const scrId = 'scr-' + row.key;
  const secId = 'sec-' + row.key;
  const scrollerRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.82, behavior: 'smooth' });
  };

  return (
    <section id={secId} style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '0 56px 4px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em', margin: 0 }}>{row.label}</h2>
        <span style={{ fontSize: 12, color: '#72A3C4' }}>{row.note}</span>
      </div>
      <div className="awk-rowwrap" style={{ position: 'relative' }}>
        <div onClick={() => scroll(-1)} className="awk-arrow awk-btn" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 56, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg,rgba(1,16,34,.85),rgba(1,16,34,0))', cursor: 'pointer' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M15 18l-6-6 6-6" /></svg>
        </div>
        <div onClick={() => scroll(1)} className="awk-arrow awk-btn" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 56, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(270deg,rgba(1,16,34,.85),rgba(1,16,34,0))', cursor: 'pointer' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M9 18l6-6-6-6" /></svg>
        </div>
        <div ref={scrollerRef} id={scrId} className="awk-scroller" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '14px 56px', scrollPaddingLeft: 56 }}>
          {row.items.map((item) => (
            <VideoCard key={item.id} item={item} accent={accent} accentDeep={accentDeep} onOpen={onOpen} variant="row" />
          ))}
        </div>
      </div>
    </section>
  );
}
