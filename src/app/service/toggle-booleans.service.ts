import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleBooleansService {

  constructor() { }

  openBoard:boolean = false;
  showCategoryWindow:boolean = false;
  showUserWindow:boolean = false;
}
