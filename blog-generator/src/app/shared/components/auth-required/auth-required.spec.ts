import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRequired } from './auth-required';

describe('AuthRequired', () => {
  let component: AuthRequired;
  let fixture: ComponentFixture<AuthRequired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRequired],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthRequired);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
