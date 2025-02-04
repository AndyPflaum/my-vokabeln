import { Component, inject } from '@angular/core';
import { Router } from '@angular/router'; // <-- Router importieren

import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { VokabelnService } from '../vokabeln.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, MatDividerModule, MatButtonModule, MatBottomSheetModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  readonly dialog = inject(MatDialog);
  constructor(private router: Router,public vokabelnService: VokabelnService) {} // Router in den Constructor einfügen


  loggin() {
    this.router.navigate(['/Vocabulary']);
  }

}
