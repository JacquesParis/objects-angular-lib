import {
  Component,
  forwardRef,
  ViewChildren,
  QueryList,
  Input,
} from '@angular/core';
import { EditableAbstractControlInput } from '../editable-abstract/editable-abstract-control-input';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NgControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableTextComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditableTextComponent),
      multi: true,
    },
  ],
})
export class EditableTextComponent extends EditableAbstractControlInput {
  @ViewChildren(NgControl) inputCtrl: QueryList<NgControl>;
  @Input() inputClass: string;
  @Input() required = false;
  constructor() {
    super();
  }
}
