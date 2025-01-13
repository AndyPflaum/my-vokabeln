import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDocs } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VokabelnService {
  englisch = false;
  isCorrect = false;
  isIncorrect = false; 
  arrowIsOpen = false;


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
      // 1. Vokabel in die "incorrectvokabel"-Sammlung kopieren, ohne die ID
      const { id, ...vokabelOhneId } = vokabel; // Entferne die ID aus dem Objekt
      await addDoc(incorrectCollection, {
        ...vokabelOhneId,
        createdAt: new Date().toISOString(),
      });
  
      // 2. Vokabel aus der ursprünglichen Sammlung entfernen
      await this.deleteVokabel(id);
  
      console.log(`Vokabel "${vokabel.myLearnedWord}" wurde als inkorrekt markiert und verschoben.`);
      this.arrowIsOpen = false; // Nächste Frage laden
    } catch (error) {
      console.error('Fehler beim Verschieben der Vokabel:', error);
    }
    this.englisch = false;
  }
  
  private async deleteVokabel(vokabelId: string) {
    const vokabelDoc = doc(this.firestore, `vokabeln/${vokabelId}`);
    try {
      await deleteDoc(vokabelDoc);
      console.log(`Vokabel mit ID ${vokabelId} wurde aus der ursprünglichen Sammlung gelöscht.`);
    } catch (error) {
      console.error('Fehler beim Löschen der Vokabel:', error);
    }
  }

  isVokabelnEmpty(): Observable<boolean> {
    return this.getVokabeln().pipe(map((vokabeln) => vokabeln.length === 0));
  }
  

  openArrow(){
    this.arrowIsOpen = true;
  }
}
