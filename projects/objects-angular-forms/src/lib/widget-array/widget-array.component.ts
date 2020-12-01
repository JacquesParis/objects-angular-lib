import { IJsonLayoutProperty } from './../../../../../dist/objects-angular-forms/lib/editable-abstract/i-json-schema.d';
import { IJsonLayout, IJsonSchema } from './../editable-abstract/i-json-schema';
import { EditableFormDirective } from './../editable-form.directive';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'array-widget',
  templateUrl: './widget-array.component.html',
  styleUrls: ['./widget-array.component.scss'],
})
export class WidgetArrayComponent implements OnInit {
  formControl: FormArray;
  controlName: string;
  controlValue: any[];
  controlDisabled = false;
  boundControl = false;
  options: IJsonLayoutProperty;
  @Input() layoutNode: {
    arrayItem?: boolean;
    dataPointer?: string;
    dataType?: string;
    name: string;
    options: IJsonLayoutProperty;
    type: string;
    widget: new () => object;
  };
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  itemSchema: IJsonSchema;
  itemLayout: IJsonLayout = [];
  model: any[];
  simpleTypeArray: boolean = true;
  constructor(
    private jsf: JsonSchemaFormService,
    public editableFormDirective: EditableFormDirective
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    switch (this.options?.arrayItems?.type) {
      case 'object':
        this.itemLayout = Object.keys(this.options?.arrayItems?.properties);
        this.itemSchema = this.options.arrayItems;
        this.simpleTypeArray = false;
        break;

      default:
        this.itemSchema = {
          type: 'object',
          properties: { item: this.options.arrayItems },
        };
        this.itemLayout = ['item'];
        break;
    }
    this.itemLayout.push({
      type: 'submit',
      title: 'OK',
      condition: 'false',
    });
    this.jsf.initializeControl(this);
    this.model = [];
    switch (this.options?.arrayItems?.type) {
      case 'object':
        this.model = this.controlValue.filter((item) => null !== item);
        break;
      default:
        this.model = this.controlValue
          .filter((item) => null !== item)
          .map((item) => ({
            item,
          }));
    }
  }

  trackByFn(index, item) {
    return index;
  }
  /*
  get model() {
    if (!this.controlValue) {
      return [];
    }
    switch (this.layoutNode.items[0].type) {
      case 'object':
        return this.controlValue.filter((item) => null !== item);
      default:
        return this.controlValue
          .filter((item) => null !== item)
          .map((item) => ({
            item,
          }));
    }
  }*/

  get changedValue(): any[] {
    this.controlValue = this.controlValue ? this.controlValue : [];
    for (let valueIndex = 0; valueIndex < this.model.length; valueIndex++) {
      if (valueIndex < this.controlValue.length) {
        switch (this.options?.arrayItems?.type) {
          case 'object':
            this.controlValue[valueIndex] =
              undefined === this.model[valueIndex]
                ? null
                : this.model[valueIndex];
            break;
          default:
            this.controlValue[valueIndex] =
              undefined === this.model[valueIndex].item
                ? null
                : this.model[valueIndex].item;
        }
      } else {
        switch (this.options?.arrayItems?.type) {
          case 'object':
            this.controlValue.push(
              undefined === this.model[valueIndex]
                ? null
                : this.model[valueIndex]
            );
            break;
          default:
            this.controlValue.push(
              undefined === this.model[valueIndex].item
                ? null
                : this.model[valueIndex].item
            );
        }
      }
    }
    while (this.controlValue.length > this.model.length) {
      this.controlValue.splice(this.controlValue.length - 1, 1);
    }
    if (0 === this.controlValue.length) {
      this.controlValue = [null];
    }
    return this.controlValue;
  }

  remove(index) {
    this.model.splice(index, 1);
    if (0 < this.model.length) {
      this.formControl.controls.splice(index, 1);
    }
    this.jsf.updateValue(this, this.changedValue);
  }
  itemChanged(value, index) {
    if (this.changeItem(value, index)) {
      this.jsf.updateValue(this, this.changedValue);
    }
  }
  changeItem(value, index) {
    if (
      _.isObject(value) &&
      0 < Object.keys(value).length &&
      !_.isEqual(value, this.model[index])
    ) {
      for (const key of Object.keys(this.model[index])) {
        if (!(key in value)) {
          delete this.model[index][key];
        }
      }
      for (const key of Object.keys(value)) {
        this.model[index][key] = value[key];
      }

      return true;
    }
    return false;
  }
  itemSubmited(value, index) {
    this.changeItem(value, index);
    this.add(index + 1);
  }

  add(index) {
    this.model.splice(index, 0, {});

    if (this.formControl.controls.length < this.model.length) {
      this.formControl.controls.splice(
        index,
        0,
        new FormControl(
          null,
          this.formControl.controls[0].validator,
          this.formControl.controls[0].asyncValidator
        )
      );
    }
    this.jsf.updateValue(this, this.changedValue);
  }
}
