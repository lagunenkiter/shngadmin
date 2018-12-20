import { TestBed } from '@angular/core/testing';

import { LogsApiService } from './logs-api.service';

describe('LogsApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogsApiService = TestBed.get(LogsApiService);
    expect(service).toBeTruthy();
  });
});
