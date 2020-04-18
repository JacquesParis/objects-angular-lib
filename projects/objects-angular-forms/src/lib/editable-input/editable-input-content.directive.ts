import { Directive } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'lib-input-view,lib-input-edit',
})
export class EditableInputContentDirective {
  constructor() {}
}
