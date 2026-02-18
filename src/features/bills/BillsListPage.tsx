import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBills } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/currency';
import { formatDate, isPastDate } from '../../lib/dates';

export const BillsListPage = () => {
  const { data, isLoading } = useBills();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    overdue: 'Vencida',
    paid: 'Pagada',
    void: 'Anulada'
  };

  const resolveStatus = (status: string, dueDate: string) => {
    const isOverdueStatus =
      (status === 'pending' || status === 'overdue') && isPastDate(dueDate);
    return isOverdueStatus ? 'overdue' : status;
  };

  const filtered =
    data?.filter((bill) => {
      const normalized = resolveStatus(bill.status, bill.dueDate);
      if (statusFilter === 'all') return true;
      return normalized === statusFilter;
    }) ?? [];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Facturas proveedor</h1>
          <p className="text-xs text-slate-400">
            Controla obligaciones con proveedores y registra pagos.
          </p>
        </div>
        <Button as="button">
          <Link to="/app/bills/new" className="text-xs">
            Nueva factura proveedor
          </Link>
        </Button>
      </header>
      <Card>
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Filtro
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-full border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">Todos los estatus</option>
              <option value="pending">{statusLabel.pending}</option>
              <option value="overdue">{statusLabel.overdue}</option>
              <option value="paid">{statusLabel.paid}</option>
              <option value="void">{statusLabel.void}</option>
            </select>
          </div>
        </div>
        {isLoading && <Spinner />}
        {!isLoading && (!filtered || filtered.length === 0) && (
          <EmptyState
            title="Sin facturas proveedor"
            description="Registra facturas de proveedores para controlar cuentas por pagar."
          />
        )}
        {!isLoading && filtered && filtered.length > 0 && (
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
              {filtered.map((bill) => {
                const displayStatus = resolveStatus(bill.status, bill.dueDate);
                return (
                  <TR key={bill.id}>
                    <TD>
                      <Link
                        to={`/app/bills/${bill.id}`}
                        className="text-sm text-brand-300 hover:text-brand-200"
                      >
                        {bill.vendorInvoiceNumber}
                      </Link>
                    </TD>
                    <TD>{formatDate(bill.issueDate)}</TD>
                    <TD>{formatDate(bill.dueDate)}</TD>
                    <TD>{formatCurrency(bill.total)}</TD>
                    <TD>
                      <Badge
                        variant={
                          displayStatus === 'paid'
                            ? 'success'
                            : displayStatus === 'overdue'
                            ? 'danger'
                            : 'default'
                        }
                      >
                        {statusLabel[displayStatus] ?? displayStatus}
                      </Badge>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
