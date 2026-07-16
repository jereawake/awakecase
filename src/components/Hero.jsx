import { useEffect, useRef } from 'react';
import { LikeButton } from './VideoCard';

export default function Hero({ items: heroItems, heroIdx, accent, onOpen, onSetHero, likedIds, onLike }) {
  const heroARef = useRef(null);
  const heroBRef = useRef(null);
  const textRef = useRef(null);
  const frontRef = useRef('A');
  const prevIdxRef = useRef(heroIdx);

  const item = heroItems[heroIdx];

  useEffect(() => {
    const A = heroARef.current;
    if (A && !A.src) {
      A.src = heroItems[heroIdx].src;
      frontRef.current = 'A';
      try {
        A.load();
        const p = A.play();
        if (p && p.catch) p.catch(() => {});
      } catch (_) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (prevIdxRef.current === heroIdx) return;
    prevIdxRef.current = heroIdx;

    const front = frontRef.current;
    const back = front === 'A' ? 'B' : 'A';
    const fEl = front === 'A' ? heroARef.current : heroBRef.current;
    const bEl = back === 'A' ? heroARef.current : heroBRef.current;
    if (!fEl || !bEl) return;

    bEl.src = heroItems[heroIdx].src;
    bEl.dataset.done = '';
    const swap = () => {
      if (bEl.dataset.done) return;
      bEl.dataset.done = '1';
      bEl.style.opacity = '1';
      fEl.style.opacity = '0';
      const p = bEl.play();
      if (p && p.catch) p.catch(() => {});
    };
    bEl.oncanplay = () => { swap(); bEl.oncanplay = null; };
    try { bEl.load(); } catch (_) {}
    const t = setTimeout(swap, 650);
    frontRef.current = back;

    const tEl = textRef.current;
    if (tEl) {
      tEl.style.animation = 'none';
      void tEl.offsetWidth;
      tEl.style.animation = 'awkUp .8s cubic-bezier(.2,.7,.2,1)';
    }

    return () => clearTimeout(t);
  }, [heroIdx]);

  return (
    <section style={{ position: 'relative', height: '88vh', minHeight: 600, width: '100%', overflow: 'hidden' }}>
      <video ref={heroARef} autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1, transition: 'opacity 1s ease' }} />
      <video ref={heroBRef} muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0, transition: 'opacity 1s ease' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(1,16,34,.96) 0%,rgba(1,16,34,.7) 34%,rgba(1,16,34,.15) 62%,rgba(1,16,34,.5) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,#010F22 2%,rgba(1,16,34,0) 32%)' }} />

      <div ref={textRef} style={{ position: 'absolute', left: 56, bottom: '15%', maxWidth: 600, animation: 'awkUp .7s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: accent }}>Destacado</span>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#4E7EA5' }} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#B9C9DC' }}>{item.tag}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(40px,5.4vw,74px)', lineHeight: .98, fontWeight: 900, letterSpacing: '-.03em', margin: '0 0 18px', color: '#fff', textWrap: 'balance' }}>{item.title}</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: '#DCE6F2', margin: '0 0 26px', maxWidth: 520 }}>{item.desc}</p>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div className="awk-btn" onClick={() => onOpen(item)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', color: '#011024', fontWeight: 700, fontSize: 15, padding: '13px 30px', borderRadius: 8, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#011024"><path d="M7 5v14l11-7z" /></svg>Reproducir
          </div>
          <div className="awk-btn" onClick={() => onOpen(item)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(114,163,196,.22)', backdropFilter: 'blur(8px)', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 26px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(114,163,196,.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>Más información
          </div>
          <LikeButton item={item} liked={likedIds?.has(item.id)} onLike={onLike} size="md" />
        </div>
      </div>

      <div style={{ position: 'absolute', right: 56, bottom: '15%', display: 'flex', alignItems: 'center', gap: 8 }}>
        {heroItems.map((it, i) => (
          <div
            key={it.id}
            onClick={() => onSetHero(i)}
            style={{ width: i === heroIdx ? 28 : 14, height: 4, borderRadius: 2, background: i === heroIdx ? accent : 'rgba(255,255,255,.35)', cursor: 'pointer', transition: 'all .3s' }}
          />
        ))}
      </div>
    </section>
  );
}
