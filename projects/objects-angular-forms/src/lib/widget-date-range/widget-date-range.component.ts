import { AbstractControl } from '@angular/forms';
import {
  InputComponent,
  JsonSchemaFormService,
} from 'angular6-json-schema-form';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import * as moment from 'moment';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';

@Component({
  selector: 'app-widget-date-range',
  templateUrl: './widget-date-range.component.html',
  styleUrls: ['./widget-date-range.component.scss'],
})
export class WidgetDateRangeComponent implements OnInit, AfterViewInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  controlValueText: string = '';
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  currentValue: string;
  bsRangeValue: { 0: Date; 1: Date } = [undefined, undefined];
  constructor(
    private jsf: JsonSchemaFormService,
    private localeService: BsLocaleService
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};

    if (-1 < listLocales().indexOf(navigator.language.split('-')[0])) {
      this.localeService.use(navigator.language.split('-')[0]);
    }

    this.jsf.initializeControl(this);
  }

  ngAfterViewInit() {
    this.currentValue = this.controlValue ? this.controlValue : '';
    const values = this.currentValue.split(' ');
    while (2 > values.length) {
      values.push('');
    }
    if ('' !== values[0] && '' !== values[1]) {
      this.bsRangeValue[0] = moment(values[0], 'YYYY-MM-DD').toDate();
      this.bsRangeValue[1] = moment(values[1], 'YYYY-MM-DD').toDate();
    }
  }

  updateValue(event: { 0: Date; 1: Date }) {
    let newValue;
    if (event[0] && event[1]) {
      newValue =
        moment(event[0]).format('YYYY-MM-DD') +
        ' ' +
        moment(event[1]).format('YYYY-MM-DD');
    } else {
      newValue = '';
    }
    if (this.currentValue !== newValue) {
      this.currentValue = newValue;
      this.jsf.updateValue(this, this.currentValue);
    }
  }
}
