import { TestBed, inject } from '@angular/core/testing';

import { WebsocketPluginService } from './websocket-plugin.service';

describe('WebsocketPluginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketPluginService]
    });
  });

  it('should be created', inject([WebsocketPluginService], (service: WebsocketPluginService) => {
    expect(service).toBeTruthy();
  }));
});
