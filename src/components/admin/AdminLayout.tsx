import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

const PAGE_TITLES: [string, string][] = [
  ['/admin/diagnosticos', 'Diagnósticos'],
  ['/admin/diagnostico', 'Diagnóstico'],
  ['/admin/dashboard', 'Dashboard'],
  ['/admin/projetos', 'Projetos'],
  ['/admin/mensagens', 'Mensagens'],
  ['/admin/analytics', 'Analytics'],
  ['/admin/configuracoes', 'Configurações'],
];

function getTitle(pathname: string): string {
  const sorted = [...PAGE_TITLES].sort((a, b) => b[0].length - a[0].length);
  return sorted.find(([key]) => pathname.startsWith(key))?.[1] ?? 'Admin';
}

export function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-body">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{getTitle(pathname)}</h1>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
