import { ChangeDetectorRef, Component } from '@angular/core';
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
  SortedContacts: any[] = [];
  name:string = '';
  email:string = '';
  phoneNr:any = undefined;
  editName:string = '';
  editEmail:string = '';
  editPhoneNr:any = undefined;
  firstName:string = '';
  lastName:string = '';
  firstChar:string = '';
  headerInputValue:string = '';
  closeUserWindow:boolean = false;
  closeUserEditWindow:boolean = false;
  userDetails: any = '';
  getUserToEdit: any = '';
  searchBarUsersArray: any[] = [];
  searchBarUsersArraySorted: any[] = [];
  noUserFound: boolean = false;


  constructor(public toggleService: ToggleBooleansService, public userService: UsersService){}

  ngOnInit(){
    this.showUserContacts();    
  }

  getUserFirstLetter(user: User){
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }

  getUserSecondLetter(user: User){
    return user?.lastName?.charAt(0).toUpperCase() || '';
  }

  saveUserData() {
    if (this.checkCurrentData()) {
      this.splitName(this.name);
      const user: User = {
        firstName: this.firstName,
        lastName: this.lastName || '',
        email: this.email,
        savedUsers: [],
        phoneNumber: this.phoneNr || '',
        status: false,
        color: this.generateRandomColor(),
        uid: (Math.random() * 341235).toString(),
      };
      this.userService.addNewContact([user]);
      this.showUserContacts();
      this.returnBack();
    }
  }

  splitName(fullName: string){
    const fullname: string[] = fullName.split(' ');
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
    this.closeUserEditWindow = false;
    this.userDetails = '';
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
  

  editContact(userDetails: User){
    this.getUserToEdit = userDetails;
    this.closeUserEditWindow = true;
    this.editName = this.getFullName(userDetails);
    this.editEmail = userDetails.email;
    this.editPhoneNr = userDetails.phoneNumber;
    this.checkEditData();
  }

  getFullName(userDetails: User){
    const fullName = userDetails.firstName + ' ' + userDetails.lastName;
    return fullName;
  }


  checkEditData(){
    if (this.editName.length < 3) {
      return false;
    }
    if (!this.checkEditEmail()) {
      return false;
    }
    return true;
  }

  checkEditEmail(): boolean {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.editEmail);
  }

  deleteContact(userDetails: User){

  }

  saveUserEditData(){
    this.splitName(this.editName);
    const user: User = {
      firstName: this.firstName,
      lastName: this.lastName || '',
      email: this.editEmail,
      savedUsers: [],
      phoneNumber: this.editPhoneNr || '',
      status: false,
      color: this.getUserToEdit.color,
      uid: this.getUserToEdit.uid
    };
    this.userService.updateEditContact([user]);
    this.returnBack();
  }

  showUserContacts(){
    const currentUser = localStorage.getItem('currentUser');
    const filterUser = this.userService.allUsers.filter(u => u.id === this.userService.getCleanID(currentUser!))
    this.SortedContacts = this.sortByFirstLetter(filterUser[0].savedUsers);
    return this.SortedContacts;
  }

  sortByFirstLetter(contacts: User[]): User[] {
    return contacts.sort((a, b) => {
        const nameA = a.firstName.toUpperCase();
        const nameB = b.firstName.toUpperCase();
        return nameA.localeCompare(nameB);
    });
  }

  getFirstCharacter(user: User): string | null {
    const firstLetter = user.firstName.charAt(0).toUpperCase();
    if (this.firstChar.includes(firstLetter)) {
      return '';
    }
    this.firstChar = firstLetter;
    return this.firstChar;
  }
  
  getHeaderInputValue() {
    if (this.headerInputValue !== '') {
      this.noUserFound = true;
      const currentUser = localStorage.getItem('currentUser');
      // Filter current user's contacts
      const filteredUser = this.userService.allUsers.filter((u) => u.id === this.userService.getCleanID(currentUser!));
      // Filter common users based on search input
      const filterUserExistingUserName = filteredUser[0].savedUsers.filter((user: any) => (user.firstName.includes(this.headerInputValue)));
      const sortedFilterUserExistingUserName = this.sortFilterUserExistingUserName(filterUserExistingUserName);
      //------------------- 
      const filterUserToAddName = this.userService.commonUsers.filter((user: any) => (user.savedUsers[0].firstName.includes(this.headerInputValue)));
      const sortedFilterUserToAddName = this.sortFilterUserToAddName(filterUserToAddName);

      // if (!this.isEqual(sortedFilterUserExistingUserName, sortedFilterUserToAddName)) {
      this.checkDifferentUser(sortedFilterUserExistingUserName, sortedFilterUserToAddName);
    } else {
      this.noUserFound = false;
    }
  }

  sortFilterUserExistingUserName(contacts: User[]): User[]{
    return contacts.sort((a, b) => {
      const nameA = a.firstName.toUpperCase();
      const nameB = b.firstName.toUpperCase();
      return nameA.localeCompare(nameB);
    });
  }

  sortFilterUserToAddName(contacts: User[]): User[]{
    return contacts.sort((a, b) => {
      const nameA = a.savedUsers![0].firstName.toUpperCase();
      const nameB = b.savedUsers![0].firstName.toUpperCase();
      const getName = nameA.localeCompare(nameB);
      this.searchBarUsersArraySorted.push(getName);
      return getName;
    });
  }

  
  isEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (typeof arr1[i] !== typeof arr2[i].savedUsers[i]) return false;
      if (Array.isArray(arr1[i]) && Array.isArray(arr2[i].savedUsers[i])) {
        if (!this.isEqual(arr1[i], arr2[i].savedUsers[i])) return false;
      } else if (arr1[i] !== arr2[i].savedUsers[i]) return false;
    }
    return true;
  }

  checkDifferentUser(filterUserExistingUserName: User[], filterUserToAddName: User[]) {
    this.searchBarUsersArray = [];
    for (let i = 0; i < filterUserToAddName.length; i++) {
      const userContacts = filterUserExistingUserName[i];
  
      // Check if userContacts is undefined before accessing its properties
      if (!userContacts) {
        this.searchBarUsersArray.push(filterUserToAddName[i].savedUsers![0]);
        continue; // Skip to the next iteration if userContacts is undefined
      }
  
      if (userContacts.uid === '' || userContacts.uid !== filterUserToAddName[i].savedUsers![0].uid) {
        this.searchBarUsersArray.push(filterUserToAddName[i].savedUsers![0]);
        console.log('-------------', this.searchBarUsersArray);
      }
    }
  }
  

  checkUserFirstName(user: User[]) {
    const userFirstNameExists = this.searchBarUsersArray.some(user =>
      user.firstName.toLowerCase().includes(this.headerInputValue.toLowerCase())
    );
  
    if (userFirstNameExists) {
      this.searchBarUsersArray.push(user);
      this.noUserFound = true;
      return true;
    } else {
      this.noUserFound = false;
      return false;
    }
  }
  
  
  getSplitArray(savedUsers: User[]){

  }

  checkInputInSidebar(){
    if (this.headerInputValue) {
      return true;
    } else {
      return false;
    }
  }
  
}
