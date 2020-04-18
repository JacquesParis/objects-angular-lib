import { TestBed } from '@angular/core/testing';

import { ObjectsAngularClientService } from './objects-angular-client.service';

describe('ObjectsAngularClientService', () => {
  let service: ObjectsAngularClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectsAngularClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
