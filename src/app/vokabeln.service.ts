import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, setDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { DialogAddVokabelnComponent } from './dialog-add-vokabeln/dialog-add-vokabeln.component';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import { getAuth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from '@firebase/auth';
import { Router } from '@angular/router'; // Router importieren
import { combineLatest } from 'rxjs'; // Importiere combineLatest
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';
import { DialogEditComponent } from './dialog-edit/dialog-edit.component';



@Injectable({
  providedIn: 'root'
})
export class VokabelnService {
  public userLoggedIn: boolean = false;
  private userId: string = ''; // Benutzer-ID als leere Zeichenkette initialisieren
  private userName: string = '';
  englisch = false;
  isCorrect = false;
  isIncorrect = false;
  arrowIsOpen = false;
  backgroundBlack = false;
  isGreenOn = false;
  isRed = false;
  showVokabeln: boolean = false;
  private dialog = inject(MatDialog);
  private router = inject(Router);



  constructor(private firestore: Firestore) {
    const auth = getAuth();

    // Wenn der Benutzer authentifiziert ist
    onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        this.userId = user.uid;
        await this.fetchUserName(user.uid);
        this.userLoggedIn = true;  // Benutzernamen nach dem Login laden
      } else {
        this.userId = ''; 
        // Falls der Benutzer nicht angemeldet ist, zur Login-Seite weiterleiten
        this.router.navigate(['/LogIn']);
      }
    });
    this.getUserName();
  }

  private async fetchUserName(userId: string) {
    try {
      // Hole das Benutzer-Dokument aus Firestore, angenommen, es befindet sich in der Collection 'users'
      const userDoc = doc(this.firestore, `users/${userId}`);
      const docSnapshot = await getDoc(userDoc);
      
      if (docSnapshot.exists()) {
        // Wenn das Dokument existiert, setze den Benutzernamen
        this.userName = docSnapshot.data()?.['username'] || 'Unbekannt';  // Verwende die indexierte Notation

        // Wenn kein Benutzername vorhanden ist, leite zur Login-Seite weiter
        if (this.userName === '') {
          this.router.navigate(['/LogIn']);
        }
      } else {
        console.error('Benutzerdokument nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Benutzernamens:', error);
      this.userName = 'Unbekannt';  // Falls ein Fehler auftritt, setze 'Unbekannt'
      this.router.navigate(['/LogIn']);  // Falls ein Fehler auftritt, zur Login-Seite weiterleiten
    }
  }

  getUserName() {
    return this.userName;
  }

  

  setUserId(userId: string): void {
    this.userId = userId;
    this.loadUserName(userId); // Benutzername aus Firestore laden
    console.log('Benutzer-ID gesetzt:', userId);
  }

  async loadUserName(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      this.userName = userSnap.data()['username'] || 'Unbekannt';
    } else {
      this.userName = 'Unbekannt'; 
    }
  }

  setUserName(name: string) {
    this.userName = name;
  }

  getAllVokabelnForUser(): Observable<any[]> {
    if (!this.userId) {
      return new Observable(); // Rückgabe eines leeren Observables, wenn kein Benutzer angemeldet
    }
  
    // Collection-Referenzen für 'vokabeln', 'correctvokabel' und 'incorrectvokabel'
    const vokabelnCollection = collection(this.firestore, `users/${this.userId}/vokabeln`);
    const correctCollection = collection(this.firestore, `users/${this.userId}/correctvokabel`);
    const incorrectCollection = collection(this.firestore, `users/${this.userId}/incorrectvokabel`);
  
    // Alle Sammlungen kombinieren
    const combinedVokabeln = [
      collectionData(vokabelnCollection, { idField: 'id' }),
      collectionData(correctCollection, { idField: 'id' }),
      collectionData(incorrectCollection, { idField: 'id' })
    ];
  
    return combineLatest(combinedVokabeln).pipe(
      map(([vokabeln, correct, incorrect]) => {
        // Alle Vokabeln zusammenführen
        return [...vokabeln, ...correct, ...incorrect];
      })
    );
  }
  

  logout() {
    this.userLoggedIn = false;
    this.userName = ''; // Benutzername beim Logout zurücksetzen
    this.userId = ''; // Benutzer-ID zurücksetzen
    this.router.navigate(['/LogIn']);

  }

  gastLoggin(){
    this.userName = 'Gast';
  }

  async addVokabelnForUser(vokabel: any) {
    if (this.userId) {
      const userVokabelnCollection = collection(this.firestore, `users/${this.userId}/vokabeln`);
      try {
        await addDoc(userVokabelnCollection, {
          ...vokabel,
          createdAt: new Date().toISOString(), // Zeitstempel hinzufügen
        });
        console.log(`Vokabel "${vokabel.myLearnedWord}" wurde gespeichert.`);
      } catch (error) {
        console.error('Fehler beim Speichern der Vokabeln:', error);
      }
    } else {
    }
  }


  getVokabelnForUser(): Observable<any[]> {
    if (this.userId) {
      const userVokabelnCollection = collection(this.firestore, `users/${this.userId}/vokabeln`);
      return collectionData(userVokabelnCollection, { idField: 'id' });
    } else {
      return new Observable(); // Rückgabe eines leeren Observables, wenn kein Benutzer angemeldet
    }
  }


  schaueVokabel(vokabelId: string) {
    console.log('Aktuelle Vokabel ID:', vokabelId);
    this.englisch = true;
    this.openArrow();
  }


  async correct(vokabel: any) {
    if (!this.userId) {
      return;
    }

    const correctCollection = collection(this.firestore, `users/${this.userId}/correctvokabel`);
    this.closeArrow();

    try {
      // 1. Vokabel in die "correctvokabel"-Sammlung des Benutzers kopieren
      const { id, ...vokabelOhneId } = vokabel; // Entferne die ID aus dem Objekt
      await addDoc(correctCollection, {
        ...vokabelOhneId,
        createdAt: new Date().toISOString(),
      });

      // 2. Vokabel aus der ursprünglichen Benutzersammlung entfernen
      await this.deleteVokabel(id);

      console.log(`Vokabel "${vokabel.myLearnedWord}" wurde als korrekt markiert und verschoben.`);
      this.arrowIsOpen = false; // Nächste Frage laden
    } catch (error) {
      console.error('Fehler beim Verschieben der Vokabel:', error);
    }

    this.englisch = false;
  }


  async incorrect(vokabel: any) {
    const incorrectCollection = collection(this.firestore, `users/${this.userId}/incorrectvokabel`);

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

  public async deleteVokabel(vokabelId: string) {
    if (!this.userId) {
      return;
    }
  
    // Lösche die Vokabel aus der 'vokabeln'-Sammlung
    const vokabelDoc = doc(this.firestore, `users/${this.userId}/vokabeln/${vokabelId}`);
    const correctVokabelDoc = doc(this.firestore, `users/${this.userId}/correctvokabel/${vokabelId}`);
    const incorrectVokabelDoc = doc(this.firestore, `users/${this.userId}/incorrectvokabel/${vokabelId}`);
  
    try {
      // Lösche die Vokabel aus allen relevanten Sammlungen
      await Promise.all([
        deleteDoc(vokabelDoc),
        deleteDoc(correctVokabelDoc),
        deleteDoc(incorrectVokabelDoc)
      ]);
  
      console.log(`Vokabel mit ID "${vokabelId}" wurde erfolgreich gelöscht.`);
    } catch (error) {
      console.error('Fehler beim Löschen der Vokabel:', error);
    }
  }
  


  isVokabelnEmpty(): Observable<boolean> {
    return this.getVokabelnForUser().pipe(map((vokabeln) => vokabeln.length === 0));
  }



  async moveDocuments(sourceCollectionName: string, targetCollectionName: string) {
    if (!this.userId) {
      return;
    }

    try {
      // Benutzerbezogene Sammlungen erstellen
      const sourceCollection = collection(this.firestore, `users/${this.userId}/${sourceCollectionName}`);
      const targetCollection = collection(this.firestore, `users/${this.userId}/${targetCollectionName}`);

      // Alle Dokumente aus der Quell-Sammlung holen
      const sourceDocs = await getDocs(sourceCollection);

      // Dokumente iterieren und verschieben
      for (const docSnap of sourceDocs.docs) {
        const data = docSnap.data(); // Dokument-Daten abrufen
        await addDoc(targetCollection, { ...data, createdAt: new Date().toISOString() }); // In Ziel-Sammlung speichern
        await deleteDoc(docSnap.ref); // Original löschen
      }

      console.log(`Alle Vokabeln von ${sourceCollectionName} nach ${targetCollectionName} verschoben.`);
    } catch (error) {
      console.error(`Fehler beim Verschieben von ${sourceCollectionName}:`, error);
    }
  }


  async allVokabelnRestore() {
    if (!this.userId) {
      return;
    }

    try {
      await this.moveDocuments('correctvokabel', 'vokabeln');
      await this.moveDocuments('incorrectvokabel', 'vokabeln');
      console.log('Alle Vokabeln wurden erfolgreich wiederhergestellt.');
    } catch (error) {
      console.error('Fehler in allVokabelnRestore:', error);
    }
  }



  async incorrectVokabelnReload() {
    try {
      // Abrufen der falschen Vokabeln für den aktuellen Benutzer
      const incorrectDocs = await this.fetchIncorrectVokabeln();

      // Prüfen, ob überhaupt Vokabeln vorhanden sind
      if (incorrectDocs.length === 0) {
        console.log("Keine inkorrekten Vokabeln zum Verschieben gefunden.");
        return;
      }

      // Zugriff auf die Ziel-Sammlung des Benutzers
      const vokabelnCollection = collection(this.firestore, `users/${this.userId}/vokabeln`);

      // Schleife über alle Dokumente, um sie zu verschieben
      for (const vokabel of incorrectDocs) {
        const { id, ...vokabelOhneId } = vokabel; // ID entfernen

        // Vokabel in die richtige Sammlung hinzufügen
        await addDoc(vokabelnCollection, vokabelOhneId);

        // Vokabel aus 'incorrectvokabel' löschen
        const incorrectVokabelDoc = doc(this.firestore, `users/${this.userId}/incorrectvokabel/${id}`);
        await deleteDoc(incorrectVokabelDoc);
      }

      console.log('Alle inkorrekten Vokabeln wurden erfolgreich verschoben.');
    } catch (error) {
      console.error('Fehler in incorrectVokabelnReload:', error);
    }
  }



  getCollectionVokabeln() {
    return collection(this.firestore, 'vokabeln');
  }

  async fetchIncorrectVokabeln() {
    try {
      const incorrectCollection = collection(this.firestore, `users/${this.userId}/incorrectvokabel`);
      const docsSnapshot = await getDocs(incorrectCollection); // Alle Dokumente abrufen

      // Rückgabe als Array von Objekten mit ID
      return docsSnapshot.docs.map(doc => ({
        id: doc.id, // ID aus Firestore hinzufügen
        ...doc.data() // Die restlichen Vokabel-Daten übernehmen
      }));
    } catch (error) {
      console.error('Fehler beim Abrufen der Dokumente:', error);
      return []; // Leeres Array im Fehlerfall
    }
  }


  openDialogAddVokabel() {
    this.dialog.open(DialogAddVokabelnComponent);
  }

  openDialogDelete(vokabelId: string) {
    this.dialog.open(DialogDeleteComponent, {
      data: { vokabelId } // ID an den Dialog übergeben
    });
  }

  updateVokabel(vokabelId: string, updatedVokabel: any) {
    const vokabelRef = doc(this.firestore, `users/${this.userId}/vokabeln/${vokabelId}`);
    return setDoc(vokabelRef, updatedVokabel);
  }

  openDialogEdit(vokabelId: string) {
    // Hole die Vokabel-Daten basierend auf der ID
    const vokabelRef = doc(this.firestore, `users/${this.userId}/vokabeln/${vokabelId}`);
    getDoc(vokabelRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const vokabel = { id: docSnapshot.id, ...docSnapshot.data() };
        this.dialog.open(DialogEditComponent, {
          data: { vokabel }  // Vokabel-Daten an den Dialog übergeben
        });
      } else {
        console.error('Vokabel nicht gefunden!');
      }
    }).catch(error => {
      console.error('Fehler beim Laden der Vokabel:', error);
    });
  }
  
  
  

  openDialogRegister() {
    this.dialog.open(RegisterComponent);

  }

  vokabelIsGreen() {
    this.isGreenOn = true;

    setTimeout(() => {
      this.vokabelIsNotGreen();
    }, 500);

  }

  vokabelIsNotGreen() {
    this.isGreenOn = false;

  }

  vokabelIsRed() {
    this.isRed = true;
    setTimeout(() => {
      this.vokabelIsNotRed();
    }, 500);
  }
  vokabelIsNotRed() {
    this.isRed = false;

  }

  isUserLoggedIn(): boolean {
    return this.userId !== '';  // Prüft, ob der Benutzer eingeloggt ist
  }

  openArrow() {
    this.arrowIsOpen = true;
  }

  closeArrow() {
    this.arrowIsOpen = false;

  }


  toggleShowVokabeln() {
    this.showVokabeln =!this.showVokabeln;
}


}
