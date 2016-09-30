import {Component, ViewEncapsulation} from '@angular/core';
import {Output, Input} from '@angular/core';
import {EventEmitter} from '@angular/core';

declare var jQuery: any;

@Component({
  selector: '[forms-select]',
  template: require('./forms-select.html'),
  encapsulation: ViewEncapsulation.None,
  styles: [require('./forms-select.scss')]
})
export class FormsSelect {
  @Output() toGroup = new EventEmitter();

  ngOnInit(): void {
    jQuery('.select2').select2();
    jQuery('select').on('change', (e) => {
      console.log(e.val);
      this.toGroup.emit(e.val);
    });
  }
}
