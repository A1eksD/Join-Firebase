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
  selectedComponent: string = 'summary';

  constructor(private toggleService: ToggleBooleansService){
  }

  selectComponent(componentName: string) {
    this.selectedComponent = componentName;
  }

  checkBooleansSummary(){
    this.toggleService.openBoard = false;
    console.log(this.toggleService.openBoard);
    
  }

  checkBooleansAddTask(){
    this.toggleService.openBoard = false;
    console.log(this.toggleService.openBoard);
  }

  checkBooleansBoard(){
    this.toggleService.openBoard = true;
    console.log(this.toggleService.openBoard);
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
