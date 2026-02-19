import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { Button } from '../ui/Button';

export const Topbar = () => {
  const session = useSessionStore((s) => s.session);
  const setSession = useSessionStore((s) => s.setSession);
  const country = useSessionStore((s) => s.country);
  const setCountry = useSessionStore((s) => s.setCountry);
  const navigate = useNavigate();
  const [countryOpen, setCountryOpen] = useState(false);

  const countries: { code: typeof country; label: string; flag: string }[] = [
    { code: 'mx', label: 'México', flag: '🇲🇽' },
    { code: 'cl', label: 'Chile', flag: '🇨🇱' },
    { code: 'es', label: 'España', flag: '🇪🇸' },
    { code: 'ar', label: 'Argentina', flag: '🇦🇷' },
    { code: 'co', label: 'Colombia', flag: '🇨🇴' },
    { code: 've', label: 'Venezuela', flag: '🇻🇪' }
  ];

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
            <div className="relative">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg shadow-sm hover:bg-slate-50"
                onClick={() => setCountryOpen((open) => !open)}
              >
                <span aria-hidden="true">
                  {countries.find((c) => c.code === country)?.flag ?? '🌐'}
                </span>
                <span className="sr-only">Seleccionar país</span>
              </button>
              {countryOpen && (
                <div className="absolute right-0 mt-2 w-12 rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
                  <ul className="flex flex-col items-center gap-2">
                    {countries.map((c) => (
                      <li key={c.code}>
                        <button
                          type="button"
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-lg hover:bg-slate-100 ${
                            country === c.code ? 'ring-2 ring-brand-500 ring-offset-2' : ''
                          }`}
                          onClick={() => {
                            setCountry(c.code);
                            setCountryOpen(false);
                          }}
                          title={c.label}
                        >
                          {c.flag}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
