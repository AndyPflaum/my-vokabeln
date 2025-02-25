import { Component } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-vocabulary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-vocabulary.component.html',
  styleUrl: './show-vocabulary.component.scss'
})
export class ShowVocabularyComponent {
  constructor(public vokabelnService: VokabelnService) { }

}
