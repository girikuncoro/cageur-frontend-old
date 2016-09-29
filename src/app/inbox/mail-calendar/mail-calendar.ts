import {Component} from '@angular/core';
import {Output, Input} from '@angular/core';
import {EventEmitter} from '@angular/core';
import { ExtraCalendar } from '../../extra-calendar/extra-calendar';

@Component({
  selector: '[mail-calendar]',
  template: require('./mail-calendar.html'),
  directives: [ExtraCalendar]
})

export class MailCalendar {
  @Output() backToMailList = new EventEmitter();
  @Input() message: any;

  sender: string = '';
  subject: string = '';
  body: string = 'This is supposed to be a calendar.';

  onToBack(): void {
    this.backToMailList.emit('');
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
}
