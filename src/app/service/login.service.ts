import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../interface/user';
import { Router } from '@angular/router';

const API = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  name: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  passwordLogin: string = '';
  password1: string = '';
  password2: string = '';
  allUsers: User[] = [];
  samePw: boolean = false;
  currentUser: string = '';
  errorMessage: string = '';
  loginBoolean: boolean = false;

  constructor(private http: HttpClient, private route: Router) {
    this.startAutoLogoutTimer();
  }

  startAutoLogoutTimer() {
    const timeout = 20 * 60 * 1000;
    setTimeout(() => this.deleteTokenFromLocalStorage(), timeout);
  }

  // ─── Register ────────────────────────────────────────────────────────────────

  register() {
    if (!this.loginBoolean) return;
    this.getFirstAndLastName();
    this.checkPW();
    if (!this.samePw) {
      console.error('Passwords do not match');
      return;
    }
    const userData: User = {
      firstName: this.firstName,
      lastName: this.lastName || '',
      savedUsers: [],
      email: this.email,
      password: this.password1,
      status: true,
    };
    this.createUser(userData).subscribe({
      next: () => {
        this.route.navigateByUrl('/mainPage');
        setTimeout(() => this.clearUserData(), 1500);
      },
      error: (err) => {
        console.error('Register failed:', err);
        this.errorMessage = '*Registration failed. Please try again.';
      }
    });
  }

  // ─── Login ───────────────────────────────────────────────────────────────────

  login() {
    this.http
      .post<{ token: string }>(`${API}/login`, {
        email: this.email,
        password: this.passwordLogin,
      })
      .pipe(
        catchError((err) => {
          this.switchCase(err.status);
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res?.token) {
          this.saveTokenToLocalStorage(res.token);
          this.route.navigateByUrl('/mainPage');
          setTimeout(() => {
            this.clearUserData();
            this.startAutoLogoutTimer();
          }, 1500);
        }
      });
  }

  // ─── Guest Login ─────────────────────────────────────────────────────────────

  guestLogin() {
    this.http
      .post<{ token: string }>(`${API}/login`, {
        //dummy acc
        email: 'alesk@aleks.de',
        password: '123456',
      })
      .pipe(
        catchError((err) => {
          console.error(err);
          this.errorMessage = 'Fehler bei der Gastanmeldung. Bitte versuchen Sie es später erneut.';
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res?.token) {
          this.saveTokenToLocalStorage(res.token);
          this.route.navigateByUrl('/mainPage');
          setTimeout(() => this.clearUserData(), 1500);
        }
      });
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────

  logout() {
    this.updateUserOnlineStatus(false).subscribe(() => {
      this.deleteTokenFromLocalStorage();
      this.route.navigate(['/login']);
    });
  }

  // ─── API Calls ───────────────────────────────────────────────────────────────

  createUser(userData: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API}/registerUser`, userData).pipe(
      tap((res) => {
        this.saveTokenToLocalStorage(res.token);
      }),
      catchError((err) => {
        console.error('Create user failed', err);
        throw err;
      })
    );
  }

  updateUserOnlineStatus(online: boolean = true): Observable<any> {
    return this.http
      .patch<any>(`${API}/users/status/`, { status: online })
      .pipe(
        catchError((err) => {
          console.error('Update status failed', err);
          return of(null);
        })
      );
  }

  // ─── Token Utilities ─────────────────────────────────────────────────────────

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUserId(): string | undefined {
    return this.getToken() ?? undefined;
  }

  private saveTokenToLocalStorage(token: string) {
    localStorage.setItem('authToken', token);
    //DOTO: hier auch username speichern und dann später im icon oben rechts anzeigen
  }

  deleteTokenFromLocalStorage() {
    localStorage.removeItem('authToken');
  }

  // ─── Utilities ───────────────────────────────────────────────────────────────

  checkPW() {
    if (this.password1 === this.password2) {
      this.samePw = true;
      return this.password1;
    }
    this.samePw = false;
    return '';
  }

  clearUserData() {
    this.name = '';
    this.email = '';
    this.password1 = '';
    this.password2 = '';
    this.passwordLogin = '';
  }

  getFirstAndLastName() {
    const fullname = this.name.split(' ');
    this.firstName = fullname[0];
    this.lastName = fullname[1] || '';
    if (fullname[2]) this.lastName += ' ' + fullname[2];
  }

  switchCase(statusCode: number) {
    switch (statusCode) {
      case 401:
        this.errorMessage = '*Invalid credentials. Please check your entries.';
        break;
      case 429:
        this.errorMessage = '*Too many requests. Please try again later.';
        break;
      default:
        this.errorMessage = '*Please check your entries.';
        break;
    }
  }
}
