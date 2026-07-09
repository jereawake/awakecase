import { navItems } from '../data';

export default function Nav({ accent, navScrolled, query, onSearch, onGoHome, onNavTo }) {
  const searchWidth = query ? 260 : 210;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 56px', height: 68,
      transition: 'background .3s, border-color .3s',
      background: navScrolled ? 'rgba(1,15,34,.94)' : 'linear-gradient(180deg,rgba(1,8,18,.82),rgba(1,8,18,0))',
      backdropFilter: navScrolled ? 'blur(10px)' : 'none',
      borderBottom: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
        <div onClick={onGoHome} style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}>
          <img src="/assets/Version-blanca.png" alt="Awakelab" style={{ height: 38, width: 'auto', display: 'block', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-.02em', color: '#fff' }}>awakelab</span>
          <span style={{ fontWeight: 600, fontSize: 11, letterSpacing: '.24em', color: accent, textTransform: 'uppercase', paddingTop: 3 }}>Studio</span>
        </div>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
          {navItems.map((nav) => (
            <span
              key={nav.label}
              className="awk-navlink"
              onClick={() => (nav.target ? onNavTo(nav.target) : onGoHome())}
              style={{ fontSize: 13.5, fontWeight: 500, color: '#C7D4E6', cursor: 'pointer' }}
            >
              {nav.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{
          display: 'flex', alignItems: 'center', background: 'rgba(1,33,66,.7)',
          border: '1px solid rgba(114,163,196,.28)', borderRadius: 999, padding: '7px 14px', gap: 9,
          width: searchWidth, transition: 'width .3s',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8FA6C2" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar videos, cursos…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontFamily: 'inherit', fontSize: 13, width: '100%' }}
          />
        </div>
      </div>
    </nav>
  );
}
