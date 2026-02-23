import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { bankAccountService } from '../../services/bankAccountService';
import { invoiceService } from '../../services/invoiceService';
import { billService } from '../../services/billService';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../lib/currency';
import { Button } from '../../components/ui/Button';

export const BalanceSheetReportPage = () => {
  const session = useSessionStore((s) => s.session);
  const navigate = useNavigate();
  if (!session) return null;

  const accounts = bankAccountService.list(session.tenantId);
  const invoices = invoiceService.list(session.tenantId);
  const bills = billService.list(session.tenantId);

  const bankAssets = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const receivables = invoices
    .filter((i) => i.status === 'issued' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.total, 0);
  const payables = bills
    .filter((b) => b.status === 'pending' || b.status === 'overdue')
    .reduce((sum, b) => sum + b.total, 0);

  const totalAssets = bankAssets + receivables;
  const totalLiabilities = payables;
  const equity = totalAssets - totalLiabilities;

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
            <h1 className="text-lg font-semibold text-slate-900">Balance general</h1>
            <p className="text-xs text-slate-500">
              Resumen de activos y pasivos a partir de saldos bancarios, cuentas por cobrar y por
              pagar.
            </p>
          </div>
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Activos">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <dt className="text-slate-500">Saldos bancarios</dt>
            <dd>{formatCurrency(bankAssets)}</dd>
            <dt className="text-slate-500">Cuentas por cobrar</dt>
            <dd>{formatCurrency(receivables)}</dd>
            <dt className="text-slate-500 font-semibold">Total activos</dt>
            <dd className="font-semibold">{formatCurrency(totalAssets)}</dd>
          </dl>
        </Card>
        <Card title="Pasivos y capital">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <dt className="text-slate-500">Cuentas por pagar</dt>
            <dd>{formatCurrency(totalLiabilities)}</dd>
            <dt className="text-slate-500 font-semibold">Capital (Activos - Pasivos)</dt>
            <dd className="font-semibold">
              {formatCurrency(equity)}
            </dd>
          </dl>
        </Card>
      </div>
    </div>
  );
};
