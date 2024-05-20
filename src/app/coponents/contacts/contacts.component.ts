import { Component } from '@angular/core';
import { User } from '../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { UsersService } from '../../service/users.service';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsersArray: any[] = [];
  name:string = '';
  email:string = '';
  phoneNr:any = undefined;
  firstName:string = '';
  lastName:string = '';
  closeUserWindow:boolean = false;

  constructor(public toggleService: ToggleBooleansService, private userService: UsersService){
    setInterval(() => {
      console.log(this.closeUserWindow);
      
    }, 500)
  }

  getUserFirstLetter(user: User){}

  getUserSecondLetter(user: User){}

  addUser(user: User, event: Event) {
    event.stopPropagation();
  }

  saveUserData() {
    if (this.checkCurrentData()) {
      this.splitName();
      const user: User = {
        firstName: this.firstName,
        lastName: this.lastName || '',
        email: this.email,
        savedUsers: [],
        phoneNumber: this.phoneNr || '',
        status: false,
        color: this.generateRandomColor(),
      };
      this.userService.addNewContact([user]);
      this.returnBack();
    }
  }

  splitName(){
    const fullname: string[] = this.name.split(' ');
    this.firstName = fullname[0];
    this.lastName = fullname[1];
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
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phoneNr = undefined;
    this.closeUserWindow = false;
  }

  openAddContactWindow(event: Event){
    event.stopPropagation();
    this.closeUserWindow = true;
  }

  generateRandomColor(){
    let hexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let color = "";
    for(let i=0; i<6; i++){
      color += hexArray[Math.floor(Math.random()*16)];
    }
    return `#${color}`    
  }

  stopPropagation(event: Event){
    event.stopPropagation();
  }
}
