import {Component} from '@angular/core';
import {Output, Input} from '@angular/core';
import {EventEmitter} from '@angular/core';

import {FormsSelect} from '../../forms-select/forms-select';

@Component({
  selector: '[mail-form]',
  template: require('./mail-form.html'),
  directives: [FormsSelect]
})

export class MailForm {
  @Output() backToMailList = new EventEmitter();
  @Output() sentMsg = new EventEmitter();
  @Input() message: any;
  @Input() component: string;

  sender: string = '';
  subject: string = '';
  body: string = '';

  onToBack(): void {
    this.backToMailList.emit(this.component);
  }

  ngOnInit(): void {
    if (this.message) {
      this.sender = this.message.sender;
      this.subject = 'Re: ' + this.message.subject;

      let span = document.createElement('span');
      span.innerHTML = this.message.body;
      this.body = span.innerText;
    }
  }

  handleSend(): void {
    // call API to send SMS here
    this.sentMsg.emit({ sender: this.sender, body: this.body });
    this.backToMailList.emit(this.component);
  }

  handleSelect(toGroup: any): void {
    this.sender = toGroup;
  }
}
