import { EditableFormService } from './../editable-form.service';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'file-widget',
  templateUrl: './widget-file.component.html',
})
export class WidgetFileComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    private jsf: JsonSchemaFormService,
    private editableFormService: EditableFormService
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsf.initializeControl(this);
  }

  handleFileInput(files: FileList) {
    this.jsf.updateValue(
      this,
      this.editableFormService.regsterWidgetValue(files.item(0))
    );
  }

  updateValue(event) {
    this.jsf.updateValue(this, event);
  }
}
