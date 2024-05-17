export interface Task {
    id: string;
    title: string,
    decription: string;
    date: number;
    priority?: string,
    assignetTo?: string[],
    category: string;
    subtasks?: string;
    publishedTimestamp: number;
    createtBy: string;
}
