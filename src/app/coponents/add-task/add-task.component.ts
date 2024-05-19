import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../service/tasks.service';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {

  title: string = '';
  description: string = '';
  date: number = 0;
  priority: string = '';
  assignetTo: any[] = [];
  category: string = '';
  subtasks: string[] = [];
  
  constructor(public taskService:TasksService, private loginService: LoginService){}

  prioLow(priority: string){
    this.priority = priority;
  }

  prioMedium(priority: string){
    this.priority = priority;
  }

  prioHigh(priority: string){
    this.priority = priority;
  }

  checkValues(){
    const unicTimestamp = new Date().getTime();
    const task = {
      title: this.title,
      description: this.description,
      date: this.date,
      priority: this.priority,
      assignetTo: this.assignetTo || [],
      category: this.category || '',
      subtasks: this.subtasks || [],
      publishedTimestamp: unicTimestamp,
      createtBy: this.loginService.currentUser
    }
    this.taskService.addTask([task]);
    this.clearValues();
  }

  checkDateAddTask() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1)); // Get tomorrow's date
    const input = document.getElementById('date') as HTMLInputElement;
  
    if (input) {
      input.setAttribute('min', tomorrow.toISOString().split('T')[0]); // Set minimum date to tomorrow
    } else {
      console.error('Could not find input element with id="date"');
    }
  }
  
  openCategory(){}

  openAssignedTo(){}

  
  clearValues(){
    this.title = '';
    this.description = '';
    this.date = 0;
    this.priority = '';
    this.assignetTo = [];
    this.category = '';
    this.subtasks = [];
  }
}
