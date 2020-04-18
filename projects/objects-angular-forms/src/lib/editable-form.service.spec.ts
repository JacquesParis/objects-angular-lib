import { TestBed } from '@angular/core/testing';

import { EditableFormService } from './editable-form.service';

describe('EditableFormService', () => {
  let service: EditableFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditableFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
