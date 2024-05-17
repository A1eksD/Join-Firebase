
import { Routes } from '@angular/router';
import { CoponentsComponent } from './coponents/coponents.component';
import { SummaryComponent } from './coponents/summary/summary.component';
import { AddTaskComponent } from './coponents/add-task/add-task.component';
import { BoardComponent } from './coponents/board/board.component';
import { ContactsComponent } from './coponents/contacts/contacts.component';
import { LoginComponent } from './coponents/login/login.component';
import { RegisterComponent } from './coponents/login/register/register.component';

export const routes: Routes = [
    { path: '', component: CoponentsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'mainPage', component: CoponentsComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'addTask', component: AddTaskComponent },
    { path: 'board', component: BoardComponent },
    { path: 'contact', component: ContactsComponent },
];
