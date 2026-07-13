import { useEffect, useState } from 'react';
import { rowMeta } from '../data';
import { login, listVideos, addVideo, editVideo, deleteVideo } from '../lib/videosApi';

const ACCENT = '#19F7F1';
const SESSION_KEY = 'awk_admin_pw';
const MAX_HERO = 5;

const inputStyle = {
  width: '100%', background: '#011526', border: '1px solid rgba(114,163,196,.28)', borderRadius: 9,
  padding: '12px 13px', color: '#fff', fontFamily: 'inherit', fontSize: 14, outline: 'none',
};
const labelStyle = { fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: '#8FA6C2', marginBottom: 7, display: 'block' };

const TAG_OPTIONS = ['Curso', 'Intro', 'Brand film', 'Evento', 'Anuncio', 'Otro'];
const emptyForm = { title: '', title2: '', tag: '', cat: '', desc: '', src: '' };

function StarButton({ video, disabled, onToggle }) {
  const active = video.heroFeatured;
  return (
    <div
      onClick={() => onToggle(video)}
      title={active ? 'Quitar del hero' : disabled ? `Ya hay ${MAX_HERO} videos en el hero` : 'Destacar en el hero'}
      style={{
        width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled && !active ? 'not-allowed' : 'pointer', flexShrink: 0,
        background: active ? 'rgba(25,247,241,.16)' : 'rgba(114,163,196,.12)',
        opacity: disabled && !active ? 0.4 : 1,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? ACCENT : 'none'} stroke={active ? ACCENT : '#8FA6C2'} strokeWidth="1.8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    </div>
  );
}

function EditForm({ video, onSave, onCancel }) {
  const [form, setForm] = useState({ title: video.title, title2: video.title2 || '', tag: video.tag, desc: video.desc || '', src: video.src });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!form.title || !form.tag || !form.src) {
      setError('Completa título, etiqueta y URL.');
      return;
    }
    if (!/^https?:\/\//i.test(form.src.trim())) {
      setError('La URL del video debe empezar con http:// o https://');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSave(form);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 10, padding: 14, background: '#011526', borderRadius: 10, border: '1px solid rgba(114,163,196,.18)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <label style={labelStyle}>Título</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Subtítulo</label>
          <input value={form.title2} onChange={(e) => setForm({ ...form, title2: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Etiqueta</label>
          <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
            {TAG_OPTIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>URL del video</label>
          <input value={form.src} onChange={(e) => setForm({ ...form, src: e.target.value })} style={inputStyle} />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={labelStyle}>Descripción</label>
        <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} />
      </div>
      {error && <div style={{ color: '#ff9090', fontSize: 13, marginTop: 10 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <div className="awk-btn" onClick={busy ? undefined : save} style={{ background: ACCENT, color: '#011024', fontWeight: 700, fontSize: 13, padding: '9px 16px', borderRadius: 8, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.6 : 1 }}>
          {busy ? 'Guardando…' : 'Guardar'}
        </div>
        <div className="awk-btn" onClick={onCancel} style={{ background: 'rgba(114,163,196,.16)', color: '#fff', fontWeight: 600, fontSize: 13, padding: '9px 16px', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(114,163,196,.3)' }}>
          Cancelar
        </div>
      </div>
    </div>
  );
}

function VideoRow({ video, disabledStar, onDragStart, onToggleStar, onDelete, editing, onStartEdit, onCancelEdit, onSaveEdit }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, video.id)}
      style={{ background: '#011830', border: '1px solid rgba(114,163,196,.15)', borderRadius: 10, padding: '12px 14px', cursor: 'grab' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <StarButton video={video} disabled={disabledStar} onToggle={onToggleStar} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</div>
            <div style={{ fontSize: 12, color: '#72A3C4' }}>{video.tag} · {video.likes || 0} likes</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <div className="awk-btn" onClick={() => onStartEdit(video.id)} style={{ fontSize: 12, fontWeight: 600, color: '#B9C9DC', border: '1px solid rgba(114,163,196,.3)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>Editar</div>
          <div className="awk-btn" onClick={() => onDelete(video.id)} style={{ fontSize: 12, fontWeight: 600, color: '#ff9090', border: '1px solid rgba(255,144,144,.35)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer' }}>Borrar</div>
        </div>
      </div>
      {editing && <EditForm video={video} onSave={(form) => onSaveEdit(video.id, form)} onCancel={onCancelEdit} />}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginError, setLoginError] = useState('');

  const [videos, setVideos] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [dragOverCat, setDragOverCat] = useState(null);

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
    listVideos().then(setVideos).catch((e) => setListError(e.message)).finally(() => setLoadingList(false));
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

  const heroCount = videos.filter((v) => v.heroFeatured).length;
  const heroList = videos.filter((v) => v.heroFeatured).sort((a, b) => (a.heroOrder || 0) - (b.heroOrder || 0));

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
      setVideos((prev) => [...prev, item]);
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
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      setListError(e.message);
    }
  };

  const toggleStar = async (video) => {
    setListError('');
    if (!video.heroFeatured && heroCount >= MAX_HERO) {
      setListError(`Ya hay ${MAX_HERO} videos en el hero. Quita uno antes de agregar otro.`);
      return;
    }
    try {
      const updated = await editVideo(password, video.id, { heroFeatured: !video.heroFeatured });
      setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
    } catch (e) {
      setListError(e.message);
    }
  };

  const saveEdit = async (id, fields) => {
    const updated = await editVideo(password, id, fields);
    setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    setEditingId(null);
  };

  const moveToCategory = async (id, cat) => {
    const video = videos.find((v) => v.id === id);
    if (!video || video.cat === cat) return;
    try {
      const updated = await editVideo(password, id, { cat });
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    } catch (e) {
      setListError(e.message);
    }
  };

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
  };
  const onDropOnCat = (e, catKey) => {
    e.preventDefault();
    setDragOverCat(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) moveToCategory(id, catKey);
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
    <div style={{ minHeight: '100vh', padding: '48px 24px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8 }}>Awakelab Studio</div>
      <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>Panel de administración</h1>
      <p style={{ fontSize: 13.5, color: '#9FB4CC', margin: '0 0 28px' }}>Agregá, editá y organizá los videos del catálogo. Arrastrá un video a otra categoría para moverlo.</p>

      {listError && <div style={{ color: '#ff9090', fontSize: 13, marginBottom: 16 }}>{listError}</div>}

      {/* Hero lineup */}
      <div style={{ background: '#02182f', border: '1px solid rgba(114,163,196,.18)', borderRadius: 16, padding: '22px 24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#fff' }}>Hero destacados</h2>
          <span style={{ fontSize: 12, color: '#72A3C4' }}>{heroCount}/{MAX_HERO}</span>
        </div>
        <p style={{ fontSize: 12.5, color: '#72A3C4', margin: '0 0 14px' }}>Tocá la estrella ★ en cualquier video para sumarlo aquí. Se muestran en el orden en que los marcaste.</p>
        {heroList.length === 0 ? (
          <div style={{ color: '#72A3C4', fontSize: 13.5 }}>Ningún video destacado todavía.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {heroList.map((v, i) => (
              <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#011830', borderRadius: 8, padding: '9px 12px' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT, width: 18 }}>{i + 1}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{v.title}</span>
                <div className="awk-btn" onClick={() => toggleStar(v)} style={{ fontSize: 11.5, fontWeight: 600, color: '#ff9090', cursor: 'pointer' }}>Quitar</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add video form */}
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

      {/* Category sections */}
      {loadingList && <div style={{ color: '#72A3C4', fontSize: 14 }}>Cargando…</div>}
      {!loadingList && rowMeta.map((row) => {
        const items = videos.filter((v) => v.cat === row.key);
        const isDragOver = dragOverCat === row.key;
        return (
          <div
            key={row.key}
            onDragOver={(e) => { e.preventDefault(); setDragOverCat(row.key); }}
            onDragLeave={() => setDragOverCat((c) => (c === row.key ? null : c))}
            onDrop={(e) => onDropOnCat(e, row.key)}
            style={{
              marginBottom: 24, padding: 16, borderRadius: 14,
              border: isDragOver ? `1.5px dashed ${ACCENT}` : '1.5px dashed transparent',
              background: isDragOver ? 'rgba(25,247,241,.05)' : 'transparent',
              transition: 'background .15s, border-color .15s',
            }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 12px', color: '#fff' }}>{row.label} <span style={{ fontSize: 12, color: '#72A3C4', fontWeight: 500 }}>({items.length})</span></h2>
            {items.length === 0 ? (
              <div style={{ color: '#72A3C4', fontSize: 13.5, padding: '10px 0' }}>Sin videos en esta categoría — arrastrá uno aquí.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.map((v) => (
                  <VideoRow
                    key={v.id}
                    video={v}
                    disabledStar={heroCount >= MAX_HERO && !v.heroFeatured}
                    onDragStart={onDragStart}
                    onToggleStar={() => toggleStar(v)}
                    onDelete={removeVideo}
                    editing={editingId === v.id}
                    onStartEdit={setEditingId}
                    onCancelEdit={() => setEditingId(null)}
                    onSaveEdit={saveEdit}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
