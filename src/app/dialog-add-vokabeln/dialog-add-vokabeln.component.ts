import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { YourVocabulary } from '../model/yourVocabulary.class';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { VokabelnService } from '../vokabeln.service';


@Component({
  selector: 'app-dialog-add-vokabeln',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, MatDividerModule],
  templateUrl: './dialog-add-vokabeln.component.html',
  styleUrl: './dialog-add-vokabeln.component.scss'
})
export class DialogAddVokabelnComponent {
  firestore: Firestore = inject(Firestore);


  vokabel = new YourVocabulary()
  readonly dialogRef = inject(MatDialogRef<DialogAddVokabelnComponent>);

  constructor(public vokabelnService: VokabelnService) {
  }

  onNoClick() {
    this.dialogRef.close();

  }

  async saveVocabulary() {
    try {
      const aCollection = collection(this.firestore, 'vokabeln');
      await addDoc(aCollection, {
        myLearnedWord: this.vokabel.myLearnedWord,
        myLanguage: this.vokabel.myLanguage,
        createdAt: new Date().toISOString()
      });
      this.onNoClick();
    } catch (error) {
      console.error('Fehler beim Speichern der Vokabel:', error);
    }
  }


}
