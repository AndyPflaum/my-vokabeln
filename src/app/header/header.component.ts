import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { VokabelnService } from '../vokabeln.service';
import { Router } from '@angular/router'; // <-- Router importieren
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  userName: string = '';

  constructor(private router: Router, public vokabelnService: VokabelnService) { 
    this.userName = this.vokabelnService.getUserName();
  }

}
