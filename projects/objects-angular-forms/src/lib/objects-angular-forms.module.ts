import { WidgetDateTimeComponent } from './widget-date-time/widget-date-time.component';
import { WidgetConditionalTextComponent } from './widget-conditional-text/widget-conditional-text.component';
import { WidgetIconComponent } from './widget-icon/widget-icon.component';
import { WidgetPositionComponent } from './widget-position/widget-position.component';
import { WidgetDateRangeComponent } from './widget-date-range/widget-date-range.component';
import { WidgetTextareaComponent } from './widget-textarea/widget-textarea.component';
import { WidgetCheckboxesComponent } from './widget-checkboxes/widget-checkboxes.component';
import { WidgetObjectComponent } from './widget-object/widget-object.component';
import { WidgetImagesComponent } from './widget-images/widget-images.component';
import { WidgetImageComponent } from './widget-image/widget-image.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditableFormDirective } from './editable-form.directive';
import { EditableInputComponent } from './editable-input/editable-input.component';
import { EditableInputContentDirective } from './editable-input/editable-input-content.directive';
import { CommonModule } from '@angular/common';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { EditableTextareaComponent } from './editable-textarea/editable-textarea.component';
import { EditableJsonSchemaFormComponent } from './editable-json-schema-form/editable-json-schema-form.component';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';
import { EditableFileComponent } from './editable-file/editable-file.component';
import { WidgetFileComponent } from './widget-file/widget-file.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
// RECOMMENDED
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  declarations: [
    EditableInputComponent,
    EditableFormDirective,
    EditableInputContentDirective,
    EditableTextComponent,
    EditableTextareaComponent,
    EditableJsonSchemaFormComponent,
    EditableFileComponent,
    WidgetFileComponent,
    WidgetImageComponent,
    WidgetImagesComponent,
    WidgetObjectComponent,
    WidgetCheckboxesComponent,
    WidgetTextareaComponent,
    WidgetDateRangeComponent,
    WidgetPositionComponent,
    WidgetIconComponent,
    WidgetConditionalTextComponent,
    WidgetDateTimeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Bootstrap4FrameworkModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule,
    BsDatepickerModule,
    TimepickerModule,
    CollapseModule,
  ],
  exports: [
    EditableInputComponent,
    EditableFormDirective,
    EditableInputContentDirective,
    EditableTextComponent,
    EditableTextareaComponent,
    EditableJsonSchemaFormComponent,
    EditableFileComponent,
    WidgetFileComponent,
    WidgetImageComponent,
    WidgetImagesComponent,
    WidgetObjectComponent,
    WidgetCheckboxesComponent,
    WidgetTextareaComponent,
    WidgetDateRangeComponent,
    WidgetPositionComponent,
    WidgetIconComponent,
    WidgetConditionalTextComponent,
    WidgetDateTimeComponent,
  ],
  entryComponents: [EditableJsonSchemaFormComponent],
})
export class ObjectsAngularFormsModule {
  constructor() {}
}
