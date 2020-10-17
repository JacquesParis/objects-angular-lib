import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditableFormDirective } from './editable-form.directive';
import { EditableInputComponent } from './editable-input/editable-input.component';
import { EditableInputContentDirective } from './editable-input/editable-input-content.directive';
import { CommonModule } from '@angular/common';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { EditableTextareaComponent } from './editable-textarea/editable-textarea.component';
import { EditableJsonSchemaFormComponent } from './editable-json-schema-form/editable-json-schema-form.component';
import { Bootstrap4FrameworkModule } from 'angular6-json-schema-form';

@NgModule({
  declarations: [
    EditableInputComponent,
    EditableFormDirective,
    EditableInputContentDirective,
    EditableTextComponent,
    EditableTextareaComponent,
    EditableJsonSchemaFormComponent,
  ],
  imports: [CommonModule, FormsModule, Bootstrap4FrameworkModule],
  exports: [
    EditableInputComponent,
    EditableFormDirective,
    EditableInputContentDirective,
    EditableTextComponent,
    EditableTextareaComponent,
    EditableJsonSchemaFormComponent,
  ],
})
export class ObjectsAngularFormsModule {}
