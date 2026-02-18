import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSessionStore } from './store/sessionStore';

interface Props {
  children: ReactNode;
}

export const RequireAuth = ({ children }: Props) => {
  const session = useSessionStore((s) => s.session);
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

