import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseQuery } from './raise-query';

describe('RaiseQuery', () => {
  let component: RaiseQuery;
  let fixture: ComponentFixture<RaiseQuery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiseQuery],
    }).compileComponents();

    fixture = TestBed.createComponent(RaiseQuery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
