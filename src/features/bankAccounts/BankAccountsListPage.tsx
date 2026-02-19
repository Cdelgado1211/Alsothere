import { Link } from 'react-router-dom';
import { useBankAccounts } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/currency';
import { useSessionStore } from '../../app/store/sessionStore';
import type { BankAccount } from '../../types/bankAccounts';

const currencyByCountry: Record<string, string> = {
  mx: 'MXN',
  cl: 'CLP',
  es: 'EUR',
  ar: 'ARS',
  co: 'COP',
  ve: 'VES'
};

export const BankAccountsListPage = () => {
  const { data, isLoading } = useBankAccounts();
  const country = useSessionStore((s) => s.country);

  const getDisplayCurrency = (accountCurrency: string) => {
    if (accountCurrency === 'USD') return 'USD';
    return currencyByCountry[country] ?? accountCurrency;
  };

  const getDisplayName = (account: BankAccount) => {
    if (account.currency === 'USD') return account.name;
    const displayCurrency = getDisplayCurrency(account.currency);
    const parts = account.name.split(' ');
    if (parts.length >= 3 && parts[0] === 'Cuenta') {
      const suffix = parts.slice(2).join(' ');
      return `Cuenta ${displayCurrency} ${suffix}`.trim();
    }
    return account.name;
  };

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
          <Link to="/app/bank-accounts/new" className="text-xs">
            Nueva cuenta
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
                      {getDisplayName(acc)}
                    </Link>
                  </TD>
                  <TD>{acc.bankName}</TD>
                  <TD>{acc.accountNumber}</TD>
                  <TD>{formatCurrency(acc.balance, getDisplayCurrency(acc.currency))}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};
