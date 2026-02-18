import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useCreateBankAccount } from './hooks';

const schema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  bankName: z.string().min(2, 'Banco requerido'),
  accountNumber: z.string().min(4, 'Número de cuenta requerido'),
  currency: z.string().min(1, 'Moneda requerida')
});

type Form = z.infer<typeof schema>;

export const BankAccountNewPage = () => {
  const createBankAccount = useCreateBankAccount();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      bankName: '',
      accountNumber: '',
      currency: 'USD'
    }
  });

  const onSubmit = async (values: Form) => {
    await createBankAccount.mutateAsync(values);
    navigate('/app/bank-accounts');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Nueva cuenta bancaria</h1>
        <p className="text-xs text-slate-500">
          Registra una cuenta bancaria para poder asociar pagos y cobros.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Datos de la cuenta">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Nombre interno de la cuenta"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="Banco"
              {...register('bankName')}
              error={errors.bankName?.message}
            />
            <Input
              label="Número de cuenta"
              {...register('accountNumber')}
              error={errors.accountNumber?.message}
            />
            <Select
              label="Moneda"
              {...register('currency')}
              error={errors.currency?.message}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
            </Select>
          </div>
        </Card>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/app/bank-accounts')}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Guardar
          </Button>
        </div>
      </form>
    </div>
  );
};

