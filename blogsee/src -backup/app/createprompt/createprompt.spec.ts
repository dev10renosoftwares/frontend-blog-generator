import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Createprompt } from './createprompt';

describe('Createprompt', () => {
  let component: Createprompt;
  let fixture: ComponentFixture<Createprompt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Createprompt],
    }).compileComponents();

    fixture = TestBed.createComponent(Createprompt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
