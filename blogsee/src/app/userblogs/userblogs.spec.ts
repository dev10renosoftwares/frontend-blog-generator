import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userblogs } from './userblogs';

describe('Userblogs', () => {
  let component: Userblogs;
  let fixture: ComponentFixture<Userblogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userblogs],
    }).compileComponents();

    fixture = TestBed.createComponent(Userblogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
