import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  acceptPolicy:boolean = false;

  constructor(public loginService:LoginService){}

  changeIcon(){
    this.acceptPolicy = !this.acceptPolicy;
  }
}
