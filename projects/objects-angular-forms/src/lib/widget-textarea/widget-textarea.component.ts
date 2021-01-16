import { Component, OnInit } from '@angular/core';
import {
  TextareaComponent,
  JsonSchemaFormService,
} from 'angular6-json-schema-form';

@Component({
  selector: 'app-widget-textarea',
  templateUrl: './widget-textarea.component.html',
  styleUrls: ['./widget-textarea.component.scss'],
})
export class WidgetTextareaComponent extends TextareaComponent {
  constructor(protected jsonSchemaFormService: JsonSchemaFormService) {
    super(jsonSchemaFormService);
  }
}
