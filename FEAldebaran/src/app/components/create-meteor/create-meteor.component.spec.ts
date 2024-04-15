import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeteorComponent } from './create-meteor.component';

describe('CreateMeteorComponent', () => {
  let component: CreateMeteorComponent;
  let fixture: ComponentFixture<CreateMeteorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMeteorComponent]
    });
    fixture = TestBed.createComponent(CreateMeteorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
