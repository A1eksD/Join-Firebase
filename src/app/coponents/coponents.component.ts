import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { LoginService } from '../service/login.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-coponents',
  standalone: true,
  imports: [
    CommonModule,
    SummaryComponent,
    AddTaskComponent,
    BoardComponent,
    ContactsComponent,
    HeaderComponent
  ],
  templateUrl: './coponents.component.html',
  styleUrl: './coponents.component.scss',
})
export class CoponentsComponent {
  selectedComponent: string = 'summary';

  constructor(private longinService:LoginService){
  }

  selectComponent(componentName: string) {
    this.selectedComponent = componentName;
  }

}
