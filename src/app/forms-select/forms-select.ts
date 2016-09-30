import {Component, ViewEncapsulation} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[forms-select]',
  template: require('./forms-select.html'),
  encapsulation: ViewEncapsulation.None,
  styles: [require('./forms-select.scss')]
})
export class FormsSelect {
  ngOnInit(): void {
    jQuery('.select2').select2();
  }
}
