import { FileRendererComponent } from './json-form/file-renderer/file-renderer.component';
import { JsonFormComponent } from './json-form/json-form.component';
import { NgModule, ModuleWithProviders } from '@angular/core';
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
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '@jsonforms/angular-material';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    JsonFormComponent,
    FileRendererComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Bootstrap4FrameworkModule,
    ReactiveFormsModule,
    NgxBootstrapIconsModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule,
    MatFormFieldModule,
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
    JsonFormComponent,
  ],
})
export class ObjectsAngularFormsModule {
  construtor() {}
}
