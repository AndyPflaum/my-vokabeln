import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVocabularyComponent } from './show-vocabulary.component';

describe('ShowVocabularyComponent', () => {
  let component: ShowVocabularyComponent;
  let fixture: ComponentFixture<ShowVocabularyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowVocabularyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
