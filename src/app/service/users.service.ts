import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { User } from '../interface/user';

const API = 'http://localhost:4200/api';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  allUsers: User[] = [];
  getUserIDs: string[] = [];
  commonUsers: User[] = [];

  constructor(private http: HttpClient) {
    this.loadUsers().subscribe();
    this.loadCommonUsers().subscribe();
  }

  // ─── RxJS / HttpClient ───────────────────────────────────────────────────────

  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API}/users`).pipe(
      tap((users) => {
        this.allUsers = users;
        this.getUserIDs = users.map((u) => u.id!);
      }),
      catchError((err) => {
        console.error('Failed to load users', err);
        return of([]);
      })
    );
  }

  loadCommonUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API}/common-users`).pipe(
      tap((users) => {
        this.commonUsers = users;
      }),
      catchError((err) => {
        console.error('Failed to load common users', err);
        return of([]);
      })
    );
  }

  addNewContact(user: User[]): Observable<any> {
    const cleanId = this.getCleanID(localStorage.getItem('currentUser')!);
    return this.http
      .post<any>(`${API}/users/${cleanId}/contacts`, user[0])
      .pipe(
        switchMap(() => this.addContactDocToCommonUsers(user)),
        tap(() => this.loadUsers().subscribe()),
        catchError((err) => {
          console.error('Add contact failed', err);
          return of(null);
        })
      );
  }

  addContactDocToCommonUsers(user: User[]): Observable<any> {
    return this.http
      .post<any>(`${API}/common-users`, { savedUsers: user })
      .pipe(
        catchError((err) => {
          console.error('Add to commonUsers failed', err);
          return of(null);
        })
      );
  }

  updateEditContact(user: User[]): Observable<any> {
    const cleanId = this.getCleanID(localStorage.getItem('currentUser')!);
    return forkJoin([
      this.http.patch<any>(`${API}/users/${cleanId}/contacts/${user[0].uid}`, user[0]),
      this.updateContactDocToCommonUsers(user),
    ]).pipe(
      tap(() => this.loadUsers().subscribe()),
      catchError((err) => {
        console.error('Edit contact failed', err);
        return of(null);
      })
    );
  }

  updateContactDocToCommonUsers(user: User[]): Observable<any> {
    const commonUser = this.commonUsers.find(
      (u) => u.savedUsers?.[0]?.uid === user[0].uid
    );
    if (!commonUser) return of(null);
    return this.http
      .patch<any>(`${API}/common-users/${commonUser.id}`, { savedUsers: user })
      .pipe(
        catchError((err) => {
          console.error('Update commonUsers failed', err);
          return of(null);
        })
      );
  }

  deleteContact(contact: User, logginUser: User[]): Observable<any> {
    return this.http
      .delete<any>(`${API}/users/${logginUser[0].id}/contacts/${contact.uid}`)
      .pipe(
        tap(() => this.loadUsers().subscribe()),
        catchError((err) => {
          console.error('Delete contact failed', err);
          return of(null);
        })
      );
  }

  // ─── Lokale Hilfslogik ───────────────────────────────────────────────────────

  getCurrentEditUsers(savedUser: User[], contact: User): User[] {
    const idx = savedUser.findIndex((c) => c.uid === contact.uid);
    if (idx !== -1) savedUser[idx] = contact;
    else savedUser.push(contact);
    return savedUser;
  }

  getCurrentSavedUsers(savedUser: User[], contact: User): User[] {
    const idx = savedUser.findIndex((c) => c.uid === contact.uid);
    if (idx !== -1) savedUser.splice(idx, 1);
    else savedUser.push(contact);
    return savedUser;
  }

  getCleanID(currentUserFromStorage: string): string {
    return currentUserFromStorage.replace(/"/g, '');
  }

  getLogedinUserId() {
    const currentUser = '';
    if (currentUser !== null) return JSON.parse(currentUser);
  }

  ngOnDestroy() {}
}
