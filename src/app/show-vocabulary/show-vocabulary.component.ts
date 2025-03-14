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

}
