import { Component } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-show-vocabulary',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './show-vocabulary.component.html',
  styleUrl: './show-vocabulary.component.scss'
})
export class ShowVocabularyComponent {
  vokabeln: any[] = []; // Dein Haupt-Vokabeln Array
  correctVokabeln: any[] = []; // Array für korrekte Vokabeln
  incorrectVokabeln: any[] = [];

  constructor(public vokabelnService: VokabelnService) { }


  ngOnInit() {
    this.vokabelnService.getAllVokabelnForUser().subscribe((data) => {
      console.log('Geladene Vokabeln:', data);  // Debug-Ausgabe
      this.vokabeln = data; // Speichert die erhaltenen Daten in der `vokabeln`-Array
    });
  }

  editVokabel(vokabel: any) {
    console.log("Bearbeiten:", vokabel);
    // Hier kannst du ein Formular öffnen oder eine Editierfunktion aufrufen
  }

  deleteVokabel(id: string) {
    if (confirm("Möchtest du diese Vokabel wirklich löschen?")) {
      // Lösche aus dem Haupt-Array vokabeln
      this.vokabelnService.deleteVokabel(id).then(() => {
        // Entferne die Vokabel auch aus den correctVokabeln und incorrectVokabeln Arrays
        this.removeVokabelFromArray(id, this.correctVokabeln);
        this.removeVokabelFromArray(id, this.incorrectVokabeln);

        console.log("Vokabel gelöscht:", id);
      }).catch(error => {
        console.error("Fehler beim Löschen:", error);
      });
    }
  }

  // Hilfsmethode, um eine Vokabel aus einem Array zu entfernen
  private removeVokabelFromArray(id: string, array: any[]) {
    const index = array.findIndex(vokabel => vokabel.id === id);
    console.log('Versuche, Vokabel mit ID:', id, 'aus Array zu entfernen. Gefundener Index:', index);
    
    if (index !== -1) {
      array.splice(index, 1); // Entferne die Vokabel
      console.log('Vokabel entfernt:', array);
    } else {
      console.log('Vokabel nicht gefunden.');
    }
  }

}
