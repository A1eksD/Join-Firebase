export interface Task {
    id?: string;
    title: string;
    description: string;
    date: number;
    priority?: number;
    assignetTo?: any[];
    category: number;
    subtasks?: any[];
    publishedTimestamp: number;
    createtBy: string;
    categoryTask: number;
  }
  