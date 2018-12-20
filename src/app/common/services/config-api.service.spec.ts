import { TestBed } from '@angular/core/testing';

import { ConfigApiService } from './config-api.service';

describe('ConfigApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigApiService = TestBed.get(ConfigApiService);
    expect(service).toBeTruthy();
  });
});
