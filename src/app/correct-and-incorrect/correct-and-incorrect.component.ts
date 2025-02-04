import { Component, Input } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-correct-and-incorrect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './correct-and-incorrect.component.html',
  styleUrl: './correct-and-incorrect.component.scss',
})
export class CorrectAndIncorrectComponent {
  @Input() vokabel!: any; // Ganze Vokabel wird übergeben

  constructor(public vokabelnService: VokabelnService) {}

  handleCorrect() {
    this.vokabelnService.correct(this.vokabel); // Ganze Vokabel übergeben
    this.vokabelnService.vokabelIsGreen();
  }

  handleIncorrect() {
    this.vokabelnService.incorrect(this.vokabel); // Ganze Vokabel übergeben
    this.vokabelnService.vokabelIsRed();
  }
}
