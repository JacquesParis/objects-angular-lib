import { Subscription } from 'rxjs';
import {
  FileRendererComponent,
  FileRendererTester,
} from './file-renderer/file-renderer.component';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
} from '@angular/core';
import { JsonFormsAngularService } from '@jsonforms/angular';
import {
  Actions,
  JsonFormsState,
  JsonSchema,
  UISchemaElement,
} from '@jsonforms/core';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import JsonRefs from 'json-refs';
import AJV from 'ajv';
export const initialState: any = {
  jsonforms: {
    renderers: [
      { tester: FileRendererTester, renderer: FileRendererComponent },
      ...angularMaterialRenderers,
    ],
    cells: [],
  },
};

@Component({
  selector: 'lib-json-form',
  templateUrl: './json-form.component.html',
  styleUrls: ['./json-form.component.scss'],
  providers: [JsonFormsAngularService],
})
export class JsonFormComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @Input() uischema: UISchemaElement;
  @Input() schema: JsonSchema;
  sub: Subscription;
  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter<any>();
  constructor(protected jsonformsService: JsonFormsAngularService) {
    this.jsonformsService.init(initialState.jsonforms);
  }

  async ngOnInit() {
    const schemaResolved = await JsonRefs.resolveRefs(this.schema);

    const ajvalue = new AJV({
      schemaId: 'auto',
      allErrors: true,
      jsonPointers: true,
      errorDataPath: 'property',
    });
    this.jsonformsService.updateCore(
      Actions.init(this.data, schemaResolved.resolved, this.uischema, ajvalue)
    );
    this.sub = this.jsonformsService.$state.subscribe(
      (observer: JsonFormsState) => {
        this.valueChanged.emit(observer.jsonforms.core.data);
      }
    );
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }
}
