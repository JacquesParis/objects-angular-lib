import {
  IJsonLayout,
  IJsonSchema,
  IJsonLayoutProperty,
} from './../editable-abstract/i-json-schema';
import { EditableFormDirective } from './../editable-form.directive';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
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

  defaultValue(items: IJsonSchema) {
    switch (items.type) {
      case 'array':
        return [null];
      case 'object':
        return {};
      case 'string':
        return null;
      default:
        return null;
    }
  }

  emptyInsideValue(items: IJsonSchema = this.options.arrayItems) {
    switch (items.type) {
      case 'object':
        const result = {};
        for (const key of Object.keys(items.properties)) {
          result[key] = this.emptyOusideValue(items.properties[key]);
        }
        return result;
      case 'array':
        return { item: [this.emptyOusideValue(items.items)] };

      case 'string':
        return { item: this.defaultValue(items) };
      default:
        return { item: this.defaultValue(items) };
    }
  }
  emptyOusideValue(items: IJsonSchema = this.options.arrayItems) {
    switch (items.type) {
      case 'object':
        return this.emptyInsideValue(items);
      case 'array':
        return [this.emptyOusideValue(items.items)];
      default:
        return this.defaultValue(items);
    }
  }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    switch (this.options?.arrayItems?.type) {
      case 'object':
        this.itemLayout = Object.keys(this.options?.arrayItems?.properties).map(
          (key) => {
            const layout: IJsonLayoutProperty = { key };
            if ('array' === this.options?.arrayItems?.properties[key].type) {
              layout.arrayItems = this.options?.arrayItems?.properties[
                key
              ].items;
            }
            return layout;
          }
        );
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
        this.model = this.controlValue.filter(
          (item) => null !== item && !_.isEqual(this.emptyInsideValue(), item)
        );
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
              undefined === this.model[valueIndex] ||
              _.isEqual(this.emptyInsideValue(), this.model[valueIndex].item)
                ? this.emptyOusideValue()
                : _.merge({}, this.emptyOusideValue(), this.model[valueIndex]);
            for (const key of Object.keys(this.controlValue[valueIndex])) {
              while (
                'FormArray' ===
                  (this.formControl.controls[valueIndex] as FormGroup).controls[
                    key
                  ].constructor.name &&
                _.isArray(this.controlValue[valueIndex][key]) &&
                this.controlValue[valueIndex][key].length >
                  ((this.formControl.controls[valueIndex] as FormGroup)
                    .controls[key] as FormArray).controls.length
              ) {
                ((this.formControl.controls[valueIndex] as FormGroup).controls[
                  key
                ] as FormArray).controls.push(
                  ((this.formControl.controls[valueIndex] as FormGroup)
                    .controls[key] as FormArray).controls[0]
                );
              }

              while (
                'FormArray' ===
                  (this.formControl.controls[valueIndex] as FormGroup).controls[
                    key
                  ].constructor.name &&
                _.isArray(this.controlValue[valueIndex][key]) &&
                this.controlValue[valueIndex][key].length <
                  ((this.formControl.controls[valueIndex] as FormGroup)
                    .controls[key] as FormArray).controls.length
              ) {
                ((this.formControl.controls[valueIndex] as FormGroup).controls[
                  key
                ] as FormArray).controls.pop();
              }
            }
            break;
          default:
            this.controlValue[valueIndex] =
              undefined === this.model[valueIndex].item ||
              _.isEqual(this.emptyInsideValue(), this.model[valueIndex].item)
                ? this.emptyOusideValue()
                : this.model[valueIndex].item;
        }
      } else {
        switch (this.options?.arrayItems?.type) {
          case 'object':
            this.controlValue.push(
              undefined === this.model[valueIndex] ||
                _.isEqual(this.emptyInsideValue(), this.model[valueIndex].item)
                ? this.emptyOusideValue()
                : this.model[valueIndex]
            );
            break;
          default:
            this.controlValue.push(
              undefined === this.model[valueIndex].item ||
                _.isEqual(this.emptyInsideValue(), this.model[valueIndex].item)
                ? this.emptyOusideValue()
                : this.model[valueIndex].item
            );
        }
      }
    }
    while (this.controlValue.length > this.model.length) {
      this.controlValue.splice(this.controlValue.length - 1, 1);
    }
    if (
      0 === this.controlValue.length &&
      'object' !== this.options?.arrayItems?.type
    ) {
      this.controlValue = [null];
    } else if (0 === this.controlValue.length) {
      this.controlValue = [this.emptyInsideValue()];
    }
    return this.controlValue;
  }

  remove(index) {
    this.model.splice(index, 1);
    const changedValue = this.changedValue;
    if (1 < this.formControl.controls.length) {
      this.formControl.controls.splice(index, 1);
    }
    this.jsf.updateValue(this, changedValue);
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
    this.model.splice(index, 0, this.emptyInsideValue());

    const changedValue = this.changedValue;
    if (this.formControl.controls.length < changedValue.length) {
      this.formControl.controls.splice(
        index,
        0,
        new FormControl(
          this.emptyInsideValue(),
          this.formControl.controls[0].validator,
          this.formControl.controls[0].asyncValidator
        )
      );
    }
    this.jsf.updateValue(this, changedValue);
  }
}
