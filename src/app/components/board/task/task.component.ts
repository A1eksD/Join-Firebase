import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interface/user';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatProgressBarModule],
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
  @Input() assignetTo: User[] = [];
  @Input() subtasks: string[] = [];

  constructor(){}

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
}
