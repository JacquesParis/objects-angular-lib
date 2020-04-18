import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  Input,
} from '@angular/core';
import { NgControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { EditableAbstractControlInput } from '../editable-abstract/editable-abstract-control-input';
import { forwardRef } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-textarea',
  templateUrl: './editable-textarea.component.html',
  styleUrls: ['./editable-textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableTextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditableTextareaComponent),
      multi: true,
    },
  ],
})
export class EditableTextareaComponent extends EditableAbstractControlInput {
  @ViewChildren(NgControl) inputCtrl: QueryList<NgControl>;
  @Input() inputClass: string;
  @Input() required = false;
  @Input() rows = 10;
  constructor() {
    super();
  }
}
