import { TestBed } from '@angular/core/testing';

import { CyranoTutorialService } from './cyrano-tutorial.service';

describe('CyranoTutorialService', () => {
  let service: CyranoTutorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyranoTutorialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
