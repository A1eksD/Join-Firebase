import { Component, Input } from '@angular/core';
import { User } from '../../../../../interface/user';
import { ToggleBooleansService } from '../../../../../service/toggle-booleans.service';
import { TasksService } from '../../../../../service/tasks.service';
import { UsersService } from '../../../../../service/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    if (!this.chackedUserArray.some(u => u.uid === user.uid)) {
      this.chackedUserArray.push(user);
    } else {
      this.chackedUserArray = this.chackedUserArray.filter(u => u.uid !== user.uid);
    }
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
    if (this.taskService.clickedTask[0].subtask.length <= 30) {
      this.subtaskToLong = true;
      return true;
    } else{
      this.subtaskToLong = false;
      return false;
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
}
