import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleBooleansService {

  constructor() { }

  openBoard:boolean = false;
}
