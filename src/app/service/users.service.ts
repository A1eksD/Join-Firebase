import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  firestore: Firestore = inject(Firestore);
  allUsers: any[] = [];
  getUserIDs: string[] = [];
  commonUsers: User[] = [];

  unsubUser;
  unsubCommonUsers;

  constructor() { 
    this.unsubUser = this.subUserList();
    this.unsubCommonUsers = this.subCommonUsersList();
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

  subCommonUsersList(){
    return onSnapshot(collection(this.firestore, 'users'), (list) => {
      this.commonUsers = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as User;
        this.commonUsers.push(userWithId);
      });
    });
  }

  getLogedinUserId() {
    let currentUser = '';
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
  }

  async addNewContact(user: User[]){
    const currentUser = localStorage.getItem('currentUser');
    const getAddedUsers = this.allUsers.filter(user => user.id === this.getCleanID(currentUser!));
    const existingUserSavedUsers = getAddedUsers[0].savedUsers.filter((savedUser: any) => !!savedUser) || [];
    const allMembers: User[] = [...user, ...existingUserSavedUsers];
    try {
      const docRef = doc(this.firestore, `users/${getAddedUsers[0].id}`);
      await updateDoc(docRef, { savedUsers: allMembers });
      const docReff = await addDoc(collection(this.firestore, "commonUsers"), { savedUsers: user });
      console.log("Document written with ID: ", docReff.id);
    } catch (error) {
      console.error('Added user failed');
    }
  }

  getCleanID(currentUserFromStorage: string){
    return currentUserFromStorage.replace(/"/g, '');
  }

  ngOnDestroy() {
    this.unsubUser();
  }
}
