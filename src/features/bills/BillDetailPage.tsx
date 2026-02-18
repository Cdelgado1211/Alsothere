import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSessionStore } from '../../app/store/sessionStore';
import { billService } from '../../services/billService';
import { bankAccountService } from '../../services/bankAccountService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../lib/currency';
import { formatDate } from '../../lib/dates';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

export const BillDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  if (!session || !id) return null;

  const bill = billService.get(session.tenantId, id);
  const accounts = bankAccountService.list(session.tenantId);

  if (!bill) {
    return <p className="text-sm text-slate-400">Factura proveedor no encontrada.</p>;
  }

  const handlePay = () => {
    if (!selectedAccount) return;
    billService.registerPayment(session.tenantId, bill.id, selectedAccount);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            {bill.vendorInvoiceNumber} · {formatCurrency(bill.total)}
          </h1>
          <p className="text-xs text-slate-400">
            Factura de proveedor emitida el {formatDate(bill.issueDate)}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              bill.status === 'paid'
                ? 'success'
                : bill.status === 'overdue'
                ? 'danger'
                : 'default'
            }
          >
            {bill.status}
          </Badge>
          {bill.status !== 'paid' && bill.status !== 'void' && (
            <Button size="sm" onClick={() => setOpen(true)}>
              Registrar pago
            </Button>
          )}
        </div>
      </header>
      <Card title="Detalle">
        <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <dt className="text-slate-500">Emisión</dt>
          <dd>{formatDate(bill.issueDate)}</dd>
          <dt className="text-slate-500">Vencimiento</dt>
          <dd>{formatDate(bill.dueDate)}</dd>
          <dt className="text-slate-500">Total</dt>
          <dd>{formatCurrency(bill.total)}</dd>
          <dt className="text-slate-500">Proveedor (ID)</dt>
          <dd>{bill.vendorId}</dd>
        </dl>
      </Card>
      <Modal open={open} title="Registrar pago" onClose={() => setOpen(false)}>
        <Select
          label="Cuenta bancaria"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          <option value="">Selecciona una cuenta</option>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} · {acc.bankName}
            </option>
          ))}
        </Select>
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handlePay}>
            Registrar pago
          </Button>
        </div>
      </Modal>
    </div>
  );
};

