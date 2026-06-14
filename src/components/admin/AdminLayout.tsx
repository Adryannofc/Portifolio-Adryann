import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { supabase } from '../../lib/supabase';

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

function formatDate() {
  const d = new Date();
  const days = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function AdminLayout() {
  const { pathname } = useLocation();
  const [diagCount, setDiagCount] = useState<number | undefined>(undefined);

  useEffect(() => {
    supabase
      .from('diagnosticos')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count != null) setDiagCount(count);
      });
  }, []);

  return (
    <div className="admin-shell">
      <AdminSidebar diagCount={diagCount} />
      <div className="admin-body">
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{getTitle(pathname)}</h1>
          <div className="topbar-right">
            <span className="topbar-date">{formatDate()}</span>
          </div>
        </header>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
