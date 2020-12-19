import { EditableFormDirective } from '../editable-form.directive';
import { EditableFormService } from '../editable-form.service';
import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'image-widget',
  templateUrl: './widget-image.component.html',
  styleUrls: ['./widget-image.component.scss'],
})
export class WidgetImageComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: {
    base64?: string;
    size?: string;
    name?: string;
    type?: string;
    id?: string;
    uri?: string;
  };
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  readonly: boolean;

  public get img() {
    return this.controlValue?.base64 && this.controlValue?.type
      ? this.sanitization.bypassSecurityTrustResourceUrl(
          'data:' +
            this.controlValue?.type +
            ';base64,' +
            this.controlValue?.base64
        )
      : this.controlValue?.uri;
  }

  public get name() {
    return this.controlValue?.name;
  }
  constructor(
    private jsf: JsonSchemaFormService,
    public editableFormDirective: EditableFormDirective,
    private sanitization: DomSanitizer
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.readonly = !!this.options.readonly;
    this.jsf.initializeControl(this);
  }

  async handleFileInput(files: FileList): Promise<void> {
    if (!files) {
      return;
    }
    const fileInput: File = files.item(0);
    if (!fileInput) {
      return;
    }
    const file = {
      size: fileInput.lastModified,
      name: fileInput.name,
      type: fileInput.type,
      base64: null,
      id: null,
      uri: null,
    };

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      file.base64 = btoa(event.target.result as string);
      this.jsf.updateValue(this, file);
    });
    reader.readAsBinaryString(fileInput);
  }

  remove() {
    const file = {
      size: null,
      name: null,
      type: null,
      base64: null,
      id: null,
      uri: null,
    };
    this.jsf.updateValue(this, file);
  }
}
