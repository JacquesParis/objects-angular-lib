import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetCheckboxesComponent } from './widget-checkboxes.component';

describe('WidgetCheckboxesComponent', () => {
  let component: WidgetCheckboxesComponent;
  let fixture: ComponentFixture<WidgetCheckboxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetCheckboxesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetCheckboxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
