import { useSessionStore } from '../../app/store/sessionStore';
import { auditService } from '../../services/auditService';
import { Card } from '../../components/ui/Card';
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/Table';
import { formatDate } from '../../lib/dates';

export const AuditLogPage = () => {
  const session = useSessionStore((s) => s.session);
  if (!session) return null;

  const entries = auditService.list(session.tenantId);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-50">Auditoría</h1>
        <p className="text-xs text-slate-400">
          Registro en memoria de acciones críticas sobre facturas y movimientos bancarios.
        </p>
      </header>
      <Card>
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400">
            Aún no hay eventos de auditoría registrados.
          </p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Fecha</TH>
                <TH>Acción</TH>
                <TH>Entidad</TH>
                <TH>Mensaje</TH>
              </TR>
            </THead>
            <TBody>
              {entries.map((entry) => (
                <TR key={entry.id}>
                  <TD>{formatDate(entry.createdAt)}</TD>
                  <TD>{entry.action}</TD>
                  <TD>
                    {entry.entityType} · {entry.entityId}
                  </TD>
                  <TD>{entry.message}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

