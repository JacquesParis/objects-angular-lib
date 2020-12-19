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
  SimpleChanges,
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
  @Input() actions: {
    methodName: string;
    methodId: string;
    parameters: IJsonSchema;
    actionName: string;
  }[] = [];
  @Input() saveValue: (value) => Promise<void>;
  @Input() deleteValue: () => Promise<void>;
  @Input() runAction: (
    method: {
      methodName: string;
      methodId: string;
      parameters: IJsonSchema;
      actionName: string;
    },
    args
  ) => Promise<void>;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild('libEditableForm') libEditableForm: EditableFormDirective;
  @ViewChildren('editionFormQuery')
  editionFormQuery: QueryList<JsonSchemaFormComponent>;

  @ViewChildren('viewFormQuery', { read: ElementRef })
  viewFormQuery: QueryList<ElementRef>;

  @ViewChildren('actionEditableForm')
  actionEditableForm: QueryList<EditableFormDirective>;

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
  public isValid: any;
  private subscriptions: Subscription[] = [];
  public isReady: boolean = false;
  public currentMethod: {
    methodName: string;
    methodId: string;
    parameters: IJsonSchema;
    actionName: string;
  };
  public currentMethodParameters: { [key: string]: any };
  get viewProperties() {
    return this.editionPropertiesCompleted;
  }

  public layoutEdit: IJsonLayout;
  public layoutView: IJsonLayout;
  public error: string;
  public methodError: string;
  public modalRef: BsModalRef;

  public methodLayout: IJsonLayout = [
    {
      key: '*',
    },
    {
      type: 'submit',
      title: 'OK',
      htmlClass: 'd-none',
    },
  ];

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

  protected buildSchemanView() {
    if (this.entity.isNewEntity) {
      this.isInCreation = this.entity.isNewEntity;
    }
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

    this.constructLayout('', this.schema.properties, inputLayoutProperty);
    this.schemaView = _.cloneDeep(this.schema);
    this.schemaEdit = _.cloneDeep(this.schema);

    this.layoutEdit = [
      {
        key: '*',
      },
    ];
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
      this.schemaView.properties[key].htmlClass = 'form-group-plaintext';
    }
    this.layoutView.forEach((property) => {
      if (_.isObject(property) && 'key' in (property as any)) {
        (property as any).readonly = true;
        (property as any).disabled = true;
      }
    });
  }
  async ngOnInit(): Promise<void> {
    // this.buildSchemanView();
    this.editionProperties = this.editionPropertiesCompleted;
    this.changedValue = this.editionPropertiesCompleted;
    this.isReady = true;
  }

  /*
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
  }*/

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.schema) {
      this.buildSchemanView();
    }
    /*
    if (!!this.schemaView?.properties) {
      Object.keys(this.schemaView.properties).forEach((key) => {
        if (
          'object' === this.schemaView.properties[key].type &&
          !this.entity[key]
        ) {
          this.entity[key] = {};
        }
      });
    }*/
  }

  public openModal(template: TemplateRef<any>) {
    this.error = '';
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  protected constructLayout(key: string, properties, inputLayoutProperty) {
    for (const subKey of Object.keys(properties)) {
      // await this.addDynamicOptions(key);
      this.addCustomInput(
        key + subKey,
        properties[subKey],
        inputLayoutProperty
      );
      if (properties[subKey].properties) {
        this.constructLayout(
          key + subKey + '.',
          properties[subKey].properties,
          inputLayoutProperty
        );
      } else if (
        properties[subKey].items &&
        properties[subKey].items.properties
      ) {
        this.constructLayout(
          key + subKey + '[].',
          properties[subKey].items.properties,
          inputLayoutProperty
        );
        inputLayoutProperty[key + subKey].items = Object.keys(
          properties[subKey].items.properties
        ).map((subSubKey) => key + subKey + '[].' + subSubKey);
        inputLayoutProperty[key + subKey].startEmpty = true;
      } else if (
        properties[subKey].items &&
        properties[subKey].items.enum &&
        0 === properties[subKey].items.enum.length
      ) {
        delete properties[subKey];
      } else if (properties[subKey].items) {
        this.addCustomInput(
          key + subKey + '[]', //"/selectedImages/-"
          properties[subKey].items,
          inputLayoutProperty
        );
        inputLayoutProperty[key + subKey].items = [key + subKey + '[]'];
        inputLayoutProperty[key + subKey].startEmpty = true;
      }
    }
  }

  protected addCustomInput(key: string, property, inputLayoutProperty) {
    if (!inputLayoutProperty[key]) {
      inputLayoutProperty[key] = {
        key,
        type:
          'string' === property.type
            ? 'text'
            : 'object' === property.type
            ? 'section'
            : property.type,
      };
    }
    const type =
      property.type +
      '_' +
      (property['x-schema-form'] && property['x-schema-form'].type);
    if (type in CUSTOM_INPUT_PROPERTY) {
      property.type = CUSTOM_INPUT_PROPERTY[type].type;
      if (!property['x-schema-form']) {
        property['x-schema-form'] = {};
      }
      property['x-schema-form'].type =
        CUSTOM_INPUT_PROPERTY[type]['x-schema-form-type'];
      if (CUSTOM_INPUT_PROPERTY[type].properties) {
        property.properties = CUSTOM_INPUT_PROPERTY[type].properties;
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

  switchMode() {
    this.error = '';
    if (this.libEditableForm.isViewMode) {
      this.editionProperties = this.editionPropertiesCompleted;
    }
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
    if (properties) {
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
  }
  public onSubmit(properties) {
    this.onChange(properties);
    this.saveEditMode();
  }

  public openMethod(method: {
    methodName: string;
    methodId: string;
    parameters: IJsonSchema;
    actionName: string;
  }) {
    //    this.libEditableForm.beginAction()
    this.currentMethodParameters = {};
    this.methodError = '';
    this.currentMethod = method;
  }

  public onMethodParametersChange(parameters) {
    this.currentMethodParameters = parameters;
  }
  public onMethodParametersSubmit(parameters) {
    this.onMethodParametersChange(parameters);
    this.runMethod();
  }

  public cancelMethod() {
    this.actionEditableForm.first.cancelEditMode();
    this.methodError = '';
    this.currentMethod = undefined;
  }
  public async runMethod() {
    if (this.runAction) {
      try {
        await this.runAction(this.currentMethod, this.currentMethodParameters);
      } catch (error) {
        this.methodError = error.message ? error.message : 'Unexpected error';
        return;
      }
    }
    this.actionEditableForm.first.saveEditMode();
    this.methodError = '';
    this.currentMethod = undefined;
  }
}
