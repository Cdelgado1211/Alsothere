import { Link } from 'react-router-dom';
import { useVendors } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';

export const VendorsListPage = () => {
  const { data, isLoading } = useVendors();

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Proveedores</h1>
          <p className="text-xs text-slate-400">
            Registra proveedores y consulta sus facturas.
          </p>
        </div>
        <Button as="button">
          <Link to="/app/vendors/new" className="text-xs">
            Nuevo proveedor
          </Link>
        </Button>
      </header>
      <Card>
        {isLoading && <Spinner />}
        {!isLoading && (!data || data.length === 0) && (
          <EmptyState
            title="Sin proveedores"
            description="Registra proveedores para llevar control de cuentas por pagar."
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
              {data.map((vendor) => (
                <TR key={vendor.id}>
                  <TD>
                    <Link
                      to={`/app/vendors/${vendor.id}`}
                      className="text-sm text-brand-300 hover:text-brand-200"
                    >
                      {vendor.name}
                    </Link>
                  </TD>
                  <TD>{vendor.taxId}</TD>
                  <TD>{vendor.email}</TD>
                  <TD>
                    <Badge variant={vendor.status === 'active' ? 'success' : 'danger'}>
                      {vendor.status === 'active' ? 'Activo' : 'Inactivo'}
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
