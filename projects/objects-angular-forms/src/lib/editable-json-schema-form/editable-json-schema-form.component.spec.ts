import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableJsonSchemaFormComponent } from './editable-json-schema-form.component';

describe('EditableJsonSchemaFormComponent', () => {
  let component: EditableJsonSchemaFormComponent;
  let fixture: ComponentFixture<EditableJsonSchemaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableJsonSchemaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableJsonSchemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
