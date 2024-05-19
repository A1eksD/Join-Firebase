import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../service/tasks.service';
import { LoginService } from '../../service/login.service';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { UsersService } from '../../service/users.service';
import { User } from '../../interface/user';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  @ViewChild('taskWindoW') taskWindoW!: ElementRef;
  title: string = '';
  description: string = '';
  date: number = 0;
  priority: string = '';
  assignetTo: any[] = [];
  category: string = 'Technical Task';
  subtask: string = '';
  subtaskArray: string[] = [];
  showCategoryWindow: boolean = false;
  addedUser: boolean = false;
  subtaskToLong: boolean = false;

  constructor(
    public taskService: TasksService,
    private loginService: LoginService,
    public toggleService: ToggleBooleansService,
    public userService: UsersService
  ) {}

  prioLow(priority: string) {
    this.priority = priority;
  }

  prioMedium(priority: string) {
    this.priority = priority;
  }

  prioHigh(priority: string) {
    this.priority = priority;
  }

  checkValues() {
    const unicTimestamp = new Date().getTime();
    const task = {
      title: this.title,
      description: this.description,
      date: this.date,
      priority: this.priority || 'low',
      assignetTo: this.assignetTo || [],
      category: this.category || '',
      subtasks: this.subtaskArray || [],
      publishedTimestamp: unicTimestamp,
      createtBy: this.loginService.currentUser,
    };
    this.taskService.addTask([task]);
    this.clearValues();
  }

  checkDateAddTask() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const input = document.getElementById('date') as HTMLInputElement;

    if (input) {
      input.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    } else {
      console.error('Could not find input element with id="date"');
    }
  }

  openCategory(event: Event) {
    event.stopPropagation();
    this.toggleService.showCategoryWindow =
      !this.toggleService.showCategoryWindow;
  }

  openAssignedTo(event: Event) {
    event.stopPropagation();
    this.toggleService.showUserWindow = !this.toggleService.showUserWindow;
  }

  changeTask(task: string) {
    this.category = task;
  }

  clearValues() {
    this.title = '';
    this.description = '';
    this.date = 0;
    this.priority = '';
    this.assignetTo = [];
    this.category = '';
    this.subtask = '';
    this.subtaskArray = [];
  }

  getUserFirstLetter(user: User): string {
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user?.lastName?.charAt(0).toUpperCase() || '';
  }

  addUser(user: User, event: Event){
    event.stopPropagation();
    this.addedUser = !this.addedUser;
  }

  checkSubtaskLength(){
    if (this.subtask.length <= 30) {
      this.subtaskToLong = true;
      return true;
    } else{
      this.subtaskToLong = false;
      return false;
    }
  }
  
  addSubtask(){
    if (this.subtaskToLong && this.subtask !=='') {
      const subtaskValue = this.subtask;
      this.subtaskArray.push(subtaskValue);
      this.subtask = ''; 
    }
  }

  editSubtask(task: string){

  }

  deleteSubtask(task: string){
    const taskMsg = this.subtaskArray.indexOf(task);
    if (taskMsg !== -1) {
      this.subtaskArray.splice(taskMsg, 1);
    }
  }
}
