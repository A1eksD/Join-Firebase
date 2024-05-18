import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../interface/user';
import { UsersService } from '../../service/users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  currentUser: User[] = [];
  firstLetter: string = '';
  secondLetter: string = '';
  thirdLetter: string = '';

  constructor(public loginService: LoginService, public userService: UsersService) {
  }

   getUserLetters(){
    const currentUserFromStorage = localStorage.getItem('currentUser');
    let cleanUserID = this.getCleanID(currentUserFromStorage!);
    let user = this.userService.allUsers!.filter(user => user.id === cleanUserID);
    if (user.length > 0) {
      this.getUserInitials(user); 
      return true;
    }
    return false;
  }

  getCleanID(currentUserFromStorage: string){
    return currentUserFromStorage.replace(/"/g, '');
  }

  getUserInitials(user: User[]) {
    if (user.length > 0) {
        const getName = user[0].firstName + '' + user[0].lastName;
        const firstUser =  this.splitNameValue(getName);
        this.firstLetter = firstUser[0]!.charAt(0).toUpperCase();
        this.secondLetter = firstUser[1]?.charAt(0).toUpperCase();
    }
  }

  splitNameValue(getName:string) {
    const fullname: string[] = getName.split(' ');
    const newFirstName: string = fullname[0];
    let newLastName: string = fullname[1];
    if (fullname[2]) {
      newLastName += ' ' + fullname[2];
    }
    return [newFirstName, newLastName];
  }

}
