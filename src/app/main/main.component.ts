import { Component, inject } from '@angular/core';
import { VokabelnFragenComponent } from '../vokabeln-fragen/vokabeln-fragen.component';
import { CorrectAndIncorrectComponent } from '../correct-and-incorrect/correct-and-incorrect.component';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog,MatDialogModule  } from '@angular/material/dialog'; // MatDialog importieren
import { HeaderComponent } from '../header/header.component';
import { DialogAddVokabelnComponent } from '../dialog-add-vokabeln/dialog-add-vokabeln.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    VokabelnFragenComponent,
    CorrectAndIncorrectComponent,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    MatDialogModule 
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'] 
})
export class MainComponent {
  private dialog = inject(MatDialog); 

  constructor(public vokabelnService: VokabelnService) {}

  openDialogAddVokabel() {
    this.dialog.open(DialogAddVokabelnComponent);
  }
}
