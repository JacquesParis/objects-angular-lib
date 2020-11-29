import {
  ControlValueAccessor,
  ValidationErrors,
  AbstractControl,
  Validator,
} from '@angular/forms';
import { OnInit, Input, OnDestroy } from '@angular/core';

export abstract class AbstractInputComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input() disabled = false;
  model: any;
  onChange: (rating: number) => void;
  onTouched: () => void;
  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}

  set value(value) {
    this.model = value;
  }

  get value() {
    return this.model;
  }

  // Allows Angular to update the model (rating).
  // Update the model and changes needed for the view here.
  writeValue(value: any): void {
    this.value = value;
  }
  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (rating: number) => void): void {
    this.onChange = fn;
  }
  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  abstract validate(control: AbstractControl): ValidationErrors | null;
}
