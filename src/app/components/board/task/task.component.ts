import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interface/user';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CardComponent } from './card/card.component';
import { enableNetwork } from '@angular/fire/firestore';
import { ToggleBooleansService } from '../../../service/toggle-booleans.service';
import { Task } from 'zone.js/lib/zone-impl';
import { TasksService } from '../../../service/tasks.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatProgressBarModule, CardComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  @Input() category: string = '';
  @Input() createtBy: string = '';
  @Input() date: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() assignetTo: User[] = [];
  @Input() subtasks: any[] = [];
  currentTask: any;
  
  constructor(public toggleService: ToggleBooleansService, private taskService: TasksService){}
  openCard: boolean = false;

  getUserFirstLetter(user: User): string {
    return user!.firstName.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user!.lastName.charAt(0).toUpperCase() || '';
  }

  checkAmountOfSubtasks(){
    if (this.subtasks) {
      return this.subtasks.length;
    } else {
      return '';
    }
  }

  openTaskCatd(taskID: string){
    const getTask = this.taskService.allTasks.filter(t => t.id === taskID);
    // const getTaskCopy = this.taskService.allTasksCopy.filter(t => t.id === taskID);
    const getTaskCopy = JSON.parse(JSON.stringify(getTask)); 
    this.taskService.clickedTask = getTask;
    this.taskService.clickedTaskCopy = getTaskCopy;
    this.toggleService.openWhiteBox = true;
  }

  checkCategory(){
    if (this.category === 'Technical Task') {
      return true;
    } else {
      return false;
    }
  }
  // closeBigWindow(event: boolean){
  //   this.openCard = event;
  // }
}
