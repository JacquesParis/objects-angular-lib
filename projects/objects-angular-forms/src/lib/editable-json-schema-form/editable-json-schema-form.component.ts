import { Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { EditableAbtractInput } from '../editable-abstract/editable-abstract-input';
import { IJsonSchema } from '../editable-abstract/i-json-schema';
import { EditableFormDirective } from '../editable-form.directive';
import * as _ from 'lodash';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-json-schema-form',
  templateUrl: './editable-json-schema-form.component.html',
  styleUrls: ['./editable-json-schema-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableJsonSchemaFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditableJsonSchemaFormComponent),
      multi: true,
    },
  ],
})
export class EditableJsonSchemaFormComponent extends EditableAbtractInput
  implements OnInit {
  @Input() schema: IJsonSchema;
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;
  public schemaView: IJsonSchema;
  viewValue: any;
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.schemaView = _.cloneDeep(this.schema);

    for (const key of Object.keys(this.schemaView.properties)) {
      this.schemaView.properties[key].readOnly = true;
    }
  }

  public writeValue(obj: any): void {
    super.writeValue(obj);
    this.viewValue = _.cloneDeep(this.value);
  }

  switchMode() {
    if (this.libEditableForm.isViewMode) {
      this.viewValue = _.cloneDeep(this.value);
    } else {
      this.value = _.cloneDeep(this.viewValue);
    }
    this.libEditableForm.switchMode();
  }
  saveEditMode() {
    this.viewValue = _.cloneDeep(this.value);
    this.onChange();
  }
}
