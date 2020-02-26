import { TestBed } from '@angular/core/testing';

import { GetProjectsService } from './get-projects.service';

describe('GetProjectsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetProjectsService = TestBed.get(GetProjectsService);
    expect(service).toBeTruthy();
  });
});
