import { Component, Input } from '@angular/core';
import { User } from '../../../../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../../service/users.service';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent {
  @Input() category: string = '';
  @Input() createtBy: string = '';
  @Input() date: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() title: string = '';
  @Input() assignetTo: User[] = [];
  @Input() subtasks: any[] = [];

  constructor(private userService: UsersService){}

  getProiImg(){
    if(this.priority === 'low'){
      return 'prio_baja.svg';
    } else if (this.priority === 'medium') {
      return 'prio_media.svg';
    } else if (this.priority === 'high') {
      return 'prio_alta.svg';
    }
    return '';
  }

  getUserFirstLetter(user: User): string {
    return user!.firstName.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user!.lastName.charAt(0).toUpperCase() || '';
  }

  getuserName(){
    const currentUser = localStorage.getItem('currentUser');
    const filterUser = this.userService.allUsers.filter(u => u.id === this.userService.getCleanID(currentUser!))
    return `Task created by: ${filterUser[0].firstName} ${filterUser[0].lastName}`;
  }
}
