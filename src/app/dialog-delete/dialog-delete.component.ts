import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { VokabelnService } from '../vokabeln.service';

@Component({
  selector: 'app-dialog-delete',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.scss']
})
export class DialogDeleteComponent {
  constructor(
    public vokabelnService: VokabelnService,
    public dialogRef: MatDialogRef<DialogDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vokabelId: string }
  ) {}

  onDeleteClick() {
    if (this.data?.vokabelId) {
      this.vokabelnService.deleteVokabel(this.data.vokabelId); // Vokabel löschen
      this.dialogRef.close(true); // Dialog schließen und Erfolg zurückgeben
    }
  }

  onNoClick() {
    this.dialogRef.close(); // Nur den Dialog schließen
  }
}

