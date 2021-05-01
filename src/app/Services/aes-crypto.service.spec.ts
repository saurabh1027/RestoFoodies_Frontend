import { TestBed } from '@angular/core/testing';

import { AesCryptoService } from './aes-crypto.service';

describe('AesCryptoService', () => {
  let service: AesCryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AesCryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
