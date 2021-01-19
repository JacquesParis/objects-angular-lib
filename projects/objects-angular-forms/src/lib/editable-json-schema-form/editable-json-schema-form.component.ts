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
import { FormGroup, AbstractControl } from '@angular/forms';
import {
  IJsonSchema,
  IJsonLayout,
  IJsonLayoutProperty,
} from '../editable-abstract/i-json-schema';
import { EditableFormDirective } from '../editable-form.directive';
import * as _ from 'lodash-es';
import { QueryList, EventEmitter, OnDestroy } from '@angular/core';
import { JsonSchemaFormComponent } from 'angular6-json-schema-form';
import { EditableFormService } from '../editable-form.service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'lib-editable-json-schema-form',
  templateUrl: './editable-json-schema-form.component.html',
  styleUrls: ['./editable-json-schema-form.component.scss'],
})
export class EditableJsonSchemaFormComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() inputClass: string = 'form-control-sm';
  @Input() inputReadClass: string = 'form-control-plaintext';
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
  @Input() crud: { delete: boolean; update: boolean } = {
    delete: true,
    update: true,
  };
  @Input() saveValue: (value) => Promise<void>;
  @Input() deleteValue: () => Promise<void>;
  @Input() runAction: (methodId: string, args) => Promise<void>;
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
  public viewProperties: any = {};
  public schemaEdit: IJsonSchema;
  protected _changedValue: any;
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

    type JsonLayoutProperties = {
      [key: string]: IJsonLayoutProperty;
    };

    const inputLayoutProperty: JsonLayoutProperties = {};
    this.layout.forEach((property) => {
      inputLayoutProperty[property.key] = property;
    });

    this.layoutEdit = [];

    this.schemaView = _.cloneDeep(this.schema);
    this.transformJsonSchema(this.schemaView);
    this.schemaEdit = _.cloneDeep(this.schemaView);

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
      htmlClass: 'd-none',
    });
    this.layoutEdit.push({
      type: 'submit',
      title: 'OK',
      htmlClass: 'd-none',
    });

    this.makeViewReadOnly(this.schemaView);
    this.layoutView.forEach((property) => {
      if (_.isObject(property) && 'key' in (property as any)) {
        (property as any).readonly = true;
        (property as any).disabled = true;
      }
    });
  }
  async ngOnInit(): Promise<void> {
    this.initSchema();
  }

  private initSchema() {
    this.isReady = false;
    this.buildSchemanView();
    this.viewProperties = this.editionPropertiesCompleted;
    this.editionProperties = this.editionPropertiesCompleted;
    this.changedValue = this.editionPropertiesCompleted;
    window.setTimeout(() => {
      this.isReady = true;
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.isReady) {
      this.initSchema();
    }
  }

  public openModal(template: TemplateRef<any>) {
    this.error = '';
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  ngAfterViewInit(): void {
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

  protected forceReadOnlyView() {
    if (this.viewFormQuery.first) {
      this.viewFormQuery.first.nativeElement
        .querySelectorAll('input')
        .forEach((input) => {
          input.disabled = true;
        });
    }
  }

  transformJsonSchema(schema: IJsonSchema) {
    if (!schema['x-schema-form']) {
      schema['x-schema-form'] = {};
    }
    if (this.inputClass) {
      schema['x-schema-form'].fieldHtmlClass =
        (schema['x-schema-form'].fieldHtmlClass
          ? schema['x-schema-form'].fieldHtmlClass + ' '
          : '') + this.inputClass;
    }
    if (
      'json' === schema['x-schema-form-type'] ||
      (schema['x-schema-form'] && 'json' === schema['x-schema-form'].type)
    ) {
      schema.type = 'string';
    } else if (schema.properties) {
      for (const propertyKey of Object.keys(schema.properties)) {
        this.transformJsonSchema(schema.properties[propertyKey]);
      }
    } else if (schema.items) {
      this.transformJsonSchema(schema.items);
    }
  }

  makeViewReadOnly(schema) {
    schema.readonly = true;
    schema.readOnly = true;
    schema.disabled = true;
    schema.htmlClass = 'form-group-plaintext';

    if (!schema['x-schema-form']) {
      schema['x-schema-form'] = {};
    }
    if (this.inputReadClass) {
      schema['x-schema-form'].fieldHtmlClass =
        (schema['x-schema-form'].fieldHtmlClass
          ? schema['x-schema-form'].fieldHtmlClass + ' '
          : '') + this.inputReadClass;
    }
    if (schema.properties) {
      for (const propertyKey of Object.keys(schema.properties)) {
        this.makeViewReadOnly(schema.properties[propertyKey]);
      }
    } else if (schema.items) {
      this.makeViewReadOnly(schema.items);
    }
  }
  private _editionPropertiesCompleted(
    value,
    schema,
    jsonTransfrom: (value: any) => any
  ) {
    if (undefined === value || null === value) {
      return value;
    }
    if (
      (_.isString(value) && 'json' === schema['x-schema-form-type']) ||
      (schema['x-schema-form'] && 'json' === schema['x-schema-form'].type)
    ) {
      try {
        return jsonTransfrom(value);
      } catch (error) {
        return '';
      }
    } else if (!_.isObject(value)) {
      return value;
    } else if (schema.properties) {
      for (const propertyKey of Object.keys(schema.properties)) {
        if (undefined !== value[propertyKey]) {
          value[propertyKey] = this._editionPropertiesCompleted(
            value[propertyKey],
            schema.properties[propertyKey],
            jsonTransfrom
          );
        }
      }
    } else if (schema.items && _.isArray(value) && 0 < value.length) {
      for (let index = 0; index < value.length; index++) {
        value[index] = this._editionPropertiesCompleted(
          value[index],
          schema.items,
          jsonTransfrom
        );
      }
    }
    return value;
  }

  get editionPropertiesCompleted(): any {
    let editionProperties = this.entity.editionProperties;
    editionProperties = this._editionPropertiesCompleted(
      editionProperties,
      this.schemaView,
      (value) => JSON.stringify(value, undefined, 2)
    );
    return editionProperties;
  }

  protected get changedValue(): any {
    let changedValue = _.clone(this._changedValue);

    changedValue = this._editionPropertiesCompleted(
      changedValue,
      this.schemaView,
      JSON.parse
    );
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
      this.viewProperties = this.editionPropertiesCompleted;
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
        await this.runAction(
          this.currentMethod.methodId,
          this.currentMethodParameters
        );
      } catch (error) {
        this.methodError = error.message ? error.message : 'Unexpected error';
        return;
      }
    }
    this.methodError = '';
    this.currentMethod = undefined;
  }
}
