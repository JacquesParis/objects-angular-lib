import { EditableAbtractInput } from './editable-abstract-input';
import { QueryList } from '@angular/core';
import { NgControl, AbstractControl, ValidationErrors } from '@angular/forms';
export abstract class EditableAbstractControlInput extends EditableAbtractInput {
  public editionControllerName = 'edit';
  abstract inputCtrl: QueryList<NgControl>;
  constructor() {
    super();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.inputCtrl.find(
      (item) => item.name === this.editionControllerName
    )
      ? this.inputCtrl.find((item) => item.name === this.editionControllerName)
          .errors
      : null;
  }
}
