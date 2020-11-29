import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'app-json-schema-formly',
  templateUrl: './json-schema-formly.component.html',
  styleUrls: ['./json-schema-formly.component.scss'],
})
export class JsonSchemaFormlyComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() model: any;
  @Input() schema: any;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChanges: EventEmitter<any> = new EventEmitter<any>();
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[] = [];
  sub: Subscription;
  constructor(private formlyJsonschema: FormlyJsonschema) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
    this.sub = this.form.valueChanges.subscribe((values) => {
      console.log(values);
      this.onChanges.emit(values);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSubmitFrom() {
    this.onSubmit.emit(this.model);
  }
}
