import { Component, inject, OnInit } from '@angular/core';
import { VokabelnFragenComponent } from '../vokabeln-fragen/vokabeln-fragen.component';
import { VokabelnService } from '../vokabeln.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog,MatDialogModule  } from '@angular/material/dialog'; // MatDialog importieren
import { HeaderComponent } from '../header/header.component';

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
  // backgroundBlack = false;
  isYellow = false;
  private dialog = inject(MatDialog); 
  vokabelnEmpty = false;


  constructor(public vokabelnService: VokabelnService) {}
  ngOnInit(): void {
    this.vokabelnService.isVokabelnEmpty().subscribe((empty) => {
      this.vokabelnEmpty = empty;
    });
  }
  
  toggleBackground() {
    this.vokabelnService.backgroundBlack = !this.vokabelnService.backgroundBlack; // Umschalten der Hintergrundfarbe
    this.isYellow = !this.isYellow;
  }


}
