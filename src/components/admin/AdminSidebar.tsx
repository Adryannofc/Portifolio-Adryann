import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAV_MAIN = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/diagnosticos', label: 'Diagnósticos', end: false },
];

const NAV_SOON = [
  { to: '/admin/projetos', label: 'Projetos' },
  { to: '/admin/mensagens', label: 'Mensagens' },
  { to: '/admin/analytics', label: 'Analytics' },
];

const NAV_SYSTEM = [
  { to: '/admin/configuracoes', label: 'Configurações' },
];

export function AdminSidebar() {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-logo">DIAG</span>
        <span className="admin-sidebar-sep">/</span>
        <span className="admin-sidebar-system">CMS</span>
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-nav-group">
          <span className="admin-nav-label">Principal</span>
          {NAV_MAIN.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => {
                const active =
                  isActive ||
                  (item.to === '/admin/diagnosticos' &&
                    pathname.startsWith('/admin/diagnostico/'));
                return `admin-nav-link${active ? ' is-active' : ''}`;
              }}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="admin-nav-group">
          <span className="admin-nav-label">Em breve</span>
          {NAV_SOON.map(item => (
            <span key={item.to} className="admin-nav-link admin-nav-link--soon">
              {item.label}
              <span className="admin-nav-badge">Soon</span>
            </span>
          ))}
        </div>

        <div className="admin-nav-group">
          <span className="admin-nav-label">Sistema</span>
          {NAV_SYSTEM.map(item => (
            <span key={item.to} className="admin-nav-link admin-nav-link--soon">
              {item.label}
              <span className="admin-nav-badge">Soon</span>
            </span>
          ))}
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <span className="admin-sidebar-email">{user?.email}</span>
        <button className="admin-btn admin-btn-sm" onClick={() => signOut()}>
          Sair
        </button>
      </div>
    </aside>
  );
}
