import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomInputProperty } from './../editable-json-schema-form/editable-json-schema-form.constant';
export const JSON_FILE_PROPERTY: CustomInputProperty = {
  type: 'object',
  'x-schema-form-type': 'file',
  validator: (control: AbstractControl): ValidationErrors | null => {
    return null;
  },
  properties: {
    base64: { type: 'string', required: false },
    size: { type: 'string', required: false },
    name: { type: 'string', required: false },
    type: { type: 'string', required: false },
    id: { type: 'string', required: false },
    uri: { type: 'string', required: false },
  },
};
