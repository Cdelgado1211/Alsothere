import { useParams } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { vendorService } from '../../services/vendorService';
import { billService } from '../../services/billService';
import { Card } from '../../components/ui/Card';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/currency';
import { formatDate } from '../../lib/dates';

export const VendorDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);
  if (!session || !id) return null;

  const vendor = vendorService.get(session.tenantId, id);
  const bills = billService
    .list(session.tenantId)
    .filter((b) => b.vendorId === id);

  if (!vendor) {
    return (
      <div>
        <p className="text-sm text-slate-400">Proveedor no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-50">{vendor.name}</h1>
        <p className="text-xs text-slate-400">
          Detalle del proveedor e historial de facturas de proveedor.
        </p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Información">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <dt className="text-slate-500">RFC/NIF</dt>
            <dd>{vendor.taxId}</dd>
            <dt className="text-slate-500">Correo</dt>
            <dd>{vendor.email}</dd>
            <dt className="text-slate-500">Teléfono</dt>
            <dd>{vendor.phone}</dd>
            <dt className="text-slate-500">Dirección</dt>
            <dd>{vendor.address}</dd>
          </dl>
        </Card>
        <div className="lg:col-span-2">
          <Card title="Facturas proveedor">
            {bills.length === 0 ? (
              <p className="text-sm text-slate-400">Sin facturas registradas.</p>
            ) : (
              <Table>
                <THead>
                  <TR>
                    <TH>Factura</TH>
                    <TH>Emisión</TH>
                    <TH>Vencimiento</TH>
                    <TH>Total</TH>
                    <TH>Estatus</TH>
                  </TR>
                </THead>
                <TBody>
                  {bills.map((bill) => (
                    <TR key={bill.id}>
                      <TD>{bill.vendorInvoiceNumber}</TD>
                      <TD>{formatDate(bill.issueDate)}</TD>
                      <TD>{formatDate(bill.dueDate)}</TD>
                      <TD>{formatCurrency(bill.total)}</TD>
                      <TD>{bill.status}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

