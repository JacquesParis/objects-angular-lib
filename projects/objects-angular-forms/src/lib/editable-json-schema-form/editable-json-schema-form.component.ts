import { Component, OnInit, forwardRef, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NgForm } from '@angular/forms';
import { EditableAbtractInput } from '../editable-abstract/editable-abstract-input';
import { IJsonSchema } from '../editable-abstract/i-json-schema';
import { EditableFormDirective } from '../editable-form.directive';
import * as _ from 'lodash';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-json-schema-form',
  templateUrl: './editable-json-schema-form.component.html',
  styleUrls: ['./editable-json-schema-form.component.scss'],
})
export class EditableJsonSchemaFormComponent implements OnInit {
  @Input() schema: IJsonSchema;
  @Input() validators: { [key: string]: any } = {};
  @Input() properties: {
    [key: string]: any;
    editionProperties: any;
  };
  @Input() saveValue: (value) => Promise<void>;
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;
  @ViewChild('f') form: NgForm;
  @ViewChild('sf') sform: any;
  public schemaView: IJsonSchema;
  editionProperties: any;
  constructor() {}
  ngOnInit(): void {
    this.schemaView = _.cloneDeep(this.schema);

    for (const key of Object.keys(this.schemaView.properties)) {
      this.schemaView.properties[key].readOnly = true;
    }
    this.editionProperties = this.properties.editionProperties;
  }

  switchMode() {
    if (this.libEditableForm.isViewMode) {
      this.editionProperties = this.properties.editionProperties;
    }
    this.libEditableForm.switchMode();
  }
  saveEditMode() {
    console.log('invalid', this.form.invalid);
    console.log('invalid', this.form.form.invalid);
    console.log(this.form);
    console.log(this.sform);
    this.saveValue(this.editionProperties).then(() => {
      this.libEditableForm.saveEditMode();
    });
  }
}
