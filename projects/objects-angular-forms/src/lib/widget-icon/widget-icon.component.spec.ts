/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WidgetIconComponent } from './widget-icon.component';

describe('WidgetIconComponent', () => {
  let component: WidgetIconComponent;
  let fixture: ComponentFixture<WidgetIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
