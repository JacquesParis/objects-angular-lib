import { Component, OnInit } from '@angular/core';
import {
  SelectComponent,
  JsonSchemaFormService,
} from 'angular6-json-schema-form';

@Component({
  selector: 'app-widget-icon',
  templateUrl: './widget-icon.component.html',
  styleUrls: ['./widget-icon.component.scss'],
})
export class WidgetIconComponent extends SelectComponent {
  constructor(protected jsonSchemaFormService: JsonSchemaFormService) {
    super(jsonSchemaFormService);
  }
}
