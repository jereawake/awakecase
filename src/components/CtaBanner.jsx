export default function CtaBanner({ accent, onOpenReq }) {
  return (
    <section style={{ position: 'relative', margin: '8px 56px 46px', borderRadius: 18, overflow: 'hidden', minHeight: 308, display: 'flex', alignItems: 'center', background: 'radial-gradient(135% 155% at 12% 12%, #01406e 0%, #012648 42%, #010F22 100%)' }}>
      <div style={{ position: 'absolute', right: -30, top: '50%', transform: 'translateY(-50%)', width: 360, height: 360, opacity: .10 }}>
        <img src="/assets/Version-blanca.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div style={{ position: 'absolute', right: '8%', top: '-32%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(25,247,241,.22),transparent 60%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,rgba(1,15,34,.6),transparent 66%)' }} />
      <div style={{ position: 'relative', padding: '54px 56px', maxWidth: 660 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: accent, marginBottom: 14 }}>Producción a medida</div>
        <h2 style={{ fontSize: 'clamp(32px,3.7vw,50px)', lineHeight: 1.02, fontWeight: 900, letterSpacing: '-.03em', margin: '0 0 15px', color: '#fff' }}>¿Tienes una idea?<br />Solicita tu próximo video</h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#C7D4E6', margin: '0 0 28px', maxWidth: 510 }}>Cursos, brand films, intros, anuncios o piezas a medida. Cuéntanos qué necesitas y nuestro equipo lo lleva de la idea a la pantalla.</p>
        <div className="awk-btn" onClick={onOpenReq} style={{ display: 'inline-flex', alignItems: 'center', gap: 11, background: accent, color: '#011024', fontWeight: 700, fontSize: 15, padding: '14px 30px', borderRadius: 10, cursor: 'pointer' }}>
          Solicitar un video
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#011024" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
    </section>
  );
}
