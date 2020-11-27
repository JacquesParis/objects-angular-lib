import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  and,
  isControl,
  isStringControl,
  optionIs,
  or,
  RankedTester,
  rankWith,
  schemaTypeIs,
} from '@jsonforms/core';
import { isObject } from 'angular6-json-schema-form';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'FileRendererComponent',
  templateUrl: './file-renderer.component.html',
  styleUrls: ['./file-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileRendererComponent extends JsonFormsControl {
  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }
  getEventValue = (event: any) => event.target.value;
  getType = (): string => {
    if (this.uischema.options && this.uischema.options.format) {
      return this.uischema.options.format;
    }
    if (this.scopedSchema && this.scopedSchema.format) {
      switch (this.scopedSchema.format) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        default:
          return 'text';
      }
    }
    return 'text';
  };
}
export const FileRendererTester: RankedTester = rankWith(
  10,
  // isStringControl
  and(isObject, optionIs('file', true))
);
