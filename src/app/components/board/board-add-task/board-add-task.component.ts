import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleBooleansService } from '../../../service/toggle-booleans.service';
import { User } from '../../../interface/user';
import { UsersService } from '../../../service/users.service';
import { TasksService } from '../../../service/tasks.service';

@Component({
  selector: 'app-board-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board-add-task.component.html',
  styleUrl: './board-add-task.component.scss'
})
export class BoardAddTaskComponent {
  @Input() CategorY: string = '';
  @Input() openAddNewTaskWindow!: boolean;
  @Output() closeBigWindow = new EventEmitter<boolean>();
  title: string = '';
  descrption: string = '';
  date: number = 0;
  priority: string = '';
  assignetTo: any[] = [];
  chackedUser: any[] = [];
  category: string = 'Technical Task';
  subtask: string = '';
  subtaskArray: any[] = [];
  showCategoryWindow: boolean = false;
  addedUser: boolean = false;
  subtaskToLong: boolean = false;

  constructor(public toggleService: ToggleBooleansService, private userService: UsersService, public taskService: TasksService){}

  checkPrio(priority: string) {
    this.priority = priority;
  }


  closeWindow(){
    this.openAddNewTaskWindow = false;
    this.closeBigWindow.emit(this.openAddNewTaskWindow);
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

  openAssignedTo(event: Event) {
    event.stopPropagation();
    this.toggleService.showUserWindow = !this.toggleService.showUserWindow;
    this.toggleService.showCategoryWindow = false;
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
  
  openCategory(event: Event) {
    event.stopPropagation();
    this.toggleService.showCategoryWindow = !this.toggleService.showCategoryWindow;
    this.toggleService.showUserWindow = false;
  }

  changeTask(task: string, event: Event) {
    event.stopPropagation();
    this.taskService.clickedTaskCopy[0].categoryTask = task;
    this.toggleService.showCategoryWindow = false;
  }

  checkSubtaskLength(){
    if (this.subtask.length <= 30) {
      this.subtaskToLong = true;
      return true;
    } else{
      this.subtaskToLong = false;
      return false;
    }
  }

  deleteSubtask(task: string){
    const taskMsg = this.subtaskArray.indexOf(task);
    if (taskMsg !== -1) {
      this.subtaskArray.splice(taskMsg, 1);
      this.chackedUser.splice(taskMsg, 1); 
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

}
