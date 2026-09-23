import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createdblog } from './createdblog';

describe('Createdblog', () => {
  let component: Createdblog;
  let fixture: ComponentFixture<Createdblog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createdblog],
    }).compileComponents();

    fixture = TestBed.createComponent(Createdblog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
