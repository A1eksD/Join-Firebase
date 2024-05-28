import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HeaderComponent } from './header/header.component';
import { ToggleBooleansService } from '../service/toggle-booleans.service';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    CommonModule,
    SummaryComponent,
    AddTaskComponent,
    BoardComponent,
    ContactsComponent,
    HeaderComponent
  ],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class ComponentsComponent {
  // selectedComponent: string = 'summary';

  constructor(public toggleService: ToggleBooleansService){
  }

  selectComponent(componentName: string) {
    this.toggleService.selectedComponent = componentName;
  }

  checkBooleansSummary(){
    this.toggleService.openBoard = false;
  }

  checkBooleansAddTask(){
    this.toggleService.openBoard = false;
  }

  checkBooleansBoard(){
    this.toggleService.openBoard = true;
  }

  checkBooleansContacts(){
    this.toggleService.openBoard = false;
  }

  toggleBooleans(){
    this.toggleService.showCategoryWindow = false;
    this.toggleService.showUserWindow = false;
    this.toggleService.slideInRightWindow = false;
  }
}
