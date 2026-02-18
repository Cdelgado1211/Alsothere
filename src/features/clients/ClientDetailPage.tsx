import { useParams } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { clientService } from '../../services/clientService';
import { invoiceService } from '../../services/invoiceService';
import { Card } from '../../components/ui/Card';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/currency';
import { formatDate } from '../../lib/dates';

export const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);
  if (!session || !id) return null;

  const client = clientService.get(session.tenantId, id);
  const invoices = invoiceService
    .list(session.tenantId)
    .filter((i) => i.customerId === id);

  if (!client) {
    return (
      <div>
        <p className="text-sm text-slate-400">Cliente no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-50">{client.name}</h1>
        <p className="text-xs text-slate-400">Detalle del cliente e historial de facturas.</p>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Información">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <dt className="text-slate-500">RFC/NIF</dt>
            <dd>{client.taxId}</dd>
            <dt className="text-slate-500">Correo</dt>
            <dd>{client.email}</dd>
            <dt className="text-slate-500">Teléfono</dt>
            <dd>{client.phone}</dd>
            <dt className="text-slate-500">Dirección</dt>
            <dd>{client.address}</dd>
          </dl>
        </Card>
        <div className="lg:col-span-2">
          <Card title="Facturas">
            {invoices.length === 0 ? (
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
                  {invoices.map((inv) => (
                    <TR key={inv.id}>
                      <TD>{inv.invoiceNumber}</TD>
                      <TD>{formatDate(inv.issueDate)}</TD>
                      <TD>{formatDate(inv.dueDate)}</TD>
                      <TD>{formatCurrency(inv.total)}</TD>
                      <TD>{inv.status}</TD>
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

