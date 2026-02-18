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

  const filtered =
    data?.filter((bill) => (statusFilter === 'all' ? true : bill.status === statusFilter)) ?? [];

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
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 rounded-lg border border-slate-700 bg-slate-900 px-2 text-xs text-slate-100 focus:border-brand-500 focus:outline-none"
            >
              <option value="all">Todos los estatus</option>
              <option value="pending">Pendiente</option>
              <option value="overdue">Vencida</option>
              <option value="paid">Pagada</option>
              <option value="void">Anulada</option>
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
                const isOverdue =
                  (bill.status === 'pending' || bill.status === 'overdue') &&
                  isPastDate(bill.dueDate);
                const displayStatus = isOverdue ? 'overdue' : bill.status;
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
                        {displayStatus}
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

