import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import {
  IJsonSchema,
  IJsonLayout,
  IJsonLayoutPorperty,
} from '../editable-abstract/i-json-schema';
import { EditableFormDirective } from '../editable-form.directive';
import * as _ from 'lodash-es';
import { QueryList } from '@angular/core';
import { JsonSchemaFormComponent } from 'angular6-json-schema-form';
import { JsonSchemaCustomType } from '../editable-abstract/i-json-schema';
import { ValidationErrors } from '@angular/forms';

interface CustomInputProperty {
  type: string;
  'x-schema-form-type': string;
  validator?: ValidatorFn;
  fieldHtmlClass?: string;
  validationMessages?: { [error: string]: string };
  adapters?: {
    before: (value: any) => any;
    after: (value: any) => any;
  };
}

const JSON_INPUT_PROPERTY: CustomInputProperty = {
  type: 'string',
  'x-schema-form-type': 'textarea',
  validator: (control: AbstractControl): ValidationErrors | null => {
    try {
      JSON.parse(control.value);
    } catch (error) {
      return { 'no-json': true };
    }
    return null;
  },
  fieldHtmlClass: 'height-200',
  validationMessages: {
    'no-json': 'Please enter a valid JSON value',
  },
};

const CUSTOM_INPUT_PROPERTY: {
  [type in JsonSchemaCustomType]: CustomInputProperty;
} = {
  'string-json': JSON_INPUT_PROPERTY,
  'object-json': _.merge({}, JSON_INPUT_PROPERTY, {
    adapters: {
      before: (value) => {
        try {
          return JSON.stringify(value, undefined, 2);
        } catch (error) {}
        return '{}';
      },
      after: (value) => {
        try {
          return JSON.parse(value);
        } catch (error) {}
        return value;
      },
    },
  }),
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-json-schema-form',
  templateUrl: './editable-json-schema-form.component.html',
  styleUrls: ['./editable-json-schema-form.component.scss'],
})
export class EditableJsonSchemaFormComponent implements OnInit, AfterViewInit {
  @Input() schema: IJsonSchema;
  @Input() public layout: IJsonLayoutPorperty[] = [];
  @Input() properties: {
    [key: string]: any;
    editionProperties: any;
  };
  @Input() saveValue: (value) => Promise<void>;
  // @Output() validationErrors:EventEmitter<(value)=>any>
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;
  @ViewChildren('f') formQuery: QueryList<JsonSchemaFormComponent>;
  public schemaView: IJsonSchema;
  public editionProperties: any;
  public schemaEdit: IJsonSchema;
  protected _changedValue: any;
  protected validators: { [key: string]: ValidatorFn };
  protected propertyAdapters: {
    [property: string]: {
      before: (value: any) => any;
      after: (value: any) => any;
    };
  } = {};
  get viewProperties() {
    return this.editionPropertiesCompleted;
  }
  public layoutEdit: IJsonLayout;
  public layoutView: IJsonLayout;
  constructor() {}
  ngOnInit(): void {
    this.schemaView = _.cloneDeep(this.schema);
    this.schemaEdit = _.cloneDeep(this.schema);
    this.validators = {};

    type JsonLayoutProperties = {
      [key: string]: IJsonLayoutPorperty;
    };

    const inputLayoutPorperty: JsonLayoutProperties = {};
    this.layout.forEach((property) => {
      inputLayoutPorperty[property.key] = property;
      if (property.validator) {
        this.validators[property.key] = property.validator;
      }
    });
    this.layoutEdit = [];
    Object.keys(this.schema.properties).forEach((key) => {
      this.addCustomInput(key, inputLayoutPorperty);
      if (key in inputLayoutPorperty) {
        this.layoutEdit.push(inputLayoutPorperty[key]);
      } else {
        this.layoutEdit.push(key);
      }
    });

    this.layoutView = _.cloneDeep(this.layoutEdit);

    this.layoutView.push({
      type: 'submit',
      title: 'OK',
      condition: 'false',
    });
    this.layoutEdit.push({
      type: 'submit',
      title: 'OK',
      htmlClass: 'd-none',
    });

    for (const key of Object.keys(this.schemaView.properties)) {
      this.schemaView.properties[key].readonly = true;
    }
    this.editionProperties = this.editionPropertiesCompleted;
  }

