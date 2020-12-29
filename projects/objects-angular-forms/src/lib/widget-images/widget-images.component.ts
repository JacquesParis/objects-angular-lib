import { JsonSchemaFormService } from 'angular6-json-schema-form';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { isArray, cloneDeep } from 'lodash-es';

@Component({
  selector: 'images-widget',
  templateUrl: './widget-images.component.html',
  styleUrls: ['./widget-images.component.scss'],
})
export class WidgetImagesComponent implements OnInit {
  @ViewChild('inputFiles') inputFiles: ElementRef<HTMLInputElement>;
  formControl: FormArray;
  controlName: string;
  controlValue: {
    base64?: string;
    size?: string;
    name?: string;
    type?: string;
    id?: string;
    uri?: string;
  }[];
  controlDisabled = false;
  boundControl = false;
  options: any;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  readonly: boolean;
  itemFormControl: AbstractControl;

  public get imgs(): SafeResourceUrl[] {
    return isArray(this.controlValue)
      ? this.controlValue
          .filter((value) => value.type && value.base64)
          .map((value) =>
            this.sanitization.bypassSecurityTrustResourceUrl(
              'data:' + value.type + ';base64,' + value.base64
            )
          )
      : [];
  }

  constructor(
    private jsf: JsonSchemaFormService,
    private sanitization: DomSanitizer
  ) {}

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.readonly = !!this.options.readonly;
    this.jsf.initializeControl(this);
    this.itemFormControl = cloneDeep(this.formControl.controls[0]);
  }

  async handleFileInput(files: FileList): Promise<void> {
    if (!files || 0 === files.length) {
      return;
    }

    let fileIndex = 0;

    const inputValue = isArray(this.controlValue)
      ? cloneDeep(
          this.controlValue.filter((value) => value.type && value.base64)
        )
      : [];

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      inputValue.push({
        size: files.item(fileIndex).lastModified,
        name: files.item(fileIndex).name,
        type: files.item(fileIndex).type,
        base64: btoa(event.target.result as string),
        id: null,
        uri: null,
      });
      fileIndex++;
      if (fileIndex < files.length) {
        this.controlValue = inputValue;
        reader.readAsBinaryString(files.item(fileIndex));
      } else {
        while (this.formControl.controls.length < inputValue.length) {
          this.formControl.controls.push(cloneDeep(this.itemFormControl));
        }
        while (this.formControl.controls.length > inputValue.length) {
          this.formControl.controls.splice(
            this.formControl.controls.length - 1,
            1
          );
        }
        this.jsf.updateValue(this, inputValue);
      }
    });
    reader.readAsBinaryString(files.item(0));
  }

  public getName(index): string {
    return this.getNameParts(index).name;
  }

  public getNameParts(index): { name: string; extension: string } {
    if (!this.controlValue[index]?.name) {
      return { name: '', extension: '' };
    }
    const nameParts = this.controlValue[index].name.split('.');
    const extension = nameParts.length > 1 ? nameParts.pop() : '';

    return { name: nameParts.join('.'), extension: extension };
  }

  public changeName(index, name) {
    const extension = this.getNameParts(index).extension;
    this.controlValue[index].name =
      name + ('' !== extension ? '.' : '') + extension;
    this.jsf.updateValue(this, this.controlValue);
  }

  remove(index) {
    this.controlValue.splice(index, 1);
    this.formControl.controls.splice(index, 1);
    this.jsf.updateValue(this, this.controlValue);
  }
}
