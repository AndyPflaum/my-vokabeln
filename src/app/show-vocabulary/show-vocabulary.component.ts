import { Component } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-vocabulary',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, FormsModule],
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
      this.vokabeln = this.shuffleArray(data); // 👉 Vokabeln mischen
    });
  }

  editVokabel(vokabel: any) {
    console.log("Bearbeiten:", vokabel);
    // Hier kannst du ein Formular öffnen oder eine Editierfunktion aufrufen
  }

  shuffleArray(array: any[]): any[] {
    return array
      .map(item => ({ sort: Math.random(), value: item }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  get filteredVokabeln() {
    const term = this.vokabelnService.searchTerm.toLowerCase();
    return this.vokabeln.filter(v =>
      v.myLearnedWord.toLowerCase().includes(term) ||
      v.myLanguage.toLowerCase().includes(term)
    );
  }
  

}
