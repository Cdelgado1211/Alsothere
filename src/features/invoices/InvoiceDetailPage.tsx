import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useSessionStore } from '../../app/store/sessionStore';
import { invoiceService } from '../../services/invoiceService';
import { bankAccountService } from '../../services/bankAccountService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { formatCurrency } from '../../lib/currency';
import { formatDate } from '../../lib/dates';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';

export const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  if (!session || !id) return null;

  const invoice = invoiceService.get(session.tenantId, id);
  const accounts = bankAccountService.list(session.tenantId);

  const statusLabel: Record<string, string> = {
    draft: 'Borrador',
    issued: 'Emitida',
    overdue: 'Vencida',
    paid: 'Pagada',
    void: 'Anulada'
  };

  if (!invoice) {
    return <p className="text-sm text-slate-400">Factura no encontrada.</p>;
  }

  const handleMarkPaid = () => {
    if (!selectedAccount) return;
    invoiceService.markAsPaid(session.tenantId, invoice.id, selectedAccount);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/invoices')}
          >
            ← Volver a facturas
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
            {invoice.invoiceNumber} · {formatCurrency(invoice.total)}
          </h1>
          <p className="text-xs text-slate-400">
            Factura de venta emitida el {formatDate(invoice.issueDate)}.
          </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              invoice.status === 'paid'
                ? 'success'
                : invoice.status === 'overdue'
                ? 'danger'
                : 'default'
            }
          >
            {statusLabel[invoice.status] ?? invoice.status}
          </Badge>
          {invoice.status !== 'paid' && invoice.status !== 'void' && (
            <Button size="sm" onClick={() => setOpen(true)}>
              Marcar como pagada
            </Button>
          )}
        </div>
      </header>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Resumen">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <dt className="text-slate-500">Emisión</dt>
            <dd>{formatDate(invoice.issueDate)}</dd>
            <dt className="text-slate-500">Vencimiento</dt>
            <dd>{formatDate(invoice.dueDate)}</dd>
            <dt className="text-slate-500">Subtotal</dt>
            <dd>{formatCurrency(invoice.subtotal)}</dd>
            <dt className="text-slate-500">Impuestos</dt>
            <dd>{formatCurrency(invoice.taxes)}</dd>
            <dt className="text-slate-500">Total</dt>
            <dd>{formatCurrency(invoice.total)}</dd>
          </dl>
        </Card>
        <div className="lg:col-span-2">
          <Card title="Conceptos">
            <Table>
              <THead>
                <TR>
                  <TH>Descripción</TH>
                  <TH>Cantidad</TH>
                  <TH>Precio</TH>
                  <TH>Impuesto</TH>
                  <TH>Total</TH>
                </TR>
              </THead>
              <TBody>
                {invoice.items.map((item, idx) => (
                  <TR key={idx}>
                    <TD>{item.description}</TD>
                    <TD>{item.qty}</TD>
                    <TD>{formatCurrency(item.unitPrice)}</TD>
                    <TD>{(item.taxRate ?? 0) * 100}%</TD>
                    <TD>{formatCurrency(item.qty * item.unitPrice)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </Card>
        </div>
      </div>
      <Modal open={open} title="Registrar pago de factura" onClose={() => setOpen(false)}>
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
          <Button size="sm" onClick={handleMarkPaid}>
            Registrar pago
          </Button>
        </div>
      </Modal>
    </div>
  );
};
