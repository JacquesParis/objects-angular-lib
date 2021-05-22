import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { AbstractControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-widget-date-time',
  templateUrl: './widget-date-time.component.html',
  styleUrls: ['./widget-date-time.component.scss'],
})
export class WidgetDateTimeComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  controlDisabled = false;
  boundControl = false;
  options: any;
  autoCompleteList: string[] = [];
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  public conditionalValue: { title: string; defaultValue: string };
  public isConditional: boolean = false;
  public displayed: boolean = true;
  public datepickerModel: Date;
  public mytime: Date;
  private currentValue: string;
  default: Function;

  constructor(
    private jsonSchemaFormService: JsonSchemaFormService,
    private localeService: BsLocaleService
  ) {}

  get timePickerClass() {
    return this.options?.readonly
      ? 'pl-0 ml-0 col-8 col-sm-9 col-md-10 col-lg-10 col-xl-11'
      : 'col-12 pl-sm-0 ml-sm-0 col-sm-6 col-md-7 col-lg-8 col-xl-9';
  }
  get datePickerClass() {
    return this.options?.readonly
      ? 'pr-0 col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 '
      : 'col-12 pr-sm-0 col-sm-6 col-md-5 col-lg-4 col-xl-3';
  }

  ngOnInit() {
    this.options = this.layoutNode.options || {};

    if (-1 < listLocales().indexOf(navigator.language.split('-')[0])) {
      this.localeService.use(navigator.language.split('-')[0]);
    }

    this.jsonSchemaFormService.initializeControl(this);

    if (this.options.conditionalValue) {
      this.conditionalValue = this.options.conditionalValue;
      this.displayed = !!this.controlValue;
      this.isConditional = true;
      if (this.conditionalValue.defaultValue) {
        this.default = new Function(
          'model',
          this.conditionalValue.defaultValue
        );
      }
    }
  }

  ngAfterViewInit() {
    this.currentValue = this.controlValue ? this.controlValue : '';
    if (this.currentValue !== '') {
      try {
        const date = Date.parse(this.currentValue);
        this.datepickerModel = new Date(date);
        this.mytime = new Date(date);
      } catch (error) {
        if (this.options.conditionalValue) {
          this.displayed = false;
        }
      }
    } else {
      this.calculateDefaultValues();
    }
  }

  private calculateDefaultValues() {
    if (this.default) {
      try {
        const date = Date.parse(this.default(this.jsonSchemaFormService.data));
        this.datepickerModel = new Date(date);
        this.mytime = new Date(date);
      } catch (error) {
        this.datepickerModel = new Date();
        this.mytime = new Date();
      }
    } else {
      this.datepickerModel = new Date();
      this.mytime = new Date();
    }
  }

  updateValue(event) {
    let newValue = '';
    if (event && this.displayed) {
      const currentDate = new Date();
      try {
        currentDate.setTime(this.datepickerModel.getTime());
        currentDate.setHours(this.mytime.getHours());
        currentDate.setMinutes(this.mytime.getMinutes());
        currentDate.setSeconds(this.mytime.getSeconds());
        newValue = currentDate.toISOString();
      } catch (error) {}
    }
    if (this.currentValue !== newValue) {
      this.jsonSchemaFormService.updateValue(this, newValue);
      this.currentValue = newValue;
    }
  }

  public onDisplayChange(): void {
    if (!this.displayed) {
      this.updateValue(undefined);
    }
  }
}
