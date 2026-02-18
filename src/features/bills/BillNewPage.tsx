import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSessionStore } from '../../app/store/sessionStore';
import { billService } from '../../services/billService';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  vendorInvoiceNumber: z.string().min(1),
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  vendorId: z.string().min(1),
  total: z.coerce.number().min(0)
});

type Form = z.infer<typeof schema>;

export const BillNewPage = () => {
  const session = useSessionStore((s) => s.session);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10)
    }
  });

  if (!session) return null;

  const onSubmit = (data: Form) => {
    billService.create(session.tenantId, {
      ...data,
      status: 'pending',
      companyId: session.tenantId,
      id: ''
    });
    navigate('/app/bills');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-50">Nueva factura proveedor</h1>
        <p className="text-xs text-slate-400">
          Captura básica para registrar una cuenta por pagar.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Datos generales">
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              label="Número de factura proveedor"
              {...register('vendorInvoiceNumber')}
              error={errors.vendorInvoiceNumber?.message}
            />
            <Input
              label="Fecha de emisión"
              type="date"
              {...register('issueDate')}
              error={errors.issueDate?.message}
            />
            <Input
              label="Fecha de vencimiento"
              type="date"
              {...register('dueDate')}
              error={errors.dueDate?.message}
            />
            <Input
              label="Proveedor (ID mock)"
              {...register('vendorId')}
              error={errors.vendorId?.message}
            />
            <Input
              label="Total"
              type="number"
              step="0.01"
              {...register('total', { valueAsNumber: true })}
              error={errors.total?.message}
            />
          </div>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/app/bills')}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </div>
  );
};

