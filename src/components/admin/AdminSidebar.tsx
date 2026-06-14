import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  diagCount?: number;
}

const IconDashboard = () => (
  <svg className="nav-icon" viewBox="0 0 14 14" fill="none">
    <rect x="1.5" y="1.5" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8" y="1.5" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="1.5" y="8" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="8" y="8" width="4.5" height="4.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IconList = () => (
  <svg className="nav-icon" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5h10M2 7h7M2 10.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"/>
  </svg>
);
const IconProjects = () => (
  <svg className="nav-icon" viewBox="0 0 14 14" fill="none">
    <path d="M2 1.5h10v10H2z" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 1.5v10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"/>
  </svg>
);
const IconMessages = () => (
  <svg className="nav-icon" viewBox="0 0 14 14" fill="none">
    <path d="M1.5 2h11v8H8l-2 2-2-2H1.5z" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IconAnalytics = () => (
  <svg className="nav-icon" viewBox="0 0 14 14" fill="none">
    <path d="M2 11L5 7L7.5 9.5L10 5L12 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" strokeLinejoin="miter" fill="none"/>
  </svg>
);
const IconSettings = () => (
  <svg className="nav-icon" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7 1.5v1.5M7 11v1.5M1.5 7H3M11 7h1.5M3.4 3.4l1 1M9.6 9.6l1 1M3.4 10.6l1-1M9.6 4.4l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square"/>
  </svg>
);

export function AdminSidebar({ diagCount }: Props) {
  const { user, signOut } = useAuth();
  const { pathname } = useLocation();

  const isDiagActive =
    pathname === '/admin/diagnosticos' ||
    pathname.startsWith('/admin/diagnostico/');

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-sidebar-logo">
          <strong>DIAG</strong>
          <span className="admin-sidebar-sep">/</span>
          {' CMS'}
        </div>
        <div className="sb-pulse" />
      </div>

      <nav className="admin-sidebar-nav">
        <div className="admin-nav-group">
          <span className="admin-nav-label">Principal</span>

          <NavLink
            to="/admin/dashboard"
            end
            className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
          >
            <span className="nav-left">
              <IconDashboard />
              <span>Dashboard</span>
            </span>
          </NavLink>

          <NavLink
            to="/admin/diagnosticos"
            className={() => `admin-nav-link${isDiagActive ? ' is-active' : ''}`}
          >
            <span className="nav-left">
              <IconList />
              <span>Diagnósticos</span>
            </span>
            {diagCount != null && diagCount > 0 && (
              <span className="notif-dot">{diagCount > 9 ? '9+' : diagCount}</span>
            )}
          </NavLink>
        </div>

        <div className="admin-nav-group">
          <span className="admin-nav-label">Em Breve</span>
          <span className="admin-nav-link admin-nav-link--soon">
            <span className="nav-left"><IconProjects /><span>Projetos</span></span>
            <span className="soon-tag">soon</span>
          </span>
          <span className="admin-nav-link admin-nav-link--soon">
            <span className="nav-left"><IconMessages /><span>Mensagens</span></span>
            <span className="soon-tag">soon</span>
          </span>
          <span className="admin-nav-link admin-nav-link--soon">
            <span className="nav-left"><IconAnalytics /><span>Analytics</span></span>
            <span className="soon-tag">soon</span>
          </span>
        </div>

        <div className="admin-nav-group">
          <span className="admin-nav-label">Sistema</span>
          <span className="admin-nav-link admin-nav-link--soon">
            <span className="nav-left"><IconSettings /><span>Configurações</span></span>
            <span className="soon-tag">soon</span>
          </span>
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <span className="admin-sidebar-email">{user?.email}</span>
        <button className="sb-sair" onClick={() => signOut()}>Sair</button>
      </div>
    </aside>
  );
}
