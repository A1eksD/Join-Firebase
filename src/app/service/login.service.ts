import { Injectable, inject } from '@angular/core';
import { User } from '../interface/user';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Firestore, QuerySnapshot, addDoc, collection, doc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  firestore: Firestore = inject(Firestore);
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

  constructor(private route: Router,) {}

  register() {
    this.getFirstAndLastName();
    const auth = getAuth();
    const password = this.checkPW();
    if (!this.samePw) {
      console.error('Passwords do not match');
      return;
    }
    createUserWithEmailAndPassword(auth, this.email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('user', user);
        const userData: User = {
          uid: user.uid,
          firstName: this.firstName,
          lastName: this.lastName || '',
          email: this.email,
          status: true
        }
        this.createUserInFirestore(userData);
        this.clearUserData();
      })
      .catch((error: any) => {
        console.error('Registration failed: error.code', error.code);
        console.error('Registration failed: error.message', error.message);
      });
  }


  checkPW(){
    if (this.password1 === this.password2) {
      this.samePw = true;
      return this.password1;
    } else {
      return '';
    }
  }


  clearUserData(){
    this.name = '';
    this.email = '';
    this.password1 = '';
    this.password2 = '';
  }


  getFirstAndLastName(){
    const fullname: string[] = this.name.split(' ');
    this.firstName = fullname[0];
    this.lastName = fullname[1];
    if (fullname[2]) {
      this.lastName += ' ' + fullname[2];
    }
  }


  async createUserInFirestore(userData: User){
    const docRef = await addDoc(this.getUserCollection(), userData);
    this.currentUser = docRef.id;
    this.getUserIdInLocalStorage(this.currentUser);
    this.route.navigateByUrl('/mainPage');
    // this.router.navigate([`/mainPage`]);
  }


  getUserCollection(){
    return collection(this.firestore, 'users');
  }


  async getUserIdInLocalStorage(userId: string) {
    localStorage.setItem('currentUser', JSON.stringify(userId));
    await this.updateUserOnlineStatus(userId);
    window.location.reload();
    // const currentUserFromStorage = localStorage.getItem('currentUser');
    // if (!currentUserFromStorage) {
    //   localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    //   await this.updateUserOnlineStatus(this.currentUser);
    //   window.location.reload();
    // } else {
    //   console.log('Benutzer bereits eingeloggt');
    // }
  }
  


  async updateUserOnlineStatus(userId: string) {
    const userDocRef = doc(this.firestore, 'users', userId);
    const updates = {
      status: true,
    };
    await updateDoc(userDocRef, updates)
      .then(() => {
        console.error();
      })
      .catch((error) => {
        console.error(error);
      });
  }


  login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.passwordLogin)
      .then((userCredential) => {
        const user = userCredential.user;
        const usersCollection = collection(this.firestore, 'users');
        const querySnapshot = query(usersCollection, where('uid', '==', user.uid));

        getDocs(querySnapshot)
          .then((snapshot) => this.userDocument(snapshot))
          .catch((error) => {
            console.error('Fehler beim Abrufen des Benutzerdokuments:', error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        this.switchCase(errorCode);
      });
  }

  userDocument(snapshot: QuerySnapshot) {
    if (snapshot.docs.length > 0) {
      const userDoc = snapshot.docs[0];
      this.currentUser = userDoc.id;
      this.getUserIdInLocalStorage(this.currentUser);
      this.route.navigateByUrl('/mainPage');
      // this.route.navigate([`/mainPage`]);
      setTimeout(() => {
        this.clearUserData();
      }, 1500);
    } else {
      console.error('Kein zugehöriges Benutzerdokument gefunden.');
    }
  }

  switchCase(errorCode: string) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        this.errorMessage =
          '*Ungültige Anmeldeinformationen. Bitte überprüfen Sie Ihre Eingaben.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage =
          '*Der Zugriff auf dieses Konto wurde aufgrund zahlreicher fehlgeschlagener Anmeldeversuche vorübergehend deaktiviert.';
        break;
      default:
        this.errorMessage = '*Bitte Überprüfe deine Eingaben.';
        break;
    }
  }

  guestLogin(){
    const auth = getAuth();
    const email = 'guest@gues.de';
    const password = 'guest@gues.de';
    const userId = '3oUdmL26NdAWAcYgYxQu';

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.getUserIdInLocalStorage(userId);
        setTimeout(() => {
          this.clearUserData();
        }, 1500);
        this.route.navigateByUrl('/mainPage');
      })
      .catch((error) => {
        console.error(error);
        this.errorMessage =
          'Fehler bei der Gastanmeldung. Bitte versuchen Sie es später erneut.';
      });
  }
  
}


