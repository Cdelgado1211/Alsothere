import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useSessionStore } from '../../app/store/sessionStore';
import { useCreateInvoice } from './hooks';
import { useNavigate } from 'react-router-dom';

const itemSchema = z.object({
  description: z.string().min(1, 'Descripción requerida'),
  qty: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
  taxRate: z.coerce.number().min(0).max(1).optional()
});

const schema = z.object({
  issueDate: z.string().min(1),
  dueDate: z.string().min(1),
  customerId: z.string().min(1),
  items: z.array(itemSchema).min(1, 'Agrega al menos un concepto')
});

type Form = z.infer<typeof schema>;

export const InvoiceNewPage = () => {
  const session = useSessionStore((s) => s.session);
  const createInvoice = useCreateInvoice();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date().toISOString().slice(0, 10),
      customerId: '',
      items: [{ description: '', qty: 1, unitPrice: 0, taxRate: 0.16 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  if (!session) return null;

  const onSubmit = async (data: Form) => {
    await createInvoice.mutateAsync({
      companyId: session.tenantId,
      invoiceNumber: '',
      status: 'draft',
      ...data,
      items: data.items,
      subtotal: 0,
      taxes: 0,
      total: 0,
      id: ''
    });
    navigate('/app/invoices');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-50">Nueva factura</h1>
        <p className="text-xs text-slate-400">
          Captura básica para generar una factura de venta.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Datos generales">
          <div className="grid gap-3 md:grid-cols-3">
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
              label="Cliente (ID mock)"
              {...register('customerId')}
              error={errors.customerId?.message}
            />
          </div>
        </Card>
        <Card title="Conceptos">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-2 md:grid-cols-5">
                <Input
                  label="Descripción"
                  {...register(`items.${index}.description` as const)}
                  error={errors.items?.[index]?.description?.message}
                />
                <Input
                  label="Cantidad"
                  type="number"
                  step="1"
                  {...register(`items.${index}.qty` as const, { valueAsNumber: true })}
                  error={errors.items?.[index]?.qty?.message}
                />
                <Input
                  label="Precio unitario"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                  error={errors.items?.[index]?.unitPrice?.message}
                />
                <Input
                  label="Impuesto (0 - 1)"
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.taxRate` as const, { valueAsNumber: true })}
                  error={errors.items?.[index]?.taxRate?.message}
                />
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                append({
                  description: '',
                  qty: 1,
                  unitPrice: 0,
                  taxRate: 0.16
                })
              }
            >
              Agregar concepto
            </Button>
          </div>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate('/app/invoices')}>
            Cancelar
          </Button>
          <Button type="submit">Guardar borrador</Button>
        </div>
      </form>
    </div>
  );
};

