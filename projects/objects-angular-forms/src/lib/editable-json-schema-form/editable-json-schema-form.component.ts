import { UISchemaElement, JsonSchema } from '@jsonforms/core';
import { JSON_FILE_PROPERTY } from './../widget-file/widget-file.constant';
import { CustomInputProperty } from './editable-json-schema-form.constant';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  Output,
  ElementRef,
  TemplateRef,
  OnChanges,
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
  IJsonLayoutProperty,
} from '../editable-abstract/i-json-schema';
import { EditableFormDirective } from '../editable-form.directive';
import * as _ from 'lodash-es';
import { QueryList, EventEmitter, OnDestroy } from '@angular/core';
import { JsonSchemaFormComponent } from 'angular6-json-schema-form';
import { JsonSchemaCustomType } from '../editable-abstract/i-json-schema';
import { ValidationErrors } from '@angular/forms';
import { EditableFormService } from '../editable-form.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
  string_json: JSON_INPUT_PROPERTY,
  object_json: _.merge({}, JSON_INPUT_PROPERTY, {
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
  file_undefined: JSON_FILE_PROPERTY,
  textarea_undefined: {
    type: 'string',
    'x-schema-form-type': 'textarea',
    fieldHtmlClass: 'height-200',
  },
};

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-json-schema-form',
  templateUrl: './editable-json-schema-form.component.html',
  styleUrls: ['./editable-json-schema-form.component.scss'],
})
export class EditableJsonSchemaFormComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() schema: IJsonSchema;
  @Input() public layout: IJsonLayoutProperty[] = [];
  @Input() entity: {
    [key: string]: any;
    editionProperties: any;
    isNewEntity: boolean;
  };
  @Input() saveValue: (value) => Promise<void>;
  @Input() deleteValue: () => Promise<void>;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;
  @ViewChildren('editionFormQuery')
  editionFormQuery: QueryList<JsonSchemaFormComponent>;

  @ViewChildren('viewFormQuery', { read: ElementRef })
  viewFormQuery: QueryList<ElementRef>;
  public schemaView: IJsonSchema;
  public editionProperties: any;
  public schemaEdit: IJsonSchema;
  // tslint:disable-next-line: variable-name
  protected _changedValue: any;
  protected validators: { [key: string]: ValidatorFn };
  protected propertyAdapters: {
    [property: string]: {
      before: (value: any) => any;
      after: (value: any) => any;
    };
  } = {};
  public isInCreation = false;
  isValid: any;
  subscriptions: Subscription[] = [];
  schemaJsonEdit: JsonSchema;
  uischemaJsonEdit: UISchemaElement;
  schemaJsonView: JsonSchema;
  uischemaJsonView: UISchemaElement;
  valueView: any;
  valueEdit: any;
  get viewProperties() {
    return this.editionPropertiesCompleted;
  }

  public layoutEdit: IJsonLayout;
  public layoutView: IJsonLayout;
  public error: string;
  public modalRef: BsModalRef;
  constructor(
    protected editableFormService: EditableFormService,
    protected modalService: BsModalService
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  async initJsonFormsObject(
    schemaJson,
    uischemaJson = { type: 'VerticalLayout', elements: [] }
  ): Promise<UISchemaElement> {
    const required = [];
    for (const key of Object.keys(schemaJson.properties)) {
      uischemaJson.elements.push({
        type: 'Control',
        scope: '#/properties/' + key,
        options: {
          file: 'file' === schemaJson.properties[key].type,
        },
      });
      if (schemaJson.properties[key].required) {
        delete schemaJson.properties[key].required;
        required.push(key);
      }
    }
    schemaJson.required = required;
    return uischemaJson;
  }
  async initJsonForms(): Promise<void> {
    this.schemaJsonEdit = _.cloneDeep(this.schema);
    this.uischemaJsonEdit = await this.initJsonFormsObject(this.schemaJsonEdit);
    this.schemaJsonView = _.cloneDeep(this.schemaJsonEdit);
    this.uischemaJsonView = _.cloneDeep(this.uischemaJsonEdit);
    for (const uiElement of (this.uischemaJsonView as any).elements) {
      uiElement.options.readonly = true;
    }
  }
  initJsonFormsValues() {
    this.valueView = _.cloneDeep(this.viewProperties);
    this.valueEdit = _.cloneDeep(this.editionProperties);
  }

  async ngOnInit(): Promise<void> {
    if (this.entity.isNewEntity) {
      this.isInCreation = this.entity.isNewEntity;
    }
    this.initJsonForms();
    this.schemaView = _.cloneDeep(this.schema);
    this.schemaEdit = _.cloneDeep(this.schema);
    this.validators = {};

    type JsonLayoutProperties = {
      [key: string]: IJsonLayoutProperty;
    };

    const inputLayoutProperty: JsonLayoutProperties = {};
    this.layout.forEach((property) => {
      inputLayoutProperty[property.key] = property;
      if (property.validator) {
        this.validators[property.key] = property.validator;
      }
    });
    this.layoutEdit = [];
    for (const key of Object.keys(this.schema.properties)) {
      await this.addDynamicOptions(key);
      this.addCustomInput(key, inputLayoutProperty);
      if (
        'object' === this.schemaView.properties[key].type &&
        !this.entity[key]
      ) {
        this.entity[key] = {};
      }
      if (key in inputLayoutProperty) {
        this.layoutEdit.push(inputLayoutProperty[key]);
      } else {
        this.layoutEdit.push(key);
      }
    }

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
      this.schemaView.properties[key].readOnly = true;
      this.schemaView.properties[key].disabled = true;
      /* this.schemaView.properties[key].fieldHtmlClass =
        'form-control-plaintext border';*/
      this.schemaView.properties[key].htmlClass = 'form-group-plaintext';
    }
    this.layoutView.forEach((property) => {
      if (_.isObject(property) && 'key' in (property as any)) {
        (property as any).readonly = true;
        (property as any).disabled = true;
      }
    });
    this.editionProperties = this.editionPropertiesCompleted;
    this.changedValue = this.editionPropertiesCompleted;
    this.initJsonFormsValues();
  }
  protected async addDynamicOptions(propertyKey: string) {
    for (const optionFunction in this.schema.properties[propertyKey]) {
      if (optionFunction.endsWith('Function')) {
        const option = optionFunction.substr(
          0,
          optionFunction.length - 'Function'.length
        );
        const optionValue = await this.schema.properties[propertyKey][
          optionFunction
        ]();
        this.schemaView.properties[propertyKey][option] = optionValue;
        this.schemaEdit.properties[propertyKey][option] = optionValue;
      }
    }
  }

  public ngOnChanges() {
    if (!!this.schemaView?.properties) {
      Object.keys(this.schemaView.properties).forEach((key) => {
        if (
          'object' === this.schemaView.properties[key].type &&
          !this.entity[key]
        ) {
          this.entity[key] = {};
        }
      });
    }
  }

  public openModal(template: TemplateRef<any>) {
    this.error = '';
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  protected addCustomInput(key: string, inputLayoutProperty) {
    if (!inputLayoutProperty[key]) {
      inputLayoutProperty[key] = { key };
    }
    const type =
      this.schema.properties[key].type +
      '_' +
      (this.schema.properties[key]['x-schema-form'] &&
        this.schema.properties[key]['x-schema-form'].type);
    if (type in CUSTOM_INPUT_PROPERTY) {
      this.schemaView.properties[key].type = CUSTOM_INPUT_PROPERTY[type].type;
      this.schemaEdit.properties[key].type = CUSTOM_INPUT_PROPERTY[type].type;
      if (!this.schemaView.properties[key]['x-schema-form']) {
        this.schemaView.properties[key]['x-schema-form'] = {};
      }
      this.schemaView.properties[key]['x-schema-form'].type =
        CUSTOM_INPUT_PROPERTY[type]['x-schema-form-type'];
      if (!this.schemaEdit.properties[key]['x-schema-form']) {
        this.schemaEdit.properties[key]['x-schema-form'] = {};
      }
      this.schemaEdit.properties[key]['x-schema-form'].type =
        CUSTOM_INPUT_PROPERTY[type]['x-schema-form-type'];
      if (CUSTOM_INPUT_PROPERTY[type].properties) {
        this.schemaView.properties[key].properties =
          CUSTOM_INPUT_PROPERTY[type].properties;
        this.schemaEdit.properties[key].properties =
          CUSTOM_INPUT_PROPERTY[type].properties;
      }
      if (CUSTOM_INPUT_PROPERTY[type].validator) {
        inputLayoutProperty[key].validator = inputLayoutProperty[key].validator
          ? Validators.compose([
              inputLayoutProperty[key].validator,
              CUSTOM_INPUT_PROPERTY[type].validator,
            ])
          : CUSTOM_INPUT_PROPERTY[type].validator;
        this.validators[key] = inputLayoutProperty[key].validator;
      }
      if (CUSTOM_INPUT_PROPERTY[type].fieldHtmlClass) {
        inputLayoutProperty[key].fieldHtmlClass =
          CUSTOM_INPUT_PROPERTY[type].fieldHtmlClass +
          (inputLayoutProperty[key].fieldHtmlClass
            ? ' ' + inputLayoutProperty[key].fieldHtmlClass
            : '');
      }
      if (CUSTOM_INPUT_PROPERTY[type].validationMessages) {
        inputLayoutProperty[key].validationMessages = inputLayoutProperty[key]
          .validationMessages
          ? _.merge(
              {},
              inputLayoutProperty[key].validationMessages,
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
      this.subscriptions.push(
        this.editionFormQuery.changes.subscribe(() => {
          this.addValidators();
        })
      );
      this.addValidators();
    }

    this.subscriptions.push(
      this.viewFormQuery.changes.subscribe(() => {
        this.forceReadOnlyView();
      })
    );
    this.forceReadOnlyView();

    this.subscriptions.push(
      this.libEditableForm.cancelObservable.subscribe(() => {
        this.onCancel.emit();
      })
    );
  }

  protected addValidators() {
    if (
      this.editionFormQuery.first &&
      this.editionFormQuery.first.jsf &&
      this.editionFormQuery.first.jsf.formGroup
    ) {
      const formGroup: FormGroup = this.editionFormQuery.first.jsf
        .formGroup as FormGroup;
      const formControls: { [key: string]: AbstractControl } = (this
        .editionFormQuery.first.jsf.formGroup as FormGroup).controls;
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
  }
  protected forceReadOnlyView() {
    if (this.viewFormQuery.first) {
      this.viewFormQuery.first.nativeElement
        .querySelectorAll('input')
        .forEach((input) => {
          input.disabled = true;
        });
    }
  }

  get editionPropertiesCompleted(): any {
    const editionProperties = this.entity.editionProperties;
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
    this.editableFormService.updateWidgetValues(changedValue);
    return changedValue;
  }
  protected set changedValue(value: any) {
    this._changedValue = value;
  }
  valueEditChange(value) {
    this.changedValue = value;
    this.isValid = !_.isEqual(this.valueEdit, this.changedValue);
  }
  switchMode() {
    this.error = '';

    if (this.libEditableForm.isViewMode) {
      this.editionProperties = this.editionPropertiesCompleted;
    }

    this.initJsonFormsValues();
    this.libEditableForm.switchMode();
  }
  async saveEditMode() {
    this.error = '';
    try {
      if (this.saveValue) {
        await this.saveValue(this.changedValue);
        this.libEditableForm.saveEditMode();
        this.isInCreation = this.entity.isNewEntity;
      } else {
        this.entity.editionProperties = this.changedValue;
        this.isInCreation = this.entity.isNewEntity;
      }
    } catch (error) {
      this.error = error.message ? error.message : 'Unexpected error';
    }
    this.initJsonFormsValues();
  }
  async delete() {
    this.error = '';
    this.modalRef.hide();
    try {
      await this.deleteValue();
      this.entity = null;
    } catch (error) {
      this.error = error.message ? error.message : 'Unexpected error';
    }
  }

  get _isValid() {
    if (
      this.editionFormQuery &&
      this.editionFormQuery.first &&
      this.editionFormQuery.first.jsf &&
      this.editionFormQuery.first.jsf.formGroup
    ) {
      const formGroup: FormGroup = this.editionFormQuery.first.jsf
        .formGroup as FormGroup;

      return _.every(
        Object.values(formGroup.controls),
        (control: AbstractControl) => {
          return !control.errors;
        }
      );
    } else {
      return false;
    }
  }

  public onChange(properties) {
    Object.keys(this.schemaEdit.properties).forEach((key) => {
      if (
        'oneOf' in this.schemaEdit.properties[key] &&
        'null' === properties[key] &&
        !_.find(this.schemaEdit.properties[key].oneOf, (oneOf) => {
          return oneOf.enum && 'null' === oneOf.enum[0];
        })
      ) {
        delete properties[key];
      }
      if (!(key in properties)) {
        let value =
          'default' in this.schemaEdit.properties[key]
            ? this.schemaEdit.properties[key].default
            : null;
        if (key in this.propertyAdapters) {
          value = this.propertyAdapters[key].before(value);
        }
        properties[key] = value;
      }
    });

    this.changedValue = properties;
    this.isValid = this._isValid;
  }
  public onSubmit(properties) {
    this.onChange(properties);
    this.saveEditMode();
  }
}
