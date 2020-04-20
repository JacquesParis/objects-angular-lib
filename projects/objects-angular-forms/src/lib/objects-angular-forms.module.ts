import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditableFormDirective } from './editable-form.directive';
import { EditableInputComponent } from './editable-input/editable-input.component';
import { EditableInputContentDirective } from './editable-input/editable-input-content.directive';
import { EditableFormService } from './editable-form.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { EditableTextareaComponent } from './editable-textarea/editable-textarea.component';
import { EditableJsonSchemaFormComponent } from './editable-json-schema-form/editable-json-schema-form.component';
import { EditableJsonSchemaInputComponent } from './editable-json-schema-input/editable-json-schema-input.component';
import { SchemaFormModule } from 'ngx-schema-form';

@NgModule({
  declarations: [
    EditableInputComponent,
    EditableFormDirective,
    EditableInputContentDirective,
    EditableTextComponent,
    EditableTextareaComponent,
    EditableJsonSchemaFormComponent,
    EditableJsonSchemaInputComponent,
  ],
  imports: [BrowserModule, CommonModule, FormsModule, SchemaFormModule],
  exports: [
    EditableInputComponent,
    EditableFormDirective,
    EditableInputContentDirective,
    EditableTextComponent,
    EditableTextareaComponent,
    EditableJsonSchemaFormComponent,
    EditableJsonSchemaInputComponent,
  ],
})
export class ObjectsAngularFormsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ObjectsAngularFormsModule,
      providers: [EditableFormService],
    };
  }
}
