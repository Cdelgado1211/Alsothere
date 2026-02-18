import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { mockLogin, useSessionStore } from '../../app/store/sessionStore';

const schema = z.object({
  companyName: z.string().min(2, 'Nombre requerido'),
  taxId: z.string().min(3, 'RFC/NIF requerido'),
  adminName: z.string().min(2, 'Nombre requerido'),
  email: z.string().email('Correo inválido')
});

type Form = z.infer<typeof schema>;

export const RegisterCompanyPage = () => {
  const navigate = useNavigate();
  const setSession = useSessionStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = (data: Form) => {
    // TODO: registrar empresa en backend real
    const session = mockLogin(data.email);
    setSession({ ...session, companyName: data.companyName });
    navigate('/app/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-card">
        <h1 className="mb-2 text-lg font-semibold text-slate-50">Registrar empresa</h1>
        <p className="mb-4 text-xs text-slate-400">
          Crea una empresa demo. En un backend real se enviarían invitaciones y se
          configurarían tenants.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input
            label="Nombre de la empresa"
            {...register('companyName')}
            error={errors.companyName?.message}
          />
          <Input label="RFC / NIF" {...register('taxId')} error={errors.taxId?.message} />
          <Input
            label="Nombre del administrador"
            {...register('adminName')}
            error={errors.adminName?.message}
          />
          <Input label="Correo" type="email" {...register('email')} error={errors.email?.message} />
          <Button type="submit" className="w-full">
            Crear empresa
          </Button>
        </form>
        <div className="mt-4 text-xs text-slate-400">
          <Link to="/login" className="hover:text-slate-200">
            Ya tengo una cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

