import { Component } from '@angular/core';
import { User } from '../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  assignetTo: User[] = [];
  category: string = '';
  subtasks: string[] = [];
  
}
