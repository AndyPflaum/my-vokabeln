import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VokabelnService } from '../vokabeln.service';


@Component({
  selector: 'app-vokabeln-fragen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vokabeln-fragen.component.html',
  styleUrl: './vokabeln-fragen.component.scss'
})
export class VokabelnFragenComponent {


  constructor(public vokabelnService: VokabelnService) {} // Service wird hier eingefügt


}
