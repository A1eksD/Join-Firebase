import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  firestore: Firestore = inject(Firestore);
  allUsers: any[] = [];
  getUserIDs: any[] = [];
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
      this.addContactDocToCommonUsers(user);
    } catch (error) {
      console.error('Added contact failed');
    }
  }

  async addContactDocToCommonUsers(user: User[]){
    try {
      await addDoc(collection(this.firestore, "commonUsers"), { savedUsers: user });
    } catch (error) {
      console.error('Added contact failed');
    }
  }

  async updateEditContact(user: User[]){
    const currentUser = localStorage.getItem('currentUser');
    const filteredUser = this.allUsers.filter(u => u.id === this.getCleanID(currentUser!));
    const contacts = filteredUser[0].savedUsers.filter((u: User) => u.id === user[0].id);
    try {
      const docRef = doc(this.firestore, `users/${filteredUser[0].id}/savedUsers/${contacts[0].id}`);
      await updateDoc(docRef, {user});
      this.updateContactDocToCommonUsers(user);
    } catch (error) {
      console.error('Added contact failed');
    }
  }

  async updateContactDocToCommonUsers(user: User[]){
    try {
      await addDoc(collection(this.firestore, `commonUsers/${user[0].id}`), { savedUsers: user });
    } catch (error) {
      console.error('Added contact failed');
    }
  }

  getCleanID(currentUserFromStorage: string){
    return currentUserFromStorage.replace(/"/g, '');
  }

  ngOnDestroy() {
    this.unsubUser();
  }
}
