import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectsAngularClientComponent } from './objects-angular-client.component';

describe('ObjectsAngularClientComponent', () => {
  let component: ObjectsAngularClientComponent;
  let fixture: ComponentFixture<ObjectsAngularClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectsAngularClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectsAngularClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
