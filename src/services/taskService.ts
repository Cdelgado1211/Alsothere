import { mockDb } from './mockDb';
import type { Task, TaskStatus } from '../types/tasks';

export const taskService = {
  list(companyId: string): Task[] {
    return mockDb.getCompany(companyId).tasks;
  },
  get(companyId: string, id: string) {
    return mockDb.getCompany(companyId).tasks.find((t) => t.id === id) ?? null;
  },
  create(
    companyId: string,
    data: Omit<Task, 'id' | 'companyId' | 'createdAt'>
  ): Task {
    const db = mockDb.getCompany(companyId);
    const task: Task = {
      ...data,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      companyId,
      createdAt: new Date().toISOString()
    };
    db.tasks.push(task);
    return task;
  },
  updateStatus(companyId: string, id: string, status: TaskStatus): Task | null {
    const db = mockDb.getCompany(companyId);
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    const updated: Task = { ...db.tasks[idx], status };
    db.tasks[idx] = updated;
    return updated;
  }
};
