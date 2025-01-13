import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VokabelnService {
  englisch = false;
  isCorrect = false;
  isIncorrect = false; 
  arrowIsOpen = false;


  constructor() { }

  schaueVokabel() {
    this.englisch = true;
    this.openArrow();
  }

  correct() {
    this.isCorrect = true;
    this.isIncorrect = false;
  }

  incorrect() {
    this.isIncorrect = true;
    this.isCorrect = false;
  }

  openArrow(){
    this.arrowIsOpen = true;
  }
}
