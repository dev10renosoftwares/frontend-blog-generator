import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Likedblog } from './likedblog';

describe('Likedblog', () => {
  let component: Likedblog;
  let fixture: ComponentFixture<Likedblog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Likedblog],
    }).compileComponents();

    fixture = TestBed.createComponent(Likedblog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
