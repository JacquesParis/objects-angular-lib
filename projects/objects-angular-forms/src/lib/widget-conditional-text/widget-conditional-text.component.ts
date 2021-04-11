import {
  InputComponent,
  JsonSchemaFormService,
} from 'angular6-json-schema-form';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { set } from 'lodash-es';

@Component({
  selector: 'app-widget-conditional-text',
  templateUrl: './widget-conditional-text.component.html',
  styleUrls: ['./widget-conditional-text.component.scss'],
})
export class WidgetConditionalTextComponent
  extends InputComponent
  implements OnInit, OnDestroy {
  public displayed: boolean = false;
  conditionalValue: {
    title: string;
    defaultValue: string;
    dependentValuesReset?: { [valuePath: string]: any };
  };
  default: Function;
  public title: string;

  constructor(private jsonSchemaFormService: JsonSchemaFormService) {
    super(jsonSchemaFormService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.conditionalValue = this.options.conditionalValue;
    this.displayed = !!this.controlValue;

    this.default = new Function('model', this.conditionalValue.defaultValue);
    this.title = this.jsonSchemaFormService.layout.find(
      (l) => l._id === this.layoutNode._id
    ).options.title;
  }
  ngOnDestroy() {}
  public updateValue(event: { target: { value: string } }): void {
    super.updateValue(event);
  }
  public onDisplayChange(): void {
    if (this.displayed) {
      const value: string = this.default(this.jsonSchemaFormService.data);
      this.updateValue({ target: { value: value } });
    } else {
      this.updateValue({ target: { value: '' } });
      if (this.conditionalValue.dependentValuesReset) {
        for (const valuePath of Object.keys(
          this.conditionalValue.dependentValuesReset
        )) {
          this.jsonSchemaFormService.data.locationPosition = '';
          set(
            this.jsonSchemaFormService.data,
            valuePath,
            this.conditionalValue.dependentValuesReset[valuePath]
          );
        }
      }
    }
  }
}
