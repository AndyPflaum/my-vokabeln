import { Component } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-correct-and-incorrect',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './correct-and-incorrect.component.html',
  styleUrl: './correct-and-incorrect.component.scss'
})
export class CorrectAndIncorrectComponent {
  constructor(public vokabelnService: VokabelnService) {} // Service wird hier eingefügt

}
