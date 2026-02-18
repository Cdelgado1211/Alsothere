import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { useUpsertVendor } from './hooks';

const vendorSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  taxId: z.string().min(3, 'RFC/NIF requerido'),
  address: z.string().min(3, 'Dirección requerida'),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type VendorForm = z.infer<typeof vendorSchema>;

export const VendorNewPage = () => {
  const upsertVendor = useUpsertVendor();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: '',
      taxId: '',
      address: '',
      email: '',
      phone: '',
      status: 'active'
    }
  });

  const onSubmit = async (values: VendorForm) => {
    await upsertVendor.mutateAsync({
      ...values,
      email: values.email || undefined
    });
    navigate('/app/vendors');
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Nuevo proveedor</h1>
        <p className="text-xs text-slate-500">
          Registra un nuevo proveedor para poder asociar facturas de compra.
        </p>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card title="Datos del proveedor">
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Nombre"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              label="RFC / NIF"
              {...register('taxId')}
              error={errors.taxId?.message}
            />
            <Input
              label="Correo electrónico"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Teléfono"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
          <div className="mt-3">
            <Input
              label="Dirección"
              {...register('address')}
              error={errors.address?.message}
            />
          </div>
        </Card>
        <Card title="Estatus">
          <div className="max-w-xs">
            <Select
              label="Estado"
              {...register('status')}
              error={errors.status?.message}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </Select>
          </div>
        </Card>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/app/vendors')}
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

