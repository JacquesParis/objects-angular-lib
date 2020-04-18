import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { EditableFormDirective } from '../editable-form.directive';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableInputComponent),
      multi: true,
    },
  ],
})
export class EditableInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor {
  protected viewValue: any;
  constructor(protected editableFormDirective: EditableFormDirective) {}
  private editModeSubscription: Subscription;
  private cancelSubscription: Subscription;
  public isEditMode: boolean;
  protected currentValue: any;
  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
  writeValue(obj: any): void {
    this.currentValue = obj;
  }
  setDisabledState?(isDisabled: boolean): void {}
  ngOnDestroy(): void {
    if (this.editModeSubscription) {
      this.editModeSubscription.unsubscribe();
    }
    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.editModeSubscription = this.editableFormDirective.editModeObservable.subscribe(
      (editMode) => {
        this.isEditMode = editMode;
        if (this.isEditMode) {
          this.viewValue = JSON.parse(JSON.stringify(this.currentValue));
        }
      }
    );
    this.cancelSubscription = this.editableFormDirective.cancelObservable.subscribe(
      () => {
        this.currentValue = this.viewValue;
        this.propagateChange(this.currentValue);
      }
    );
  }
}
