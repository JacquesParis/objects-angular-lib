import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableJsonSchemaInputComponent } from './editable-json-schema-input.component';

describe('EditableJsonSchemaInputComponent', () => {
  let component: EditableJsonSchemaInputComponent;
  let fixture: ComponentFixture<EditableJsonSchemaInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableJsonSchemaInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableJsonSchemaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
