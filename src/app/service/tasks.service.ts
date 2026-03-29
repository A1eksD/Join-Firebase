import { Injectable } from '@angular/core';
import { Task } from '../interface/task';

const API = 'http://localhost:4200/api';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  allTasks: Task[] = [];
  allTasksCopy: Task[] = [];
  clickedTask: any;
  clickedTaskCopy: any;
  subtaskLenghtValue: number = 0;

  constructor() {
    this.loadAllTasks();
  }

  // ─── Normale HTTP (fetch + async/await) ──────────────────────────────────────

  async loadAllTasks(): Promise<void> {
    try {
      const response = await fetch(`${API}/tasks`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const tasks: Task[] = await response.json();
      this.allTasks = tasks;
      this.allTasksCopy = [...tasks];
    } catch (error) {
      console.error('Load tasks failed', error);
    }
  }

  async addTask(task: Task[]): Promise<void> {
    try {
      const response = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task[0]),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await this.loadAllTasks();
    } catch (error) {
      console.error('Create task failed', error);
    }
  }

  async updateTaskCategors(id: string, taskCategory: string): Promise<void> {
    try {
      const response = await fetch(`${API}/tasks/${id}/category`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: taskCategory }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await this.loadAllTasks();
    } catch (error) {
      console.error('Update taskCategory failed', error);
    }
  }

  async updateSubtasks(subtasks: string[], id: string): Promise<void> {
    try {
      const response = await fetch(`${API}/tasks/${id}/subtasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtasks }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await this.loadAllTasks();
    } catch (error) {
      console.error('Update subtask failed', error);
    }
  }

  async updateTask(task: Task[]): Promise<void> {
    try {
      const response = await fetch(`${API}/tasks/${task[0].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task[0]),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await this.loadAllTasks();
    } catch (error) {
      console.error('Update task failed', error);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await this.loadAllTasks();
    } catch (error) {
      console.error('Delete task failed', error);
    }
  }

  ngOnDestroy() {}
}
