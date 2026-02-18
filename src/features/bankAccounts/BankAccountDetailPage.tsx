import { useParams } from 'react-router-dom';
import { useSessionStore } from '../../app/store/sessionStore';
import { bankAccountService } from '../../services/bankAccountService';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../lib/currency';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { formatDate } from '../../lib/dates';

export const BankAccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);

  if (!session || !id) return null;

  const account = bankAccountService.get(session.tenantId, id);
  const movements = bankAccountService.listMovements(session.tenantId, id);

  if (!account) {
    return <p className="text-sm text-slate-400">Cuenta bancaria no encontrada.</p>;
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-50">{account.name}</h1>
        <p className="text-xs text-slate-400">
          Saldo actual {formatCurrency(account.balance)} · {account.bankName}{' '}
          {account.accountNumber}
        </p>
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
                  <TD>{formatCurrency(m.amount)}</TD>
                  <TD>{formatCurrency(m.resultingBalance)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

