import { TestBed } from '@angular/core/testing';

import { StructsApiService } from './structs-api.service';

describe('StructsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StructsApiService = TestBed.get(StructsApiService);
    expect(service).toBeTruthy();
  });
});
