import { useNavigate, useParams } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { bankAccountService } from '../../services/bankAccountService';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../lib/currency';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { formatDate } from '../../lib/dates';
import { Button } from '../../components/ui/Button';

export const BankAccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);
  const country = useSessionStore((s) => s.country);
  const navigate = useNavigate();

  if (!session || !id) return null;

  const account = bankAccountService.get(session.tenantId, id);
  const movements = bankAccountService.listMovements(session.tenantId, id);

  const currencyByCountry: Record<string, string> = {
    mx: 'MXN',
    cl: 'CLP',
    es: 'EUR',
    ar: 'ARS',
    co: 'COP',
    ve: 'VES'
  };

  const displayCurrency =
    account?.currency === 'USD' ? 'USD' : currencyByCountry[country] ?? account?.currency ?? 'USD';

  const getDisplayName = () => {
    if (!account) return '';
    if (account.currency === 'USD') return account.name;
    const parts = account.name.split(' ');
    if (parts.length >= 3 && parts[0] === 'Cuenta') {
      const suffix = parts.slice(2).join(' ');
      return `Cuenta ${displayCurrency} ${suffix}`.trim();
    }
    return account.name;
  };

  if (!account) {
    return <p className="text-sm text-slate-400">Cuenta bancaria no encontrada.</p>;
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/bank-accounts')}
          >
            ← Volver a cuentas bancarias
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">{getDisplayName()}</h1>
            <p className="text-xs text-slate-400">
              Saldo actual {formatCurrency(account.balance, displayCurrency)} · {account.bankName}{' '}
              {account.accountNumber}
            </p>
          </div>
        </div>
      </header>
      <Card title="Movimientos">
        {movements.length === 0 ? (
          <p className="text-sm text-slate-400">Sin movimientos registrados.</p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Fecha</TH>
                <TH>Tipo</TH>
                <TH>Referencia</TH>
                <TH>Monto</TH>
                <TH>Saldo resultante</TH>
              </TR>
            </THead>
            <TBody>
              {movements.map((m) => (
              <TR key={m.id}>
                <TD>{formatDate(m.date)}</TD>
                <TD>{m.type === 'income' ? 'Ingreso' : 'Egreso'}</TD>
                <TD>
                  {m.referenceType} · {m.referenceId}
                </TD>
                  <TD>{formatCurrency(m.amount, displayCurrency)}</TD>
                  <TD>{formatCurrency(m.resultingBalance, displayCurrency)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
