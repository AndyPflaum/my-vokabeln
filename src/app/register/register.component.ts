import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from '@angular/fire/auth'; // Ändere den Import
import { getFirestore, doc, setDoc } from '@angular/fire/firestore'; // Ändere den Import
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    FormsModule, 
    MatButtonModule, 
    MatInputModule, 
    MatIconModule, 
    MatDividerModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  // Variablen für Benutzeranmeldung
  username: string = '';
  email: string = '';
  password: string = '';

  // Firebase Auth und Firestore-Injektion
  readonly dialogRef = inject(MatDialogRef<RegisterComponent>);
  private router = inject(Router);

  // Funktion zum Registrieren des Benutzers
  async registerUser() {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;

      // Wenn die Benutzerregistrierung erfolgreich war, speichern wir weitere Benutzerdaten in Firestore
      if (user) {
        const firestore = getFirestore();
        await setDoc(doc(firestore, 'users', user.uid), {
          username: this.username,
          email: this.email,
          createdAt: new Date().toISOString()
        });

        console.log('Benutzer erfolgreich registriert und gespeichert!');
        
        // Optionale Weiterleitung nach der Registrierung
        this.router.navigate(['/home']); // Beispiel: Weiterleitung zur Startseite
        this.dialogRef.close(); // Dialog schließen
      }
    } catch (error) {
      console.error('Fehler bei der Benutzerregistrierung:', error);
    }
  }
}
