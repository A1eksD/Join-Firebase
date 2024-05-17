import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor() { }

  getLogedinUserId() {
    let currentUser = '';
    if (currentUser !== null) {
      return JSON.parse(currentUser);
    }
  }
}
