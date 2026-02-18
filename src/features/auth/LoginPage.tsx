import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSessionStore, mockLogin } from '../../app/store/sessionStore';

type LoginForm = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useSessionStore((s) => s.setSession);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: LoginForm) => {
    setError(null);
    const session = mockLogin(data.email);
    setSession(session);
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/app/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-card">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-xl font-bold">
            AT
          </div>
          <h1 className="text-lg font-semibold text-slate-50">Also There Admin</h1>
          <p className="text-xs text-slate-400">
            Inicia sesión para gestionar clientes, facturas y cuentas.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            {...register('email')}
          />
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Entrar
          </Button>
        </form>
        <div className="mt-4 flex justify-between text-xs text-slate-400">
          <Link to="/forgot-password" className="hover:text-slate-200">
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/register-company" className="hover:text-slate-200">
            Registrar nueva empresa
          </Link>
        </div>
      </div>
    </div>
  );
};
