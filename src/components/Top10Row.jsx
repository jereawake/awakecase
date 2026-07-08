import { top10 } from '../data';
import VideoCard from './VideoCard';

export default function Top10Row({ accent, accentSoft, accentDeep, onOpen }) {
  return (
    <section id="sec-top10" style={{ margin: '6px 0 44px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '0 56px 16px' }}>
        <h2 style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-.01em', margin: 0 }}>Top 10 en Awakelab</h2>
        <span style={{ fontSize: 12, color: '#72A3C4' }}>esta semana</span>
      </div>
      <div className="awk-rowwrap" style={{ position: 'relative' }}>
        <div id="scr-top10" className="awk-scroller" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '20px 56px', scrollPaddingLeft: 56 }}>
          {top10.map((item) => (
            <div key={item.id} onClick={() => onOpen(item)} style={{ display: 'flex', alignItems: 'flex-end', flex: '0 0 auto', cursor: 'pointer' }}>
              <span style={{ fontSize: 150, lineHeight: .7, fontWeight: 900, color: 'transparent', WebkitTextStroke: `2.5px ${accentSoft}`, marginRight: -8, userSelect: 'none' }}>{item.rank}</span>
              <VideoCard item={item} accent={accent} accentDeep={accentDeep} variant="top10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
