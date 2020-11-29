/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JsonSchemaFormlyComponent } from './json-schema-formly.component';

describe('JsonSchemaFormlyComponent', () => {
  let component: JsonSchemaFormlyComponent;
  let fixture: ComponentFixture<JsonSchemaFormlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonSchemaFormlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonSchemaFormlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
