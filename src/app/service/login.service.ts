import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../interface/user';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { Router } from '@angular/router';

const API = 'http://localhost:4200/api';

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
  lastActivityTimestamp: number = 0;
  autoLogoutTimer: number | null = null;

  constructor(private http: HttpClient, private route: Router) {
    this.startAutoLogoutTimer();
  }

  startAutoLogoutTimer() {
    const timeout = 20 * 60 * 1000;
    setTimeout(() => localStorage.removeItem('currentUser'), timeout);
  }

  // ─── Register (Firebase Auth + lokale API via RxJS) ──────────────────────────

  register() {
    if (!this.loginBoolean) return;
    this.getFirstAndLastName();
    const password = this.checkPW();
    if (!this.samePw) {
      console.error('Passwords do not match');
      return;
    }
    createUserWithEmailAndPassword(getAuth(), this.email, password)
      .then((userCredential) => {
        const userData: User = {
          uid: userCredential.user.uid,
          firstName: this.firstName,
          lastName: this.lastName || '',
          savedUsers: [],
          email: this.email,
          status: true,
        };
        this.createUser(userData).subscribe();
        this.clearUserData();
        window.location.reload();
      })
      .catch((error: any) =>
        console.error('Registration failed:', error.code, error.message)
      );
  }

  // ─── RxJS / HttpClient – User anlegen ───────────────────────────────────────

  createUser(userData: User): Observable<User> {
    return this.http.post<User>(`${API}/users`, userData).pipe(
      tap((user) => {
        this.currentUser = user.id!;
        this.saveUserToLocalStorage(user.id!);
        this.route.navigateByUrl('/mainPage');
      }),
      catchError((err) => {
        console.error('Create user failed', err);
        return of({} as User);
      })
    );
  }

  // ─── RxJS / HttpClient – Online-Status setzen ───────────────────────────────

  updateUserOnlineStatus(userId: string, online: boolean = true): Observable<any> {
    return this.http
      .patch<any>(`${API}/users/${userId}/status`, { status: online })
      .pipe(
        catchError((err) => {
          console.error('Update status failed', err);
          return of(null);
        })
      );
  }

  // ─── RxJS / HttpClient – User per UID finden ────────────────────────────────

  findUserByUid(uid: string): Observable<string> {
    return this.http.get<User[]>(`${API}/users?uid=${uid}`).pipe(
      map((users) => users[0]?.id || ''),
      catchError((err) => {
        console.error('Find user by UID failed', err);
        return of('');
      })
    );
  }

  // ─── Login (Firebase Auth) ───────────────────────────────────────────────────

  login() {
    signInWithEmailAndPassword(getAuth(), this.email, this.passwordLogin)
      .then((userCredential) => {
        this.findUserByUid(userCredential.user.uid).subscribe((docId) => {
          if (docId) {
            this.currentUser = docId;
            this.saveUserToLocalStorage(docId);
            this.route.navigateByUrl('/mainPage');
            setTimeout(() => {
              this.clearUserData();
              this.startAutoLogoutTimer();
            }, 1500);
          } else {
            console.error('Kein zugehöriges Benutzerdokument gefunden.');
          }
        });
      })
      .catch((error) => this.switchCase(error.code));
  }

  // ─── Guest Login (Firebase Auth) ─────────────────────────────────────────────

  guestLogin() {
    const userId = '3oUdmL26NdAWAcYgYxQu';
    signInWithEmailAndPassword(getAuth(), 'guest@gues.de', 'guest@gues.de')
      .then(() => {
        this.saveUserToLocalStorage(userId);
        setTimeout(() => this.clearUserData(), 1500);
        this.route.navigateByUrl('/mainPage');
      })
      .catch((error) => {
        console.error(error);
        this.errorMessage =
          'Fehler bei der Gastanmeldung. Bitte versuchen Sie es später erneut.';
      });
  }

  // ─── Logout (Firebase Auth + lokale API via RxJS) ────────────────────────────

  logout() {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('Keine UserID gefunden');
      return;
    }
    this.updateUserOnlineStatus(userId, false).subscribe(() => {
      signOut(getAuth())
        .then(() => {
          this.deleteUserIdInLocalStorage();
          this.route.navigate(['/login']);
        })
        .catch((error) => console.error(error));
    });
  }

  // ─── Google Login (Firebase Auth + lokale API via RxJS) ──────────────────────

  googleLogin() {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        const user = result.user;
        this.findUserByUid(user.uid).subscribe((docId) => {
          if (!docId) {
            this.createUser({
              uid: user.uid,
              email: user.email || 'leer@gmail.com',
              firstName: user.displayName ? user.displayName.split(' ')[0] : 'FirstName',
              lastName: user.displayName
                ? user.displayName.split(' ').slice(1).join(' ')
                : 'LastName',
              status: true,
              savedUsers: [],
              color: '',
            }).subscribe();
          } else {
            this.currentUser = docId;
            this.saveUserToLocalStorage(docId);
          }
          window.location.reload();
        });
      })
      .catch((error) => console.error(error));
  }

  // ─── Utilities ───────────────────────────────────────────────────────────────

  private saveUserToLocalStorage(userId: string) {
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(userId));
      this.updateUserOnlineStatus(userId, true).subscribe();
    }
  }

  checkPW() {
    if (this.password1 === this.password2) {
      this.samePw = true;
      return this.password1;
    }
    return '';
  }

  clearUserData() {
    this.name = '';
    this.email = '';
    this.password1 = '';
    this.password2 = '';
  }

  getFirstAndLastName() {
    const fullname = this.name.split(' ');
    this.firstName = fullname[0];
    this.lastName = fullname[1] || '';
    if (fullname[2]) this.lastName += ' ' + fullname[2];
  }

  getCurrentUserId() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser !== null) return JSON.parse(currentUser);
  }

  deleteUserIdInLocalStorage() {
    localStorage.removeItem('currentUser');
  }

  switchCase(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        this.errorMessage = '*Invalid credentials. Please check your entries.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage =
          '*Access to this account has been temporarily disabled due to numerous failed login attempts.';
        break;
      default:
        this.errorMessage = '*Please check your entries.';
        break;
    }
  }
}
