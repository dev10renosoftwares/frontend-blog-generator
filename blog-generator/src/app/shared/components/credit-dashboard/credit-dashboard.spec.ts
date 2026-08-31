import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDashboard } from './credit-dashboard';

describe('CreditDashboard', () => {
  let component: CreditDashboard;
  let fixture: ComponentFixture<CreditDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
