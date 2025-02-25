import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { getFirestore, doc, setDoc } from '@angular/fire/firestore';
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
  username: string = '';
  email: string = '';
  password: string = '';

  readonly dialogRef = inject(MatDialogRef<RegisterComponent>);
  private router = inject(Router);

  async registerUser() {
    if (!this.username.trim() || !this.email.trim() || !this.password.trim()) {
      console.error('Alle Felder müssen ausgefüllt sein!');
      alert('Bitte alle Felder ausfüllen!');
      return;
    }
  
    try {
      const auth = getAuth();
      const firestore = getFirestore();
  
      // Versuche den Benutzer zu registrieren
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
  
      if (user) {
        // Benutzerprofil in Firebase Authentication aktualisieren
        await updateProfile(user, { displayName: this.username });
  
        // Benutzer in Firestore speichern
        await setDoc(doc(firestore, 'users', user.uid), {
          username: this.username,
          email: this.email,
          createdAt: new Date().toISOString()
        });
  
        console.log('Benutzer erfolgreich registriert:', this.username);
  
        alert('Registrierung erfolgreich!'); // Erfolgsnachricht für den User
        this.router.navigate(['/home']); // Weiterleitung nach Registrierung
        this.dialogRef.close(); // Dialog schließen
      }
    } catch (error: any) {
      console.error('Fehler bei der Registrierung:', error);
  
      // 🔥 Fehlerfälle behandeln
      if (error.code === 'auth/email-already-in-use') {
        alert('Diese E-Mail-Adresse wird bereits verwendet! Bitte logge dich ein oder benutze eine andere.');
      } else if (error.code === 'auth/invalid-email') {
        alert('Ungültige E-Mail-Adresse!');
      } else if (error.code === 'auth/weak-password') {
        alert('Das Passwort muss mindestens 6 Zeichen lang sein!');
      } else {
        alert('Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut.');
      }
    }
  }
  
}
