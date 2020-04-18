import { OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  AbstractControlOptions,
  ValidatorFn,
  AsyncValidatorFn,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
export abstract class EditableAbtractInput
  implements ControlValueAccessor, Validator {
  public value;
  disabled: boolean;
  constructor() {}
  propagateChange = (_: any) => {};
  public writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  public onChange() {
    this.propagateChange(this.value);
  }
  registerOnTouched(fn: any): void {}
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }
}
