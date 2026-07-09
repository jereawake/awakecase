import { useRef, useState } from 'react';
import { buildFormsPrefillUrl } from '../lib/msFormsUrl';

const inputStyle = {
  width: '100%', background: '#011526', border: '1px solid rgba(114,163,196,.28)', borderRadius: 9,
  padding: '12px 13px', color: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none',
};
const labelStyle = { fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8FA6C2', marginBottom: 7, display: 'block' };

export default function RequestModal({ accent, onClose }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [formsUrl, setFormsUrl] = useState('');
  const nombreRef = useRef(null);
  const emailRef = useRef(null);
  const equipoRef = useRef(null);
  const tipoRef = useRef(null);
  const duracionRef = useRef(null);
  const fechaRef = useRef(null);
  const objetivoRef = useRef(null);
  const refRef = useRef(null);

  const backdropClick = (e) => {
    if (!e.target.closest('[data-stop]')) onClose();
  };

  const submit = () => {
    const nombre = (nombreRef.current?.value || '').trim();
    const email = (emailRef.current?.value || '').trim();
    const equipo = (equipoRef.current?.value || '').trim();
    const tipo = (tipoRef.current?.value || '').trim();
    const duracion = (duracionRef.current?.value || '').trim();
    const fecha = (fechaRef.current?.value || '').trim();
    const objetivo = (objetivoRef.current?.value || '').trim();
    const referencias = (refRef.current?.value || '').trim();

    if (!nombre || !email || !tipo || !objetivo) {
      setError('Completa los campos marcados con *');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Ingresa un email válido');
      return;
    }

    const url = buildFormsPrefillUrl({ nombre, email, equipo, tipo, duracion, fecha, objetivo, referencias });
    window.open(url, '_blank', 'noopener');
    setFormsUrl(url);
    setError('');
    setSent(true);
  };

  return (
    <div onClick={backdropClick} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(1,8,18,.86)', backdropFilter: 'blur(7px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '44px 20px', animation: 'awkFade .25s' }}>
      <div data-stop="1" style={{ width: 'min(680px,100%)', background: '#02182f', border: '1px solid rgba(114,163,196,.18)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,.7)', animation: 'awkUp .35s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ position: 'relative', padding: '30px 34px 24px', background: 'radial-gradient(130% 170% at 8% 0%, #01406e 0%, #02182f 62%)' }}>
          <div onClick={onClose} className="awk-btn" style={{ position: 'absolute', top: 18, right: 18, width: 36, height: 36, borderRadius: '50%', background: 'rgba(1,16,34,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 8 }}>Solicita tu video</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0, color: '#fff' }}>Cuéntanos tu idea</h2>
          <p style={{ fontSize: 13.5, color: '#9FB4CC', margin: '8px 0 0' }}>Completa el formulario y nuestro equipo te contactará para producirlo.</p>
        </div>

        {sent ? (
          <div style={{ padding: '48px 34px 54px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(25,247,241,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.6"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: '#fff' }}>Un paso más</h3>
            <p style={{ fontSize: 14, color: '#B9C9DC', margin: '0 auto 12px', maxWidth: 420 }}>Abrimos el formulario de Microsoft en una pestaña nueva con tus datos precargados. Revisalos y hacé clic en <strong>Enviar</strong> ahí para completar tu solicitud.</p>
            <p style={{ fontSize: 13, margin: '0 auto 26px', maxWidth: 420 }}>
              ¿No se abrió? <a href={formsUrl} target="_blank" rel="noopener noreferrer">Abrí el formulario acá</a>.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <div className="awk-btn" onClick={() => { setSent(false); setError(''); }} style={{ background: 'rgba(114,163,196,.16)', color: '#fff', fontWeight: 600, fontSize: 14, padding: '11px 22px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(114,163,196,.3)' }}>Enviar otra</div>
              <div className="awk-btn" onClick={onClose} style={{ background: accent, color: '#011024', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 8, cursor: 'pointer' }}>Volver al inicio</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '26px 34px 34px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Nombre y apellido *</label>
                <input ref={nombreRef} placeholder="Tu nombre" className="awk-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input ref={emailRef} type="email" placeholder="tucorreo@empresa.com" className="awk-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Equipo o empresa</label>
                <input ref={equipoRef} placeholder="Ej. Marketing, WOM…" className="awk-input" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tipo de video *</label>
                <select ref={tipoRef} defaultValue="" className="awk-select" style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecciona…</option>
                  <option>Curso</option>
                  <option>Intro / bumper</option>
                  <option>Brand film</option>
                  <option>Anuncio</option>
                  <option>Evento</option>
                  <option>Otro</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Duración estimada</label>
                <select ref={duracionRef} defaultValue="" className="awk-select" style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="">Selecciona…</option>
                  <option>Menos de 30s</option>
                  <option>30–60s</option>
                  <option>1–3 min</option>
                  <option>Más de 3 min</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Fecha ideal de entrega</label>
                <input ref={fechaRef} type="date" className="awk-input" style={{ ...inputStyle, colorScheme: 'dark' }} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Objetivo del video *</label>
              <textarea ref={objetivoRef} rows={3} placeholder="¿Qué quieres lograr? ¿A quién va dirigido? Mensaje principal…" className="awk-textarea" style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelStyle}>Referencias o links (opcional)</label>
              <input ref={refRef} placeholder="Links a ejemplos que te gusten" className="awk-input" style={inputStyle} />
            </div>
            {error && <div style={{ color: '#ff9090', fontSize: 13, marginTop: 14 }}>{error}</div>}
            <div className="awk-btn" onClick={submit} style={{ marginTop: 22, background: accent, color: '#011024', fontWeight: 700, fontSize: 15, padding: '15px 0', borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>Enviar solicitud</div>
          </div>
        )}
      </div>
    </div>
  );
}
