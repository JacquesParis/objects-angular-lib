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
  controlValue: string;
  controlValueText: string = '';
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  currentValue: string;

  constructor(private jsf: JsonSchemaFormService) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.currentValue = this.controlValue;
    this.jsf.initializeControl(this);
  }

  lostFocus(event) {
    if (this.currentValue && this.currentValue !== this.controlValue) {
      this.controlValue = this.currentValue;
    }
  }

  updateValue(event) {
    try {
      this.currentValue = JSON.stringify(
        JSON.parse(event.target.value),
        undefined,
        2
      );
      if (this.formControl.value !== this.currentValue) {
        this.jsf.updateValue(this, this.currentValue);
      }
    } catch (error) {}
  }
}
