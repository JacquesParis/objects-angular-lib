import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableFileComponent } from './editable-file.component';

describe('EditableFileComponent', () => {
  let component: EditableFileComponent;
  let fixture: ComponentFixture<EditableFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
