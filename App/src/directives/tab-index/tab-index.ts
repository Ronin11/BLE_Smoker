import { Directive } from '@angular/core';

/**
 * Generated class for the TabIndexDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[tab-index]' // Attribute selector
})
export class TabIndexDirective {

  constructor() {
    console.log('Hello TabIndexDirective Directive');
  }

}
