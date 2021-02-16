/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WidgetPositionComponent } from './widget-position.component';

describe('WidgetPositionComponent', () => {
  let component: WidgetPositionComponent;
  let fixture: ComponentFixture<WidgetPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetPositionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
