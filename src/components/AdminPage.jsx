import { useEffect, useState } from 'react';
import { rowMeta } from '../data';
import { login, listExtraVideos, addVideo, deleteVideo } from '../lib/adminApi';

const ACCENT = '#19F7F1';
const SESSION_KEY = 'awk_admin_pw';

const inputStyle = {
  width: '100%', background: '#011526', border: '1px solid rgba(114,163,196,.28)', borderRadius: 9,
  padding: '12px 13px', color: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none',
};
const labelStyle = { fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8FA6C2', marginBottom: 7, display: 'block' };

const TAG_OPTIONS = ['Curso', 'Intro', 'Brand film', 'Evento', 'Anuncio', 'Otro'];

const emptyForm = { title: '', title2: '', tag: '', cat: '', desc: '', src: '' };

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [extra, setExtra] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (!saved) { setChecking(false); return; }
    login(saved)
      .then((ok) => {
        if (ok) { setPassword(saved); setAuthed(true); }
        else sessionStorage.removeItem(SESSION_KEY);
      })
      .catch(() => sessionStorage.removeItem(SESSION_KEY))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoadingList(true);
    listExtraVideos().then(setExtra).catch(() => {}).finally(() => setLoadingList(false));
  }, [authed]);

  const submitLogin = async () => {
    setLoginError('');
    try {
      const ok = await login(password);
      if (!ok) { setLoginError('Contraseña incorrecta.'); return; }
      sessionStorage.setItem(SESSION_KEY, password);
      setAuthed(true);
    } catch (e) {
      setLoginError(e.message);
    }
  };

  const submitVideo = async () => {
    setFormError('');
    setFormSuccess('');
    if (!form.title || !form.tag || !form.cat || !form.src) {
      setFormError('Completa los campos marcados con *');
      return;
    }
    if (!/^https?:\/\//i.test(form.src.trim())) {
      setFormError('La URL del video debe empezar con http:// o https://');
      return;
    }
    setBusy(true);
    try {
      const item = await addVideo(password, form);
      setExtra((prev) => [...prev, item]);
      setForm(emptyForm);
      setFormSuccess('Video agregado. Ya aparece en la web.');
    } catch (e) {
      setFormError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const removeVideo = async (id) => {
    try {
      await deleteVideo(password, id);
      setExtra((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      setFormError(e.message);
    }
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: 'min(380px,100%)', background: '#02182f', border: '1px solid rgba(114,163,196,.18)', borderRadius: 16, padding: '34px 30px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>Awakelab Studio</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 20px', color: '#fff' }}>Panel de administración</h1>
          <label style={labelStyle}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitLogin()}
            style={inputStyle}
          />
          {loginError && <div style={{ color: '#ff9090', fontSize: 13, marginTop: 12 }}>{loginError}</div>}
          <div className="awk-btn" onClick={submitLogin} style={{ marginTop: 18, background: ACCENT, color: '#011024', fontWeight: 700, fontSize: 15, padding: '13px 0', borderRadius: 10, cursor: 'pointer', textAlign: 'center' }}>Entrar</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px', maxWidth: 760, margin: '0 auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>Awakelab Studio</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>Panel de administración</h1>
      <p style={{ fontSize: 13.5, color: '#9FB4CC', margin: '0 0 32px' }}>Agrega videos ya subidos a video-manager.awakelab.world para que aparezcan en la web.</p>

      <div style={{ background: '#02182f', border: '1px solid rgba(114,163,196,.18)', borderRadius: 16, padding: '26px 28px', marginBottom: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 18px', color: '#fff' }}>Agregar video</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Título *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ej. Nombre del video" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Subtítulo</label>
            <input value={form.title2} onChange={(e) => setForm({ ...form, title2: e.target.value })} placeholder="Ej. Módulo 2 · Sincrónico" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Etiqueta *</label>
            <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecciona…</option>
              {TAG_OPTIONS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Fila / categoría *</label>
            <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Selecciona…</option>
              {rowMeta.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>Descripción</label>
          <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="Descripción breve del video" style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={labelStyle}>URL del video (video-manager.awakelab.world) *</label>
          <input value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} placeholder="https://video-manager.awakelab.world/…" style={inputStyle} />
        </div>
        {formError && <div style={{ color: '#ff9090', fontSize: 13, marginTop: 14 }}>{formError}</div>}
        {formSuccess && <div style={{ color: ACCENT, fontSize: 13, marginTop: 14 }}>{formSuccess}</div>}
        <div className="awk-btn" onClick={busy ? undefined : submitVideo} style={{ marginTop: 20, background: ACCENT, color: '#011024', fontWeight: 700, fontSize: 15, padding: '14px 0', borderRadius: 10, cursor: busy ? 'default' : 'pointer', textAlign: 'center', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Agregando…' : 'Agregar video'}
        </div>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 14px', color: '#fff' }}>Videos agregados ({extra.length})</h2>
      {loadingList && <div style={{ color: '#72A3C4', fontSize: 14 }}>Cargando…</div>}
      {!loadingList && extra.length === 0 && <div style={{ color: '#72A3C4', fontSize: 14 }}>Todavía no agregaste videos desde este panel.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {extra.map((v) => (
          <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#011830', border: '1px solid rgba(114,163,196,.15)', borderRadius: 10, padding: '12px 16px' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{v.title}</div>
              <div style={{ fontSize: 12, color: '#72A3C4' }}>{v.tag} · {rowMeta.find((r) => r.key === v.cat)?.label || v.cat}</div>
            </div>
            <div className="awk-btn" onClick={() => removeVideo(v.id)} style={{ fontSize: 12, fontWeight: 600, color: '#ff9090', border: '1px solid rgba(255,144,144,.35)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', flexShrink: 0 }}>
              Borrar
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
