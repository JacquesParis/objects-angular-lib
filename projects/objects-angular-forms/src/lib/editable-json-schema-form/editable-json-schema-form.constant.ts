import { ValidatorFn } from '@angular/forms';
export interface CustomInputProperty {
  type: string;
  'x-schema-form-type': string;
  validator?: ValidatorFn;
  fieldHtmlClass?: string;
  validationMessages?: { [error: string]: string };
  adapters?: {
    before: (value: any) => any;
    after: (value: any) => any;
  };
  properties?: {
    [key: string]: { type: string; required: boolean };
  };
}
