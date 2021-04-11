import { WidgetConditionalTextComponent } from './widget-conditional-text/widget-conditional-text.component';
import { WidgetIconComponent } from './widget-icon/widget-icon.component';
import { WidgetPositionComponent } from './widget-position/widget-position.component';
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

export interface IWaitingStateService {
  initAction(id: string): void;
  endAction(id: string): void;
}
@Injectable({
  providedIn: 'root',
})
export class EditableFormService implements IWaitingStateService {
  private waitingStateService: IWaitingStateService;
  // tslint:disable-next-line: variable-name
  protected _runningEditionForm: string = undefined;
  widgetValues: { [id: string]: any } = {};
  get hasARunningEdition(): boolean {
    return undefined !== this._runningEditionForm;
  }

  public registerWaitingStateService(
    waitingStateService: IWaitingStateService
  ) {
    this.waitingStateService = waitingStateService;
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
    widgetLibrary.registerWidget('position', WidgetPositionComponent);
    widgetLibrary.registerWidget('icon', WidgetIconComponent);
    widgetLibrary.registerWidget(
      'conditional-text',
      WidgetConditionalTextComponent
    );
    widgetLibrary.registerWidget(
      'conditional-date-range',
      WidgetDateRangeComponent
    );
    //  widgetLibrary.registerWidget('array', WidgetArrayComponent);
    // widgetLibrary.registerWidget('object', WidgetObjectComponent);
  }
  initAction(id: string): void {
    if (this.waitingStateService) {
      this.waitingStateService.initAction(id);
    }
  }
  endAction(id: string): void {
    if (this.waitingStateService) {
      this.waitingStateService.endAction(id);
    }
  }
}
