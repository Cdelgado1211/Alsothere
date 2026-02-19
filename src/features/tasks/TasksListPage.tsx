import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTasks, useUpdateTaskStatus, useCreateTask } from './hooks';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/dates';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada'
};

type CreateTaskForm = {
  title: string;
  description: string;
  category: 'onboarding' | 'banking' | 'compliance';
  country: string;
  dueDate?: string;
};

export const TasksListPage = () => {
  const { data } = useTasks();
  const updateStatus = useUpdateTaskStatus();
  const createTask = useCreateTask();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateTaskForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: 'onboarding',
      country: 'México',
      dueDate: ''
    }
  });

  const handleStatusChange = (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    updateStatus.mutate({ id, status });
  };

  const onSubmit = async (values: CreateTaskForm) => {
    await createTask.mutateAsync({
      title: values.title,
      description: values.description,
      category: values.category,
      country: values.country,
      status: 'pending',
      dueDate: values.dueDate || undefined
    });
    reset();
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Tareas operativas</h1>
          <p className="text-xs text-slate-500">
            Seguimiento a actividades recurrentes como registro de proveedor y transferencias
            internacionales.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Nueva tarea
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.map((task) => (
          <Card key={task.id}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{task.title}</h2>
                <p className="mt-1 text-xs text-slate-500">{task.description}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                  {task.country} · {task.category === 'banking' ? 'Banca' : 'Onboarding'}
                </p>
              </div>
              <Badge
                variant={
                  task.status === 'completed'
                    ? 'success'
                    : task.status === 'in_progress'
                    ? 'warning'
                    : 'default'
                }
              >
                {statusLabel[task.status]}
              </Badge>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Creada {formatDate(task.createdAt)}{' '}
                {task.dueDate && `· Vence ${formatDate(task.dueDate)}`}
              </span>
              <div className="flex gap-1">
                {task.status !== 'pending' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-[11px]"
                    onClick={() => handleStatusChange(task.id, 'pending')}
                  >
                    Marcar pendiente
                  </Button>
                )}
                {task.status !== 'in_progress' && task.status !== 'completed' && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="text-[11px]"
                    onClick={() => handleStatusChange(task.id, 'in_progress')}
                  >
                    En progreso
                  </Button>
                )}
                {task.status !== 'completed' && (
                  <Button
                    type="button"
                    size="sm"
                    className="text-[11px]"
                    onClick={() => handleStatusChange(task.id, 'completed')}
                  >
                    Completar
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              <Link to="/app/bank-accounts" className="text-brand-600 hover:text-brand-700">
                Ver saldos bancarios relacionados
              </Link>
            </div>
          </Card>
        ))}
        {!data?.length && (
          <Card>
            <p className="text-sm text-slate-500">
              No hay tareas registradas. Los flujos típicos como registro de proveedor o
              transferencias internacionales se mostrarán aquí.
            </p>
          </Card>
        )}
      </div>
      <Modal open={open} title="Nueva tarea" onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            <span>Título</span>
            <input
              className={`h-9 rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                errors.title ? 'border-red-500' : 'border-slate-300'
              }`}
              {...register('title', { required: 'Título requerido' })}
            />
            {errors.title && (
              <span className="text-xs text-red-400">{errors.title.message}</span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-700">
            <span>Descripción</span>
            <textarea
              className={`min-h-[80px] rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 ${
                errors.description ? 'border-red-500' : 'border-slate-300'
              }`}
              {...register('description', { required: 'Descripción requerida' })}
            />
            {errors.description && (
              <span className="text-xs text-red-400">{errors.description.message}</span>
            )}
          </label>
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              label="Tipo"
              {...register('category', { required: 'Tipo requerido' })}
              error={errors.category?.message}
            >
              <option value="onboarding">Registro / Onboarding</option>
              <option value="banking">Banca / Transferencias</option>
              <option value="compliance">Compliance</option>
            </Select>
            <Select
              label="País"
              {...register('country', { required: 'País requerido' })}
              error={errors.country?.message}
            >
              <option value="México">México</option>
              <option value="Estados Unidos">Estados Unidos</option>
              <option value="Chile">Chile</option>
              <option value="España">España</option>
              <option value="Argentina">Argentina</option>
              <option value="Colombia">Colombia</option>
              <option value="Venezuela">Venezuela</option>
            </Select>
            <Input
              label="Fecha límite (opcional)"
              type="date"
              {...register('dueDate')}
              error={errors.dueDate?.message}
            />
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                reset();
                setOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              Guardar tarea
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
