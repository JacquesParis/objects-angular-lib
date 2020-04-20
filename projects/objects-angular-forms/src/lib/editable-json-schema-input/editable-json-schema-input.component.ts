import {
  Component,
  OnInit,
  forwardRef,
  QueryList,
  ViewChildren,
  Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NgControl } from '@angular/forms';
import { EditableTextComponent } from '../editable-text/editable-text.component';
import { EditableAbstractControlInput } from '../editable-abstract/editable-abstract-control-input';
import * as _ from 'lodash';
import { IJsonSchema } from '../editable-abstract/i-json-schema';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-json-schema-input',
  templateUrl: './editable-json-schema-input.component.html',
  styleUrls: ['./editable-json-schema-input.component.scss'],
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
export class EditableJsonSchemaInputComponent
  extends EditableAbstractControlInput
  implements OnInit {
  @ViewChildren(NgControl) inputCtrl: QueryList<NgControl>;
  @Input() schema: IJsonSchema;
  @Input() inputClass: string;
  @Input() required = false;
  public schemaView: IJsonSchema;
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.schemaView = _.cloneDeep(this.schema);

    for (const key of Object.keys(this.schemaView.properties)) {
      this.schemaView.properties[key].readOnly = true;
    }
  }
}
