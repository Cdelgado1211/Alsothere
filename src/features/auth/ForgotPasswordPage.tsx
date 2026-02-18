import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('Correo inválido')
});

type Form = z.infer<typeof schema>;

export const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = () => {
    // TODO: Integrar con API real de recuperación
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-500/80 to-brand-600 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
        <div className="mb-3 flex justify-center">
          <img
            src="https://images.email-platform.com/venturestars/alsothere_logo.png"
            alt="Also There"
            className="h-8 w-auto"
          />
        </div>
        <h1 className="mb-2 text-lg font-semibold text-slate-900">Recuperar contraseña</h1>
        <p className="mb-4 text-xs text-slate-500">
          Ingresa tu correo y, una vez integrado el backend, te enviaremos un enlace de
          recuperación.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Button type="submit" className="w-full">
            Enviar instrucciones
          </Button>
          {isSubmitSuccessful && (
            <p className="text-xs text-emerald-400">
              Petición registrada (mock). Integra API real para envío.
            </p>
          )}
        </form>
        <div className="mt-4 text-xs text-slate-500">
          <Link to="/login" className="hover:text-slate-700">
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
};
