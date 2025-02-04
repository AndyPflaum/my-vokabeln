import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { YourVocabulary } from '../model/yourVocabulary.class';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { DialogAddVokabelnComponent } from '../dialog-add-vokabeln/dialog-add-vokabeln.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, FormsModule, MatButtonModule, MatInputModule, MatIconModule, MatDividerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  vokabel = new YourVocabulary()
  readonly dialogRef = inject(MatDialogRef<DialogAddVokabelnComponent>);



}
