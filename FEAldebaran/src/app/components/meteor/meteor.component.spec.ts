import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteorComponent } from './meteor.component';

describe('MeteorComponent', () => {
  let component: MeteorComponent;
  let fixture: ComponentFixture<MeteorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MeteorComponent]
    });
    fixture = TestBed.createComponent(MeteorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
