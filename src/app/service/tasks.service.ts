import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, onSnapshot } from '@angular/fire/firestore';
import { Task } from '../interface/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  firestore: Firestore = inject(Firestore);
  allTasks: Task[] = [];
  clickedTask: any;

  unsubTasks;
  constructor() {
    this.unsubTasks = this.subTaskList();
  }

  subTaskList() {
    return onSnapshot(collection(this.firestore, 'tasks'), (list) => {
      this.allTasks = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as Task;
        this.allTasks.push(userWithId);
      });
    });
  }

  async addTask(task: Task[]){
    const usersCollection = collection(this.firestore, 'tasks');
    try {
      await addDoc(usersCollection, task[0]);
    } catch (error) {
      console.error('Create task failed');
      
    }
  }

  ngOnDestroy() {
    this.subTaskList();
  }
}
