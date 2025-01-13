import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddVokabelnComponent } from './dialog-add-vokabeln.component';

describe('DialogAddVokabelnComponent', () => {
  let component: DialogAddVokabelnComponent;
  let fixture: ComponentFixture<DialogAddVokabelnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddVokabelnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddVokabelnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
