import { useSessionStore } from '../../app/store/sessionStore';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../lib/currency';
import { invoiceService } from '../../services/invoiceService';
import { billService } from '../../services/billService';
import { bankAccountService } from '../../services/bankAccountService';
import { isPastDate } from '../../lib/dates';

export const DashboardPage = () => {
  const session = useSessionStore((s) => s.session);
  if (!session) return null;
  const invoices = invoiceService.list(session.tenantId);
  const bills = billService.list(session.tenantId);
  const accounts = bankAccountService.list(session.tenantId);

  const totalCxC = invoices
    .filter((i) => i.status === 'issued' || i.status === 'overdue')
    .reduce((acc, i) => acc + i.total, 0);
  const totalCxP = bills
    .filter((b) => b.status === 'pending' || b.status === 'overdue')
    .reduce((acc, b) => acc + b.total, 0);
  const saldoCuentas = accounts.reduce((acc, a) => acc + a.balance, 0);
  const facturasVencidas = invoices.filter(
    (i) => (i.status === 'issued' || i.status === 'overdue') && isPastDate(i.dueDate)
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-slate-50">
          {session.companyName} · Resumen financiero
        </h1>
        <p className="text-xs text-slate-400">
          Visión rápida de cuentas por cobrar, por pagar y saldos bancarios.
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-xs text-slate-400">Cuentas por cobrar</p>
          <p className="mt-1 text-xl font-semibold text-brand-400">
            {formatCurrency(totalCxC || 0)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Cuentas por pagar</p>
          <p className="mt-1 text-xl font-semibold text-amber-300">
            {formatCurrency(totalCxP || 0)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Saldo cuentas bancarias</p>
          <p className="mt-1 text-xl font-semibold text-emerald-400">
            {formatCurrency(saldoCuentas || 0)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Facturas vencidas</p>
          <p className="mt-1 text-xl font-semibold text-red-400">{facturasVencidas}</p>
        </Card>
      </section>
    </div>
  );
};

