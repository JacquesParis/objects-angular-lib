import { DomSanitizer } from '@angular/platform-browser';
import { AbstractControl } from '@angular/forms';
import {
  buildTitleMap,
  CheckboxesComponent,
  JsonSchemaFormService,
  TitleMapItem,
} from 'angular6-json-schema-form';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'checkboxes-widget',
  templateUrl: './widget-checkboxes.component.html',
  styleUrls: ['./widget-checkboxes.component.scss'],
})
export class WidgetCheckboxesComponent extends CheckboxesComponent {
  constructor(
    protected jsonSchemaFormService: JsonSchemaFormService,
    public sanitization: DomSanitizer
  ) {
    super(jsonSchemaFormService);
  }
  deselect() {
    for (const checkboxItem of this.checkboxList) {
      checkboxItem.checked = false;
    }

    if (this.boundControl) {
      this.jsonSchemaFormService.updateArrayCheckboxList(
        this,
        this.checkboxList
      );
    }
  }
  select() {
    for (const checkboxItem of this.checkboxList) {
      checkboxItem.checked = true;
    }

    if (this.boundControl) {
      this.jsonSchemaFormService.updateArrayCheckboxList(
        this,
        this.checkboxList
      );
    }
  }
}
