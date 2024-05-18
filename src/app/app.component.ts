import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ContactsComponent } from './coponents/contacts/contacts.component';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContactsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join';

  constructor( private route: Router, private longinService:LoginService){
  }
  ngOnInit() {
    this.checkIfUserIsLoggedin();
  }


  checkIfUserIsLoggedin() {
    if (this.longinService.getCurrentUserId() === undefined) {
      this.route.navigateByUrl('/login');
    } else {
      this.route.navigateByUrl('/mainPage');
    }
  }
}
