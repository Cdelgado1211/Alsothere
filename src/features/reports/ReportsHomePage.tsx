import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ReportsHomePage = () => {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold text-slate-900">Reportes financieros</h1>
        <p className="text-xs text-slate-500">
          Consulta reportes básicos de tu operación: estado de resultados y balance general.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Ganancias y pérdidas">
          <p className="mb-3 text-xs text-slate-500">
            Resumen de ingresos, gastos y utilidad neta a partir de facturas de venta y facturas
            proveedor.
          </p>
          <Button as="button">
            <Link to="/app/reports/profit-loss" className="text-xs">
              Ver estado de resultados
            </Link>
          </Button>
        </Card>
        <Card title="Balance general">
          <p className="mb-3 text-xs text-slate-500">
            Vista de activos (saldos bancarios y cuentas por cobrar) y pasivos (cuentas por pagar).
          </p>
          <Button as="button">
            <Link to="/app/reports/balance-sheet" className="text-xs">
              Ver balance general
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

