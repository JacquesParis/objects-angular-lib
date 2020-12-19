import {
  IJsonSchema,
  IJsonLayout,
  IJsonLayoutProperty,
} from './../editable-abstract/i-json-schema';
import { EditableFormDirective } from './../editable-form.directive';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-widget-object',
  templateUrl: './widget-object.component.html',
  styleUrls: ['./widget-object.component.scss'],
})
export class WidgetObjectComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: {
    base64?: string;
    size?: string;
    name?: string;
    type?: string;
    id?: string;
    uri?: string;
  };
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  itemSchema: IJsonSchema;
  itemLayout: IJsonLayout = [];
  model: any;
  constructor(
    private jsf: JsonSchemaFormService,
    public editableFormDirective: EditableFormDirective
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.itemSchema = this.options;
    this.itemLayout = Object.keys(this.options.properties).map((key) => {
      const layout: IJsonLayoutProperty = { key };
      if ('array' === this.options?.arrayItems?.properties[key].type) {
        layout.arrayItems = this.options?.arrayItems?.properties[key].items;
      }
      return layout;
    });

    this.itemLayout.push({
      type: 'submit',
      title: 'OK',
      condition: 'false',
    });
    this.jsf.initializeControl(this);
    this.model = this.controlValue;
  }
  itemChanged(value) {
    this.jsf.updateValue(this, value);
  }
}
