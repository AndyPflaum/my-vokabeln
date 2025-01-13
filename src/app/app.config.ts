import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"myvokabeln-a792a","appId":"1:400281069480:web:b1ff208d9985260fa0df9d","storageBucket":"myvokabeln-a792a.firebasestorage.app","apiKey":"AIzaSyDUZLX2bUUANZNqpMxHz2RhZscQr8O-_BY","authDomain":"myvokabeln-a792a.firebaseapp.com","messagingSenderId":"400281069480"})), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())]
};
