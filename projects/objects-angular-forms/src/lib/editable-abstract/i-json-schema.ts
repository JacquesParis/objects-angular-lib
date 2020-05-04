import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export interface IJsonSchema {
  properties: { [name: string]: any };
  [otherKey: string]: any;
}

export interface IJsonLayoutProperty {
  type?: string;
  title?: string;
  htmlClass?: string;
  condition?: string;
  key?: string;
  notitle?: boolean;
  description?: string;
  validationMessage?: string;
  onChange?: any;
  feedback?: boolean;
  disableSuccessState?: boolean;
  disableErrorState?: boolean;
  placeholder?: string;
  ngModelOptions?: any;
  readonly?: boolean;
  fieldHtmlClass?: string;
  labelHtmlClass?: string;
  copyValueTo?: string[];
  destroyStrategy?: string;
  validator?: ValidatorFn;
}

export type IJsonLayout = (string | IJsonLayoutProperty)[];

export enum JsonSchemaCustomType {
  'string-json' = 'string-json',
  'object-json' = 'object-json',
}
