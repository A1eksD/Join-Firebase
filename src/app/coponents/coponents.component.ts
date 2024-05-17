import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-coponents',
  standalone: true,
  imports: [
    CommonModule,
    SummaryComponent,
    AddTaskComponent,
    BoardComponent,
    ContactsComponent,
  ],
  templateUrl: './coponents.component.html',
  styleUrl: './coponents.component.scss',
})
export class CoponentsComponent {

  constructor( private route: Router, private longinService:LoginService){}

  ngOnInit() {
    this.checkIfUserIsLoggedin();
    // this.routeUserId();
  }


  checkIfUserIsLoggedin() {
    let currentUser = this.longinService.currentUser;
    if (currentUser !== '') {
      this.route.navigateByUrl('/login');
    }
  }

  // routeUserId() {
  //   if (this.router.params.subscribe()) {
  //     this.router.params.subscribe((params) => {
  //       this.currentChannel = params['id'];
  //     });
  //   }
  // }
}
