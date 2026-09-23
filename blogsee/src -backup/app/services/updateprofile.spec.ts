import { TestBed } from '@angular/core/testing';

import { Updateprofile } from './updateprofile';

describe('Updateprofile', () => {
  let service: Updateprofile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Updateprofile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
