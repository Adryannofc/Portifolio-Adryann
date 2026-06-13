import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="admin-loading"><span>verificando sessão...</span></div>;
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