  protected addCustomInput(key: string, inputLayoutPorperty) {
    const type =
      this.schema.properties[key].type +
      '-' +
      (this.schema.properties[key]['x-schema-form'] &&
        this.schema.properties[key]['x-schema-form'].type);
    if (type in CUSTOM_INPUT_PROPERTY) {
      this.schemaView.properties[key].type = CUSTOM_INPUT_PROPERTY[type].type;
      this.schemaEdit.properties[key].type = CUSTOM_INPUT_PROPERTY[type].type;
      this.schemaView.properties[key]['x-schema-form'].type =
        CUSTOM_INPUT_PROPERTY[type]['x-schema-form-type'];
      this.schemaEdit.properties[key]['x-schema-form'].type =
        CUSTOM_INPUT_PROPERTY[type]['x-schema-form-type'];
      if (!inputLayoutPorperty[key]) {
        inputLayoutPorperty[key] = { key };
      }
      if (CUSTOM_INPUT_PROPERTY[type].validator) {
        inputLayoutPorperty[key].validator = inputLayoutPorperty[key].validator
          ? Validators.compose([
              inputLayoutPorperty[key].validator,
              CUSTOM_INPUT_PROPERTY[type].validator,
            ])
          : CUSTOM_INPUT_PROPERTY[type].validator;
        this.validators[key] = inputLayoutPorperty[key].validator;
      }
      if (CUSTOM_INPUT_PROPERTY[type].fieldHtmlClass) {
        inputLayoutPorperty[key].fieldHtmlClass =
          CUSTOM_INPUT_PROPERTY[type].fieldHtmlClass +
          (inputLayoutPorperty[key].fieldHtmlClass
            ? ' ' + inputLayoutPorperty[key].fieldHtmlClass
            : '');
      }
      if (CUSTOM_INPUT_PROPERTY[type].validationMessages) {
        inputLayoutPorperty[key].validationMessages = inputLayoutPorperty[key]
          .validationMessages
          ? _.merge(
              {},
              inputLayoutPorperty[key].validationMessages,
              CUSTOM_INPUT_PROPERTY[type].validationMessages
            )
          : CUSTOM_INPUT_PROPERTY[type].validationMessages;
      }

      if (CUSTOM_INPUT_PROPERTY[type].adapters) {
        this.propertyAdapters[key] = CUSTOM_INPUT_PROPERTY[type].adapters;
      }
    }
  }

  ngAfterViewInit(): void {
    if (0 < Object.keys(this.validators).length) {
      this.formQuery.changes.subscribe(() => {
        if (
          this.formQuery.first &&
          this.formQuery.first.jsf &&
          this.formQuery.first.jsf.formGroup
        ) {
          const formGroup: FormGroup = this.formQuery.first.jsf
            .formGroup as FormGroup;
          const formControls: { [key: string]: AbstractControl } = (this
            .formQuery.first.jsf.formGroup as FormGroup).controls;
          Object.keys(this.validators).forEach((key) => {
            const formControl = formControls[key];
            if (formControl.validator) {
              formControl.validator = Validators.compose([
                formControl.validator,
                this.validators[key],
              ]);
            } else {
              formControl.validator = this.validators[key];
            }
          });
        }
      });
    }
  }

  yourIsValidFn(value) {
    console.log('yourIsValidFn', value);
  }
  yourValidationErrorsFn(value) {
    console.log('yourValidationErrorsFn', value);
  }
  descriptionStringVal(form, value) {
    console.log(form, value);
  }

  get editionPropertiesCompleted(): any {
    const editionProperties = this.properties.editionProperties;
    Object.keys(this.propertyAdapters).forEach((key) => {
      editionProperties[key] = this.propertyAdapters[key].before(
        editionProperties[key]
      );
    });
    return editionProperties;
  }

  protected get changedValue(): any {
    const changedValue = _.clone(this._changedValue);
    Object.keys(this.propertyAdapters).forEach((key) => {
      changedValue[key] = this.propertyAdapters[key].after(changedValue[key]);
    });
    return changedValue;
  }
  protected set changedValue(value: any) {
    this._changedValue = value;
  }

  switchMode() {
    if (this.libEditableForm.isViewMode) {
      this.editionProperties = this.editionPropertiesCompleted;
    }
    this.libEditableForm.switchMode();
  }
  saveEditMode() {
    if (this.saveValue) {
      this.saveValue(this.changedValue).then(() => {
        this.libEditableForm.saveEditMode();
      });
    } else {
      this.properties.editionProperties = this.changedValue;
    }
  }

  get isValid() {
    if (
      this.formQuery.first &&
      this.formQuery.first.jsf &&
      this.formQuery.first.jsf.formGroup
    ) {
      const formGroup: FormGroup = this.formQuery.first.jsf
        .formGroup as FormGroup;

      return _.every(
        Object.values(formGroup.controls),
        (control: AbstractControl) => {
          return !control.errors;
        }
      );
    } else {
      return true;
    }
  }

  public onChange(properties) {
    /*this.editionProperties = properties;*/
    this.changedValue = properties;
    console.log(properties, this.formQuery);
    /*
    console.log(properties, this.form);
    (this.form.first.jsf.formGroup as FormGroup).controls[
      'definitionString'
    ].setErrors({ 'non-json': true });*/
  }
  public onSubmit(properties) {
    this.onChange(properties);
    this.saveEditMode();
  }
}
