import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoponentsComponent } from './coponents.component';

describe('CoponentsComponent', () => {
  let component: CoponentsComponent;
  let fixture: ComponentFixture<CoponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoponentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
