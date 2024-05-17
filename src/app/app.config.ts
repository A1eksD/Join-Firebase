import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'join-bdb9c',
        appId: '1:668904791885:web:da2c6f78e7ef4087b4e104',
        storageBucket: 'join-bdb9c.appspot.com',
        apiKey: 'AIzaSyAVcnywzsv-gAC3d5QTbF9EkCcTVOL-ep4',
        authDomain: 'join-bdb9c.firebaseapp.com',
        messagingSenderId: '668904791885',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
