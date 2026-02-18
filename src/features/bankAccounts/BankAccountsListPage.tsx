import { Link } from 'react-router-dom';
import { useBankAccounts } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/currency';

export const BankAccountsListPage = () => {
  const { data, isLoading } = useBankAccounts();

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Cuentas bancarias</h1>
          <p className="text-xs text-slate-400">
            Consulta el saldo y crea nuevas cuentas bancarias.
          </p>
        </div>
        <Button as="button">
          <Link to="#" className="text-xs">
            Nueva cuenta (próximamente)
          </Link>
        </Button>
      </header>
      <Card>
        {isLoading && <Spinner />}
        {!isLoading && (!data || data.length === 0) && (
          <EmptyState
            title="Sin cuentas bancarias"
            description="Registra cuentas para controlar tus movimientos."
          />
        )}
        {!isLoading && data && data.length > 0 && (
          <Table>
            <THead>
              <TR>
                <TH>Nombre</TH>
                <TH>Banco</TH>
                <TH>Número</TH>
                <TH>Saldo</TH>
              </TR>
            </THead>
            <TBody>
              {data.map((acc) => (
                <TR key={acc.id}>
                  <TD>
                    <Link
                      to={`/app/bank-accounts/${acc.id}`}
                      className="text-sm text-brand-300 hover:text-brand-200"
                    >
                      {acc.name}
                    </Link>
                  </TD>
                  <TD>{acc.bankName}</TD>
                  <TD>{acc.accountNumber}</TD>
                  <TD>{formatCurrency(acc.balance)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

