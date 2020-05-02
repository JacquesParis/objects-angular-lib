import { Directive, OnInit, OnDestroy, Input } from '@angular/core';
import { EditableFormService } from './editable-form.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[libEditableForm]',
  exportAs: 'EditableFormDirective',
})
export class EditableFormDirective implements OnInit, OnDestroy {
  @Input() initialEditMode = false;
  // tslint:disable-next-line: variable-name
  protected _editModeSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  // tslint:disable-next-line: variable-name
  protected _cancelSubject: Subject<void> = new Subject<void>();
  public id: string;
  constructor(protected editableFormService: EditableFormService) {
    this.id = '' + Math.ceil(Math.random() * 10000000000000000000000000000);
  }
  ngOnInit(): void {
    if (this.isEditMode) {
      this.editableFormService.registerFormInEdition(this.id);
    } else {
      this.editableFormService.unregisterFormInEdition(this.id);
    }
    if (this.initialEditMode) {
      window.setTimeout(() => {
        this.enterEditMode();
      });
    }
  }
  ngOnDestroy(): void {
    this.editableFormService.unregisterFormInEdition(this.id);
  }

  get editModeObservable(): Observable<boolean> {
    return this._editModeSubject.asObservable();
  }
  get cancelObservable(): Observable<void> {
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
    this._cancelSubject.next();
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
