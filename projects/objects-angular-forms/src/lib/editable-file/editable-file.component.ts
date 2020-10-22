import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NgControl } from '@angular/forms';
import {
  Component,
  forwardRef,
  QueryList,
  ViewChildren,
  Input,
} from '@angular/core';
import { EditableAbstractControlInput } from '../editable-abstract/editable-abstract-control-input';

@Component({
  selector: 'lib-editable-file',
  templateUrl: './editable-file.component.html',
  styleUrls: ['./editable-file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableFileComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditableFileComponent),
      multi: true,
    },
  ],
})
export class EditableFileComponent extends EditableAbstractControlInput {
  @ViewChildren(NgControl) inputCtrl: QueryList<NgControl>;
  @Input() inputClass: string;
  @Input() required = false;
  constructor() {
    super();
  }
}
