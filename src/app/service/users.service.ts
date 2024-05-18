import { Injectable, inject } from '@angular/core';
import { Firestore, collection, onSnapshot } from '@angular/fire/firestore';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  firestore: Firestore = inject(Firestore);
  allUsers: User[] = [];
  getUserIDs: string[] = [];
  unsubUser;

  constructor() { 
    this.unsubUser = this.subUserList();
  }

  subUserList() {
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.allUsers = [];
      this.getUserIDs = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as User;
        this.allUsers.push(userWithId);
        this.getUserIDs.push(userWithId.id!);
      });
    });
  }

  getLogedinUserId() {
    let currentUser = '';
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
  }
}
