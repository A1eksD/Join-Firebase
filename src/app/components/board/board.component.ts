import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { OnDragHighlightDirective } from '../../directives/on-drag-highlight.directive';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, OnDragHighlightDirective],
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
      category: 'open',
    },
    {
      id: 1,
      title: 'Kochen',
      category: 'open',
    },
    {
      id: 2,
      title: 'Einkaufen',
      category: 'closed',
    },
  ];
  currentDraggedElement: number = 0;
  openCategory: any[] = [];
  closedCategory: any[] = [];
  currentCategory: string = 'open';


  constructor(public toggleService: ToggleBooleansService) {}


  getOpenCategory() {
    this.openCategory = this.todos.filter((t) => t.category === 'open');
    if (this.openCategory.length > 0) {
      return true;
    }
    return false;
  }

  getCloseCategory() {
    this.closedCategory = this.todos.filter((t) => t.category === 'closed');
    if (this.closedCategory.length > 0) {
      return true;
    }
    return false;
  }

  startDragging(id: number) {
    this.currentDraggedElement = id;
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }

  moveTo(category: string) {
    const draggedIndex = this.currentDraggedElement;
    if (draggedIndex !== -1) {
      this.todos[draggedIndex].category = category;
    }
  }

  highlight(category: string) {
    this.currentCategory = category;
    
  }
  
  removeHighlight(category: string) {
    this.currentCategory = category;
  }
}
