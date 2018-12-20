import { TestBed, inject } from '@angular/core/testing';

import { OlddataService } from './olddata.service';

describe('OlddataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OlddataService]
    });
  });

  it('should be created', inject([OlddataService], (service: OlddataService) => {
    expect(service).toBeTruthy();
  }));
});
