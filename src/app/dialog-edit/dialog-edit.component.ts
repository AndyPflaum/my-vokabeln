import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { VokabelnService } from '../vokabeln.service';

@Component({
  selector: 'app-dialog-edit',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent {
  vokabelId: string = ''; // Vokabel-ID, die beim Öffnen des Dialogs übergeben wird
  vokabel: any;  // Vokabel, die bearbeitet werden soll

  constructor(
    private firestore: Firestore,
    private vokabelService: VokabelnService,
    private dialogRef: MatDialogRef<DialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vokabelId: string, vokabel?: any }  // vokabelId und eventuell vokabel
  ) {
    // Wenn eine Vokabel direkt übergeben wird, verwende diese. Ansonsten lade sie mit der ID.
    if (data.vokabel) {
      this.vokabel = data.vokabel;
    } else if (data.vokabelId) {
      this.vokabelId = data.vokabelId;
      this.loadVokabel();
    }
  }

  // Lädt die Vokabel-Daten aus Firestore basierend auf der vokabelId
  async loadVokabel() {
    if (!this.vokabelId) return;

    const userId = this.getUserId();
    if (!userId) return;

    const vokabelDoc = doc(this.firestore, `users/${userId}/vokabeln/${this.vokabelId}`);
    const docSnapshot = await getDoc(vokabelDoc);

    if (docSnapshot.exists()) {
      this.vokabel = docSnapshot.data(); // Setzt die Vokabel-Daten in das Formular
    } else {
      console.error('Vokabel nicht gefunden');
    }
  }

  updateVokabel() {
    if (this.vokabel) {
      // Hier kannst du die Vokabel in der Firestore-Datenbank aktualisieren
      this.vokabelService.updateVokabel(this.vokabel.id, this.vokabel).then(() => {
        console.log("Vokabel wurde erfolgreich aktualisiert.");
        this.closeDialog(); // Dialog schließen nach dem Speichern
      }).catch((error) => {
        console.error("Fehler beim Aktualisieren der Vokabel:", error);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private getUserId(): string {
    return localStorage.getItem('userId') || ''; // Hole die userId aus dem LocalStorage
  }
}
