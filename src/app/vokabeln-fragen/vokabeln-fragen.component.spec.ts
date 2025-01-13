import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VokabelnFragenComponent } from './vokabeln-fragen.component';

describe('VokabelnFragenComponent', () => {
  let component: VokabelnFragenComponent;
  let fixture: ComponentFixture<VokabelnFragenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VokabelnFragenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VokabelnFragenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
