import { Component, Input } from '@angular/core';
import { User } from '../../../../../interface/user';
import { ToggleBooleansService } from '../../../../../service/toggle-booleans.service';
import { TasksService } from '../../../../../service/tasks.service';
import { UsersService } from '../../../../../service/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from 'zone.js/lib/zone-impl';

@Component({
  selector: 'app-card-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-edit.component.html',
  styleUrl: './card-edit.component.scss'
})
export class CardEditComponent {
  // @Input() category: string = '';
  // @Input() id: string = '';
  // @Input() createtBy: string = '';
  // @Input() date: string = '';
  // @Input() description: string = '';
  // @Input() priority: string = '';
  // @Input() title: string = '';
  // @Input() assignetTo: User[] = [];
  // @Input() subtasks: string[] = [];
  // @Input() currentTask: any;

  priority: string = '';
  category: string = 'Technical Task';
  chackedUserArray: any[] = [];
  subtaskToLong: boolean = false;
  subtask: string = '';
  subtaskArray: any[] = [];
  chackedUser: any[] = [];
  disabledButton: boolean = false;

  constructor(private userService: UsersService, public toggleService: ToggleBooleansService, public taskService: TasksService){}

  prioLow(priority: string) {
    this.priority = priority;
  }

  prioMedium(priority: string) {
    this.priority = priority;
  }

  prioHigh(priority: string) {
    this.priority = priority;
  }

  openAssignedTo(event: Event) {
    event.stopPropagation();
    this.toggleService.showUserWindow = !this.toggleService.showUserWindow;
  }

  getUserFirstLetter(user: User): string {
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user?.lastName?.charAt(0).toUpperCase() || '';
  }

  getContactsFromCurrenUser(){
    const currentUser = localStorage.getItem('currentUser');
    const cleanUserID = currentUser!.replace(/"/g, '');
    const filteredUser = this.userService.allUsers.filter(u => u.id === cleanUserID);
    const filteredContacts = this.sortFilterUserExistingUserName(filteredUser[0].savedUsers);
    return filteredContacts;
  }

  sortFilterUserExistingUserName(contacts: User[]): User[]{
    return contacts.sort((a, b) => {
      const nameA = a.firstName.toUpperCase();
      const nameB = b.firstName.toUpperCase();
      return nameA.localeCompare(nameB);
    });
  }

  addUser(user: User, event: Event) {
    event.stopPropagation();
    const userIndex = this.chackedUser.findIndex(u => u.uid === user.uid);
  
    if (userIndex !== -1) {
      this.chackedUser.splice(userIndex, 1);
    } else {
      this.chackedUser.push(user);
    }
  }
  

  getChackedUserArray(){
    this.chackedUser = this.taskService.clickedTaskCopy[0].assignetTo;
    return this.chackedUser;
  }

  chackAssigedToContacts(){
    const arrayLenght = this.taskService.clickedTaskCopy[0].assignetTo;
    if (arrayLenght.length > 0) {
      return true;
    }
    return false;
  }

  openCategory(event: Event) {
    event.stopPropagation();
    this.toggleService.showCategoryWindow =
      !this.toggleService.showCategoryWindow;
  }

  changeTask(task: string, event: Event) {
    event.stopPropagation();
    this.category = task;
    this.toggleService.showCategoryWindow = false;
  }

  checkSubtaskLength(){
    if (this.taskService.clickedTaskCopy[0].subtasks.length <= 30) {
      this.subtaskToLong = true;
      return true;
    } else{
      this.subtaskToLong = false;
      return false;
    }
  }

  addSubtaskByEnter(event: KeyboardEvent){
    if(event.keyCode == 13){
      this.addSubtask();
    }
  }

  addSubtask(){
    if (this.subtaskToLong && this.subtask !=='') {
      const subtaskValue = {subtask: this.subtask, subtaskDone : false};
      this.subtaskArray.push(subtaskValue);
      this.subtask = ''; 
    }
  }

  deleteSubtask(task: string){
    const taskMsg = this.subtaskArray.indexOf(task);
    if (taskMsg !== -1) {
      this.subtaskArray.splice(taskMsg, 1);
      this.chackedUser.splice(taskMsg, 1); 
    }
  }

  checkDateAddTask() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const input = document.getElementById('date') as HTMLInputElement;

    if (input) {
      input.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    } else {
      console.error('Could not find input element with id="date"');
    }
  }

  closeWindow(){
    this.toggleService.openWhiteBox = false;
  }

  checkIfVluesChanged(){
    const currentTaskIdCopy = this.taskService.clickedTaskCopy[0];
    const currentTaskID = this.taskService.clickedTask[0];
    if(this.checkArray(currentTaskIdCopy, currentTaskID)){
      return false;
    }
    if (currentTaskIdCopy.title == '') {
      return false;
    }
    if (currentTaskIdCopy.description == '') {
      return false
    }
    if (currentTaskIdCopy.date == 0) {
      return false
    }
    return true;
  }
  
  checkArray(currentTaskIdCopy: any, currentTaskID: any){
    return  currentTaskIdCopy.title === currentTaskID.title &&
    currentTaskIdCopy.description === currentTaskID.description &&
    currentTaskIdCopy.date === currentTaskID.date &&
    currentTaskIdCopy.priority === currentTaskID.priority &&
    currentTaskIdCopy.category === currentTaskID.category &&
    JSON.stringify(currentTaskIdCopy.assignetTo) === JSON.stringify(currentTaskID.assignetTo) &&
    JSON.stringify(currentTaskIdCopy.subtasks) === JSON.stringify(currentTaskID.subtasks);
  }

  getSubtaskArrayData(){
    this.subtaskArray = this.taskService.clickedTaskCopy[0].subtasks;
    return this.subtaskArray;
  }

  isChecked(user: User): boolean {
    // Get the assigned users from the task copy
    const assignedUsers = this.taskService.clickedTaskCopy[0].assignetTo;
  
    // Find the user by ID in the assigned users array
    return assignedUsers.some((assignedUser: any) => assignedUser.uid === user.uid);
  }
  
}
