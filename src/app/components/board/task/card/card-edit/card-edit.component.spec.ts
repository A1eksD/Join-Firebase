import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEditComponent } from './card-edit.component';

describe('CardEditComponent', () => {
  let component: CardEditComponent;
  let fixture: ComponentFixture<CardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
