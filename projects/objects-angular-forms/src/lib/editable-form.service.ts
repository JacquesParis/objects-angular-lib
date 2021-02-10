import { WidgetDateRangeComponent } from './widget-date-range/widget-date-range.component';
import { WidgetTextareaComponent } from './widget-textarea/widget-textarea.component';
import { WidgetCheckboxesComponent } from './widget-checkboxes/widget-checkboxes.component';
import { WidgetObjectComponent } from './widget-object/widget-object.component';
import { WidgetImagesComponent } from './widget-images/widget-images.component';
import { WidgetImageComponent } from './widget-image/widget-image.component';
import { WidgetFileComponent } from './widget-file/widget-file.component';
import { Injectable } from '@angular/core';
import {
  CheckboxesComponent,
  WidgetLibraryService,
} from 'angular6-json-schema-form';
import * as _ from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class EditableFormService {
  // tslint:disable-next-line: variable-name
  protected _runningEditionForm: string = undefined;
  widgetValues: { [id: string]: any } = {};
  get hasARunningEdition(): boolean {
    return undefined !== this._runningEditionForm;
  }

  public registerFormInEdition(formId: string) {
    this._runningEditionForm = formId;
  }
  public unregisterFormInEdition(formId: string) {
    if (this._runningEditionForm === formId) {
      this._runningEditionForm = undefined;
    }
  }

  constructor(private widgetLibrary: WidgetLibraryService) {
    widgetLibrary.registerWidget('file-url', WidgetFileComponent);
    widgetLibrary.registerWidget('file', WidgetFileComponent);
    widgetLibrary.registerWidget('image', WidgetImageComponent);
    widgetLibrary.registerWidget('images', WidgetImagesComponent);
    widgetLibrary.registerWidget('json', WidgetObjectComponent);

    widgetLibrary.registerWidget('checkboxes', WidgetCheckboxesComponent);
    widgetLibrary.registerWidget('textarea', WidgetTextareaComponent);
    widgetLibrary.registerWidget('date-range', WidgetDateRangeComponent);
    //  widgetLibrary.registerWidget('array', WidgetArrayComponent);
    // widgetLibrary.registerWidget('object', WidgetObjectComponent);
  }

  public registerWidgetValue(value: any) {
    const id = 'widget$$' + Math.ceil(Math.random() * 1000000000000000);
    this.widgetValues[id] = value;
    return id;
  }
  public updateWidgetValues(value: any) {
    if (_.isArray(value)) {
      value.forEach((element) => {
        this.updateWidgetValues(element);
      });
    } else if (_.isObject(value)) {
      for (const key in value) {
        if (value[key] in this.widgetValues) {
          value[key] = this.widgetValues[value[key]];
        } else {
          this.updateWidgetValues(value[key]);
        }
      }
    }
  }
}
