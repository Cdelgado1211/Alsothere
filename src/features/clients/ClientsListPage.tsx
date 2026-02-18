import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClients, useUpsertClient } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const clientSchema = z.object({
  name: z.string().min(2, 'Nombre requerido'),
  taxId: z.string().min(3, 'RFC/NIF requerido'),
  address: z.string().min(3, 'Dirección requerida'),
  email: z.string().email('Correo inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type ClientForm = z.infer<typeof clientSchema>;

export const ClientsListPage = () => {
  const { data, isLoading } = useClients();
  const upsertClient = useUpsertClient();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      taxId: '',
      address: '',
      email: '',
      phone: '',
      status: 'active'
    }
  });

  const onSubmit = async (values: ClientForm) => {
    await upsertClient.mutateAsync({
      ...values,
      email: values.email || undefined
    });
    reset();
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Clientes</h1>
          <p className="text-xs text-slate-400">
            Gestiona tus clientes y consulta su historial de facturación.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Nuevo cliente
        </Button>
      </header>
      <Card>
        {isLoading && <Spinner />}
        {!isLoading && (!data || data.length === 0) && (
          <EmptyState
            title="Sin clientes"
            description="Crea clientes para comenzar a facturar."
          />
        )}
        {!isLoading && data && data.length > 0 && (
          <Table>
            <THead>
              <TR>
                <TH>Nombre</TH>
                <TH>RFC/NIF</TH>
                <TH>Correo</TH>
                <TH>Estado</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((client) => (
                <TR key={client.id}>
                  <TD>
                    <Link
                      to={`/app/clients/${client.id}`}
                      className="text-sm text-brand-300 hover:text-brand-200"
                    >
                      {client.name}
                    </Link>
                  </TD>
                  <TD>{client.taxId}</TD>
                  <TD>{client.email}</TD>
                  <TD>
                    <Badge variant={client.status === 'active' ? 'success' : 'danger'}>
                      {client.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
      <Modal open={open} title="Nuevo cliente" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
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
          <Input
            label="Dirección"
            {...register('address')}
            error={errors.address?.message}
          />
          <Select
            label="Estado"
            {...register('status')}
            error={errors.status?.message}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </Select>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
