import { Link } from 'react-router-dom';
import { useClients } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

export const ClientsListPage = () => {
  const { data, isLoading } = useClients();

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Clientes</h1>
          <p className="text-xs text-slate-400">
            Gestiona tus clientes y consulta su historial de facturación.
          </p>
        </div>
        <Button as="button">
          <Link to="/app/clients/new" className="text-xs">
            Nuevo cliente
          </Link>
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
    </div>
  );
};
