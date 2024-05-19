import {
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
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

  constructor(private renderer: Renderer2) {}

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

  highlight(element: ElementRef) {
    // document.getElementById(category)!.classList.add('dragAreaHighlight');
    // element.classList.add('dragAreaHighlight');
    this.renderer.addClass(element.nativeElement, 'dragAreaHighlight');
    console.log(`Highlighting ${element.nativeElement.id}`);
  }
  
  removeHighlight(element: ElementRef) {
    // element.classList.remove('dragAreaHighlight');
    this.renderer.removeClass(element.nativeElement, 'dragAreaHighlight');
    console.log(`Removing highlight from ${element.nativeElement.id}`);
  }
}
