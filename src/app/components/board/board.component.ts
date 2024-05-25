import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { OnDragHighlightDirective } from '../../directives/on-drag-highlight.directive';
import { TasksService } from '../../service/tasks.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, OnDragHighlightDirective, TaskComponent, FormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @ViewChild('openArea') open!: ElementRef;
  @ViewChild('closedArea') closed!: ElementRef;

  todos = [
    {
      id: 0,
      title: 'Putzen',
      category: 'todo',
    },
    {
      id: 1,
      title: 'Kochen',
      category: 'todo',
    },
    {
      id: 2,
      title: 'Einkaufen',
      category: 'inProgress',
    },
  ];
  currentDraggedElement: string = '';
  toDoCategory: any[] = [];
  inProgressCategory: any[] = [];
  awaitFeedbackCategory: any[] = [];
  doneCategory: any[] = [];
  currentCategory: string = 'open';


  constructor(public toggleService: ToggleBooleansService, public taskService: TasksService) {}


  getToDOCategory() {
    this.toDoCategory = this.taskService.allTasks.filter((t) => t.category === 'toDo');
    if (this.toDoCategory.length > 0) {
      return true;
    }
    return false;
  }

  getInProgressCategory() {
    this.inProgressCategory = this.taskService.allTasks.filter((t) => t.category === 'inProgress');
    if (this.inProgressCategory.length > 0) {
      return true;
    }
    return false;
  }

  getAwaitFeedbackCategory() {
    this.awaitFeedbackCategory = this.taskService.allTasks.filter((t) => t.category === 'awaitFeedback');
    if (this.awaitFeedbackCategory.length > 0) {
      return true;
    }
    return false;
  }

  getDoneategory() {
    this.doneCategory = this.taskService.allTasks.filter((t) => t.category === 'done');
    if (this.doneCategory.length > 0) {
      return true;
    }
    return false;
  }

  startDragging(id: string) {
    this.currentDraggedElement = id; 
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }

  moveTo(category: string) {
    const draggedIndex = this.currentDraggedElement;
    if (draggedIndex !== null) {
      const getCurrentTask = this.taskService.allTasks.filter((t) => t.id === this.currentDraggedElement);
      getCurrentTask[0].category = category;
    }
  }

  highlight(category: string) {
    this.currentCategory = category;
    
  }
  
  removeHighlight(category: string) {
    this.currentCategory = category;
  }
}
