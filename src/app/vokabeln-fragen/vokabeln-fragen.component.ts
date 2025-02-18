import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';
import { CorrectAndIncorrectComponent } from '../correct-and-incorrect/correct-and-incorrect.component';


@Component({
  selector: 'app-vokabeln-fragen',
  standalone: true,
  imports: [CommonModule,CorrectAndIncorrectComponent],
  templateUrl: './vokabeln-fragen.component.html',
  styleUrl: './vokabeln-fragen.component.scss'
})
export class VokabelnFragenComponent {
  vokabeln$ = this.vokabelnService.getVokabelnForUser(); // Observable der Vokabeln abrufen
  currentIndex = 0;
  

  constructor(public vokabelnService: VokabelnService) {} // Service wird hier eingefügt

  showNext() {
    this.currentIndex++;
  }


  
}
