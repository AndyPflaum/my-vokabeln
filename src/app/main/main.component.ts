import { Component, inject, OnInit } from '@angular/core';
import { VokabelnFragenComponent } from '../vokabeln-fragen/vokabeln-fragen.component';
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
    CommonModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    MatDialogModule 
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'] 
})
export class MainComponent implements OnInit {
  private dialog = inject(MatDialog); 
  vokabelnEmpty = false;


  constructor(public vokabelnService: VokabelnService) {}
  ngOnInit(): void {
    this.vokabelnService.isVokabelnEmpty().subscribe((empty) => {
      this.vokabelnEmpty = empty;
    });
  }
  

  openDialogAddVokabel() {
    this.dialog.open(DialogAddVokabelnComponent);
  }

  reloadAll() {
    console.log('Alle Vokabeln werden neu geladen.');
    // Aktion, um alle Vokabeln zurückzusetzen
  }
  
  reloadIncorrect() {
    console.log('Falsche Vokabeln werden neu geladen.');
    // Aktion, um falsche Vokabeln abzufragen
  }
}
