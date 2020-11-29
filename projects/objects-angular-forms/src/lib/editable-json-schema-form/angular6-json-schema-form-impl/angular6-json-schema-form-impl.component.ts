import { IJsonLayoutProperty } from './../../editable-abstract/i-json-schema';
import { Subscription } from 'rxjs';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  AbstractControl,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import {
  Component,
  OnInit,
  forwardRef,
  Input,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
} from '@angular/core';
import { AbstractInputComponent } from '../abstract-input';
import { AbstractJsonSchemaInput } from '../abstract-json-schema-input';

@Component({
  selector: 'app-angular6-json-schema-form-impl',
  templateUrl: './angular6-json-schema-form-impl.component.html',
  styleUrls: ['./angular6-json-schema-form-impl.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Angular6JsonSchemaFormImplComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: Angular6JsonSchemaFormImplComponent,
      multi: true,
    },
  ],
})
export class Angular6JsonSchemaFormImplComponent
  extends AbstractJsonSchemaInput
  implements OnInit, OnDestroy {
  @Input() public layout: IJsonLayoutProperty[] = [];

  @ViewChildren('formQuery', { read: ElementRef })
  formQuery: QueryList<ElementRef>;
  public editionProperties: any;
  protected validators: { [key: string]: ValidatorFn };
  protected propertyAdapters: {
    [property: string]: {
      before: (value: any) => any;
      after: (value: any) => any;
    };
  } = {};
  isValid: any;
  subscriptions: Subscription[] = [];

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

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
    Object.keys(this.schema.properties).forEach((key) => {
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
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return { custom: true };
  }
}
