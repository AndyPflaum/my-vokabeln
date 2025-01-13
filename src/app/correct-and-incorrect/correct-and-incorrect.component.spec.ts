import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectAndIncorrectComponent } from './correct-and-incorrect.component';

describe('CorrectAndIncorrectComponent', () => {
  let component: CorrectAndIncorrectComponent;
  let fixture: ComponentFixture<CorrectAndIncorrectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectAndIncorrectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrectAndIncorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
