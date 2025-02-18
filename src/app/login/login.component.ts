import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Neue Auth-API
import { VokabelnService } from '../vokabeln.service';
import { HeaderComponent } from '../header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'; // Importiere BottomSheetModul
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent, 
    MatFormFieldModule, 
    MatIconModule, 
    MatInputModule, 
    FormsModule, 
    MatDividerModule, 
    MatButtonModule, 
    MatBottomSheetModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  readonly dialog = inject(MatDialog);
  constructor(private router: Router, public vokabelnService: VokabelnService) {}

  loggin() {
    // E-Mail-Validierung
    if (!this.isValidEmail(this.email)) {
      alert('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }

    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        // Benutzer ist angemeldet
        const user = userCredential.user;
        const userId = user.uid;  // Holen der Benutzer-ID
  
        // Setze die Benutzer-ID im VokabelnService
        this.vokabelnService.setUserId(userId);
        
        // Setze den loggedIn Status
        this.vokabelnService.userLoggedIn = true;

        // Weiterleitung zur Vocabulary-Seite oder andere Aktionen
        this.router.navigate(['/Vocabulary']);
        console.log(`Benutzer-ID: ${userId}`);
      })
      .catch((error) => {
        console.error('Fehler bei der Anmeldung:', error);
        alert('Fehler bei der Anmeldung. Bitte überprüfen Sie Ihre Anmeldedaten.');
      });
  }

  // Einfache E-Mail-Validierung
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // OnSubmit Methode für das Formular
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Login erfolgreich', this.email, this.password);
      // Hier kannst du deine Login-Logik hinzufügen
      this.loggin();
    } else {
      console.log('Fehler: Das Formular ist ungültig');
    }
  }

  gastLoggin() {
    const auth = getAuth();
    const email = 'test123@web.de';
    const password = 'test123';

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Benutzer ist als Gast angemeldet
        const user = userCredential.user;
        const userId = user.uid;  // Holen der Benutzer-ID
  
        // Setze die Benutzer-ID im VokabelnService
        this.vokabelnService.setUserId(userId);

        // Setze den loggedIn Status
        this.vokabelnService.userLoggedIn = true;

        // Weiterleitung zur Vocabulary-Seite oder andere Aktionen
        this.router.navigate(['/Vocabulary']);
        console.log(`Gast-Benutzer-ID: ${userId}`);
      })
      .catch((error) => {
        console.error('Fehler bei der Gast-Anmeldung:', error);
        alert('Fehler bei der Anmeldung. Bitte überprüfen Sie Ihre Anmeldedaten.');
      });
  }

}
  


