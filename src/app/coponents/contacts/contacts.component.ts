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
  userDetails: any = '';


  constructor(public toggleService: ToggleBooleansService, public userService: UsersService){}

  getUserFirstLetter(user: User){
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }

  getUserSecondLetter(user: User){
    return user?.lastName?.charAt(0).toUpperCase() || '';
  }

  // addUser(user: User, event: Event) {
  //   event.stopPropagation();
  // }

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

  showContactDetails(user: User) {
    if (this.userDetails !== user) {
      this.userDetails = '';
      setTimeout(() => {
        this.userDetails = user;
      },300);
    } else if (this.userDetails === '') {
      this.userDetails = user;
    } else if(this.userDetails == user){
      this.userDetails = '';
    }
  }

  checkContactValue(){
    if (this.userDetails !== '') {
      return true;
    } else if (this.userDetails == '') {
      return setTimeout(() => {
         false;
        },300);
    }
    return true;
  }
  

  editContact(userDetails: User){

  }

  deleteContact(userDetails: User){

  }
}
