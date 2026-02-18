import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { TenantSwitcher } from '../../features/tenants/TenantSwitcher';
import { Button } from '../ui/Button';

export const Topbar = () => {
  const session = useSessionStore((s) => s.session);
  const setSession = useSessionStore((s) => s.setSession);
  const navigate = useNavigate();

  const handleLogout = () => {
    setSession(null);
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex flex-1 items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-500">
          <span className="mr-2 text-slate-400">🔎</span>
          <input
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            placeholder="Buscar clientes, facturas, proveedores..."
          />
        </div>
      </div>
      <div className="ml-4 flex items-center gap-4">
        <TenantSwitcher />
        {session && (
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">
            <span className="mr-2 h-7 w-7 rounded-full bg-brand-500 text-center text-[11px] leading-7 text-white">
              {session.user.name
                .split(' ')
                .map((s) => s[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-slate-900">{session.user.name}</span>
              <span className="text-[11px] text-slate-500">Admin Finance</span>
            </div>
            </div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-[11px]"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
