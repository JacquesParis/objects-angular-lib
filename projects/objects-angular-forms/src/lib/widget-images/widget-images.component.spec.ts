import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetImagesComponent } from './widget-images.component';

describe('WidgetImagesComponent', () => {
  let component: WidgetImagesComponent;
  let fixture: ComponentFixture<WidgetImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidgetImagesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
