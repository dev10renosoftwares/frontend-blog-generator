import { TestBed } from '@angular/core/testing';

import { Createblog } from './createblog';

describe('Createblog', () => {
  let service: Createblog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Createblog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
