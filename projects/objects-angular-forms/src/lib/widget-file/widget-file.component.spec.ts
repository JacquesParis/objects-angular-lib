import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetFileComponent } from './widget-file.component';

describe('WidgetFileComponent', () => {
  let component: WidgetFileComponent;
  let fixture: ComponentFixture<WidgetFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
