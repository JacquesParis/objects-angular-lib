import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EditableFormService {
  // tslint:disable-next-line: variable-name
  protected _runningEditionForm: string = undefined;
  get hasARunningEdition(): boolean {
    return undefined !== this._runningEditionForm;
  }

  public registerFormInEdition(formId: string) {
    this._runningEditionForm = formId;
  }
  public unregisterFormInEdition(formId: string) {
    if (this._runningEditionForm === formId) {
      this._runningEditionForm = undefined;
    }
  }

  constructor() {}
}
