import { TestBed } from '@angular/core/testing';

import { LoggersApiService } from './loggers-api.service';

describe('LoggersApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoggersApiService = TestBed.get(LoggersApiService);
    expect(service).toBeTruthy();
  });
});
