import { TestBed } from '@angular/core/testing';

import { Conferences } from './conferences';

describe('Conferences', () => {
  let service: Conferences;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conferences);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
