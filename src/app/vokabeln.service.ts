import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { DialogAddVokabelnComponent } from './dialog-add-vokabeln/dialog-add-vokabeln.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class VokabelnService {
  englisch = false;
  isCorrect = false;
  isIncorrect = false; 
  arrowIsOpen = false;
  backgroundBlack = false;
  private dialog = inject(MatDialog); 


  constructor(private firestore: Firestore) {}

  getVokabeln(): Observable<any[]> {
    const vokabelnCollection = collection(this.firestore, 'vokabeln');
    return collectionData(vokabelnCollection, { idField: 'id' }); // Optional: `idField` fügt die Dokument-ID hinzu
  }

  pushVokabelTooFamiliarVokabel(vokabelId: string) {
    const vokabelnCollection = collection(this.firestore, 'correctvokael');
    addDoc(vokabelnCollection, { id: vokabelId })
      .then(() => console.log(`Vokabel mit ID ${vokabelId} wurde als korrekt gespeichert.`))
      .catch((error) => console.error('Fehler beim Speichern der korrekten Vokabel:', error));
  }
  
  pushVokabelTooUnknownVokabel(vokabelId: string) {
    const vokabelnCollection = collection(this.firestore, 'inCorrectvokael');
    addDoc(vokabelnCollection, { id: vokabelId })
      .then(() => console.log(`Vokabel mit ID ${vokabelId} wurde als inkorrekt gespeichert.`))
      .catch((error) => console.error('Fehler beim Speichern der inkorrekten Vokabel:', error));
  }
  

  schaueVokabel(vokabelId: string) {
    console.log('Aktuelle Vokabel ID:', vokabelId);
    this.englisch = true;
    this.openArrow();
  }
  

  async correct(vokabel: any) {
    const correctCollection = collection(this.firestore, 'correctvokabel');
    this.closeArrow();
  
    try {
      // 1. Vokabel in die "correctvokabel"-Sammlung kopieren, ohne die ID
      const { id, ...vokabelOhneId } = vokabel; // Entferne die ID aus dem Objekt
      await addDoc(correctCollection, {
        ...vokabelOhneId,
        createdAt: new Date().toISOString(),
      });
  
      // 2. Vokabel aus der ursprünglichen Sammlung entfernen
      await this.deleteVokabel(id);
  
      console.log(`Vokabel "${vokabel.myLearnedWord}" wurde als korrekt markiert und verschoben.`);
      this.arrowIsOpen = false; // Nächste Frage laden
    } catch (error) {
      console.error('Fehler beim Verschieben der Vokabel:', error);
    }
    this.englisch = false;
  }
  
  async incorrect(vokabel: any) {
    const incorrectCollection = collection(this.firestore, 'incorrectvokabel');
  
    try {
      const { id, ...vokabelOhneId } = vokabel; // Entferne die ID aus dem Objekt
      await addDoc(incorrectCollection, {
        ...vokabelOhneId,
        createdAt: new Date().toISOString(),
      });
        await this.deleteVokabel(id);
        this.arrowIsOpen = false; // Nächste Frage laden
    } catch (error) {
    }
    this.englisch = false;
  }
  
  private async deleteVokabel(vokabelId: string) {
    const vokabelDoc = doc(this.firestore, `vokabeln/${vokabelId}`);
    try {
      await deleteDoc(vokabelDoc);
    } catch (error) {
    }
  }

  isVokabelnEmpty(): Observable<boolean> {
    return this.getVokabeln().pipe(map((vokabeln) => vokabeln.length === 0));
  }
  
  openArrow(){
    this.arrowIsOpen = true;
  }

  closeArrow(){
    this.arrowIsOpen = false;

  }

  async moveDocuments(sourceCollectionName: string, targetCollectionName: string) {
    try {
      const sourceCollection = collection(this.firestore, sourceCollectionName);
      const targetCollection = collection(this.firestore, targetCollectionName);
  
      // Alle Dokumente aus der Quell-Sammlung holen
      const sourceDocs = await getDocs(sourceCollection);
  
      // Dokumente iterieren und verschieben
      for (const docSnap of sourceDocs.docs) {
        const data = docSnap.data(); // Daten des Dokuments
        const { id, ...vokabelOhneId } = data; // ID entfernen, falls vorhanden
        await addDoc(targetCollection, vokabelOhneId); // In Ziel-Sammlung hinzufügen
        await deleteDoc(docSnap.ref); // Aus Quell-Sammlung löschen
      }
    } catch (error) {
      console.error(`Fehler beim Verschieben von Dokumenten aus ${sourceCollectionName}:`, error);
    }
  }
  
  async allVokabelnRestore() {
    try {
      // Korrekte Vokabeln verschieben
      await this.moveDocuments('correctvokabel', 'vokabeln');
      // Falsche Vokabeln verschieben
      await this.moveDocuments('incorrectvokabel', 'vokabeln');
  
      console.log('Alle Vokabeln wurden erfolgreich wiederhergestellt.');
    } catch (error) {
      console.error('Fehler in allVokabelnRestore:', error);
    }
  }
  

  async incorrectVokabelnReload() {
    try {
      // Abrufen der Dokumente aus der Sammlung 'incorrectvokabel'
      const incorrectDocs = await this.fetchIncorrectVokabeln(); 
  
      // Zugriff auf die Ziel-Sammlung
      const vokabelnCollection = this.getCollectionVokabeln();
  
      // Schleife über alle Dokumente, um sie zu verschieben
      for (const docSnap of incorrectDocs) {
        const data = docSnap.data(); // Daten des Dokuments
        const { id, ...vokabelOhneId } = data; // ID entfernen, falls vorhanden
        await addDoc(vokabelnCollection, vokabelOhneId); // In 'vokabeln' hinzufügen
        await deleteDoc(docSnap.ref); // Aus 'incorrectvokabel' löschen
      }
  
      console.log('Alle inkorrekten Vokabeln wurden verschoben.');
    } catch (error) {
      console.error('Fehler in incorrectVokabelnReload:', error);
    }
  }
  
  getCollectionVokabeln() {
    return collection(this.firestore, 'vokabeln');
  }
  
  async fetchIncorrectVokabeln() {
    try {
      const incorrectCollection = collection(this.firestore, 'incorrectvokabel');
      const docsSnapshot = await getDocs(incorrectCollection); // Holen der Dokumente
      return docsSnapshot.docs; // Rückgabe der Dokument-Snapshots
    } catch (error) {
      console.error('Fehler beim Abrufen der Dokumente:', error);
      return []; // Leeres Array im Fehlerfall
    }
  }
  
    openDialogAddVokabel() {
      this.dialog.open(DialogAddVokabelnComponent);
    }
  
  
}
