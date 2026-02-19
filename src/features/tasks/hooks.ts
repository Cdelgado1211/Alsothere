import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '../../app/store/sessionStore';
import { taskService } from '../../services/taskService';
import type { Task, TaskStatus } from '../../types/tasks';

const keys = {
  all: (tenantId: string) => ['tasks', tenantId] as const
};

export const useTasks = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId;
  return useQuery({
    queryKey: tenantId ? keys.all(tenantId) : ['tasks'],
    enabled: !!tenantId,
    queryFn: () => taskService.list(tenantId as string)
  });
};

export const useUpdateTaskStatus = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: TaskStatus }) =>
      taskService.updateStatus(tenantId, payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};

export const useCreateTask = () => {
  const session = useSessionStore((s) => s.session);
  const tenantId = session?.tenantId as string;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Omit<Task, 'id' | 'companyId' | 'createdAt'>) =>
      taskService.create(tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.all(tenantId) });
    }
  });
};

