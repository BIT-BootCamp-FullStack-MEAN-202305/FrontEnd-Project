import { TestBed } from '@angular/core/testing';

import { ValidationPatternsService } from './validation-patterns.service';

describe('ValidationPatternsService', () => {
  let service: ValidationPatternsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationPatternsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
