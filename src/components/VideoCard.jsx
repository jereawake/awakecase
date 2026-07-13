import { useRef } from 'react';

function seekPoster(e) {
  const v = e.target;
  v.muted = true;
  if (!v.dataset.seeked) {
    v.dataset.seeked = '1';
    try {
      v.currentTime = Math.min((v.duration || 6) * 0.4, 5);
    } catch (_) {}
  }
}

export function cardEnter(e) {
  const v = e.currentTarget.querySelector('video');
  if (v) {
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }
}

export function cardLeave(e) {
  const v = e.currentTarget.querySelector('video');
  if (v) {
    try { v.pause(); } catch (_) {}
  }
}

export function LikeButton({ item, liked, onLike, size = 'sm' }) {
  const dims = size === 'sm' ? { pad: '4px 8px', font: 10, icon: 12 } : { pad: '8px 14px', font: 13, icon: 16 };
  return (
    <div
      onClick={(e) => { e.stopPropagation(); if (!liked) onLike?.(item.id); }}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: 'rgba(1,16,34,.55)', backdropFilter: 'blur(4px)',
        borderRadius: 999, padding: dims.pad, cursor: liked ? 'default' : 'pointer',
        color: liked ? '#ff6b81' : '#fff',
      }}
    >
      <svg width={dims.icon} height={dims.icon} viewBox="0 0 24 24" fill={liked ? '#ff6b81' : 'none'} stroke={liked ? '#ff6b81' : '#fff'} strokeWidth="2">
        <path d="M12 21s-6.5-4.35-9.3-8.1C.6 10 1.4 6 4.9 4.7 7 4 9.4 4.7 12 7.4 14.6 4.7 17 4 19.1 4.7 22.6 6 23.4 10 21.3 12.9 18.5 16.65 12 21 12 21z" />
      </svg>
      <span style={{ fontSize: dims.font, fontWeight: 700 }}>{item.likes || 0}</span>
    </div>
  );
}

export default function VideoCard({ item, accent, accentDeep, onOpen, variant = 'row', liked, onLike }) {
  const ref = useRef(null);

  if (variant === 'top10') {
    return (
      <div
        ref={ref}
        className="awk-card"
        onMouseEnter={cardEnter}
        onMouseLeave={cardLeave}
        style={{ position: 'relative', width: 172, aspectRatio: '9/13', borderRadius: 7, overflow: 'hidden', background: '#012142' }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg,${accentDeep} 0%,#012142 60%)` }} />
        <video className="awk-vid" src={item.src} muted playsInline preload="metadata" onLoadedMetadata={seekPoster}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 8, right: 8 }}><LikeButton item={item} liked={liked} onLike={onLike} /></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(1,16,34,.94) 4%,rgba(1,16,34,0) 58%)', display: 'flex', alignItems: 'flex-end', padding: 14 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: accent }}>{item.tag}</div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.15, marginTop: 4 }}>{item.title}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'search' || variant === 'related') {
    const aspect = variant === 'search' ? '16/9' : '16/9';
    return (
      <div
        className="awk-card"
        onMouseEnter={cardEnter}
        onMouseLeave={cardLeave}
        onClick={() => onOpen(item)}
        style={{ position: 'relative', aspectRatio: aspect, borderRadius: variant === 'search' ? 8 : 7, overflow: 'hidden', cursor: 'pointer', background: '#012142' }}
      >
        {variant === 'related' && (
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${accentDeep},#012142)` }} />
        )}
        <video className="awk-vid" src={item.src} muted playsInline preload="metadata" onLoadedMetadata={seekPoster}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: variant === 'search' ? .92 : 1 }} />
        <div style={{ position: 'absolute', top: 8, right: 8 }}><LikeButton item={item} liked={liked} onLike={onLike} /></div>
        {variant === 'search' ? (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(1,16,34,.92) 6%,rgba(1,16,34,0) 55%)' }} />
            <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: accent }}>{item.tag}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 3 }}>{item.title}</div>
            </div>
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(1,16,34,.9),transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: 11 }}>
            <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{item.title}</span>
          </div>
        )}
      </div>
    );
  }

  // default: category row card
  return (
    <div
      className="awk-card"
      onMouseEnter={cardEnter}
      onMouseLeave={cardLeave}
      onClick={() => onOpen(item)}
      style={{ position: 'relative', flex: '0 0 auto', width: 308, aspectRatio: '16/9', borderRadius: 7, overflow: 'hidden', cursor: 'pointer', background: '#012142' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${accentDeep} 0%,#01264C 55%,#012142 100%)` }} />
      <video className="awk-vid" src={item.src} muted playsInline preload="metadata" onLoadedMetadata={seekPoster}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: 12, left: 12, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: accent, background: 'rgba(1,16,34,.5)', padding: '4px 8px', borderRadius: 5, backdropFilter: 'blur(4px)' }}>{item.tag}</div>
      <div style={{ position: 'absolute', top: 10, right: 10 }}><LikeButton item={item} liked={liked} onLike={onLike} /></div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(1,16,34,.94) 0%,rgba(1,16,34,0) 52%)' }} />
      <div className="awk-cardmeta" style={{ position: 'absolute', left: 14, right: 14, bottom: 13, opacity: 0, transform: 'translateY(8px)', transition: 'opacity .3s,transform .3s' }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.15 }}>{item.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: '#011024', fontWeight: 700, fontSize: 11, padding: '5px 12px', borderRadius: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#011024"><path d="M7 5v14l11-7z" /></svg>Ver
          </span>
          <span style={{ fontSize: 11.5, color: '#B9C9DC' }}>{item.title2}</span>
        </div>
      </div>
    </div>
  );
}
