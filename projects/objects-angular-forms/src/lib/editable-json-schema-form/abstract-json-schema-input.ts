import { Input } from '@angular/core';
import { IJsonSchema } from './../editable-abstract/i-json-schema';
import { AbstractInputComponent } from './abstract-input';

export abstract class AbstractJsonSchemaInput extends AbstractInputComponent {
  @Input() schema: IJsonSchema;
}
