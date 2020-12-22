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
  ],
  imports: [
    CommonModule,
    FormsModule,
    Bootstrap4FrameworkModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule,
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
  ],
})
export class ObjectsAngularFormsModule {
  construtor() {}
}
