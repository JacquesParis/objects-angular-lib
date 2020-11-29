/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Angular6JsonSchemaFormImplComponent } from './angular6-json-schema-form-impl.component';

describe('Angular6JsonSchemaFormImplComponent', () => {
  let component: Angular6JsonSchemaFormImplComponent;
  let fixture: ComponentFixture<Angular6JsonSchemaFormImplComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Angular6JsonSchemaFormImplComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Angular6JsonSchemaFormImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
