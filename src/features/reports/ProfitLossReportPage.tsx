import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { invoiceService } from '../../services/invoiceService';
import { billService } from '../../services/billService';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../lib/currency';
import { Button } from '../../components/ui/Button';

export const ProfitLossReportPage = () => {
  const session = useSessionStore((s) => s.session);
  const navigate = useNavigate();
  if (!session) return null;

  const invoices = invoiceService.list(session.tenantId);
  const bills = billService.list(session.tenantId);

  const income = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const expenses = bills
    .filter((b) => b.status === 'paid')
    .reduce((sum, b) => sum + b.total, 0);

  const grossProfit = income - expenses;

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/reports')}
          >
            ← Volver a reportes
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Reporte de ganancias y pérdidas
            </h1>
            <p className="text-xs text-slate-500">
              Cálculo simple a partir de facturas de venta y facturas proveedor marcadas como
              pagadas.
            </p>
          </div>
        </div>
      </header>
      <Card title="Resumen">
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-700">
          <dt className="text-slate-500">Ingresos (facturas pagadas)</dt>
          <dd>{formatCurrency(income)}</dd>
          <dt className="text-slate-500">Gastos (facturas proveedor pagadas)</dt>
          <dd>{formatCurrency(expenses)}</dd>
          <dt className="text-slate-500">Utilidad neta</dt>
          <dd className={grossProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}>
            {formatCurrency(grossProfit)}
          </dd>
        </dl>
      </Card>
    </div>
  );
};
