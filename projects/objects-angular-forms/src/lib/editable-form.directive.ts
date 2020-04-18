import { Directive, OnInit, OnDestroy } from '@angular/core';
import { EditableFormService } from './editable-form.service';
import { BehaviorSubject, Observable } from 'rxjs';
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[libEditableForm]',
  exportAs: 'EditableFormDirective',
})
export class EditableFormDirective implements OnInit, OnDestroy {
  // tslint:disable-next-line: variable-name
  protected _editModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  // tslint:disable-next-line: variable-name
  protected _cancelSubject: BehaviorSubject<number> = new BehaviorSubject<
    number
  >(0);
  protected id: string;
  constructor(protected editableFormService: EditableFormService) {
    this.id = '' + Math.ceil(Math.random() * 10000000000000000000000000000);
  }
  ngOnInit(): void {
    if (this.isEditMode) {
      this.editableFormService.registerFormInEdition(this.id);
    } else {
      this.editableFormService.unregisterFormInEdition(this.id);
    }
  }
  ngOnDestroy(): void {
    this.editableFormService.unregisterFormInEdition(this.id);
  }

  get editModeObservable(): Observable<boolean> {
    return this._editModeSubject.asObservable();
  }
  get cancelObservable(): Observable<number> {
    return this._cancelSubject.asObservable();
  }

  public switchMode() {
    if (this.isEditMode) {
      this.cancelEditMode();
    } else {
      this.enterEditMode();
    }
  }

  public enterEditMode() {
    if (this.isEditable) {
      this._editModeSubject.next(true);

      this.editableFormService.registerFormInEdition(this.id);
    }
  }

  get isEditable() {
    return this.isViewMode && !this.editableFormService.hasARunningEdition;
  }

  public cancelEditMode() {
    this._cancelSubject.next(this._cancelSubject.value + 1);
    this._editModeSubject.next(false);
    this.editableFormService.unregisterFormInEdition(this.id);
  }

  public saveEditMode() {
    this._editModeSubject.next(false);
    this.editableFormService.unregisterFormInEdition(this.id);
  }

  get isEditMode(): boolean {
    return this._editModeSubject.value;
  }
  get isViewMode(): boolean {
    return !this._editModeSubject.value;
  }

  get hasActionDisabled(): boolean {
    return this.isViewMode && !this.isEditable;
  }
}
