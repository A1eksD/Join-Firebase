import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interface/user';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CardComponent } from './card/card.component';
import { enableNetwork } from '@angular/fire/firestore';

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
  @Input() assignetTo: User[] = [];
  @Input() subtasks: any[] = [];

  constructor(){}
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

  openTaskCatd(){
    this.openCard = !this.openCard;
  }

  closeBigWindow(event: boolean){
    this.openCard = event;
  }
}
