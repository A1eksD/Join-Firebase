import { Component } from '@angular/core';
import { User } from '../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsers: any[] = [];
  name:string = '';
  email:string = '';
  phoneNr:any = undefined;

  constructor(){}

  getUserFirstLetter(user: User){}

  getUserSecondLetter(user: User){}

  addUser(user: User, event: Event) {
    event.stopPropagation();
  }

  saveUserData(){
    if (this.checkCurrentData()) {
      
    }
  }

  checkCurrentData() {
    if (this.name.length < 3) {
      return false;
    }
    if (!this.checkEmail()) {
      return false;
    }
    return true;
  }

  checkEmail(): boolean {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }
  

  returnBack(){
    this.name = '';
    this.email = '';
    this.phoneNr = undefined;
  }

}
