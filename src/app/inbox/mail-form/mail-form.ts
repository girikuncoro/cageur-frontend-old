import {Component} from '@angular/core';
import {Output, Input} from '@angular/core';
import {EventEmitter} from '@angular/core';

import {FormsSelect} from '../../forms-select/forms-select';
import { MailService } from '../services/mail.service';
import { Observable } from 'rxjs/Rx';
import { Mail } from '../models/mail';

@Component({
  selector: '[mail-form]',
  template: require('./mail-form.html'),
  directives: [FormsSelect],
  providers: [MailService]
})

export class MailForm {
  constructor(private mailService: MailService) {};

  @Output() backToMailList = new EventEmitter();
  @Output() sentMsg = new EventEmitter();
  @Output() validationError = new EventEmitter();
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
    if (this.sender === '') {
      this.validationError.emit('Group cannot be empty');
      return;
    }
    if (this.body === '') {
      this.validationError.emit('Message cannot be empty');
      return;
    }

    let mailOps: Observable<Mail[]>;
    mailOps = this.mailService.sendMail({ group: this.sender, message: this.body });
    mailOps.subscribe(
      mails => {
        console.log(mails);
        this.sentMsg.emit({ sender: this.sender, body: this.body });
        this.backToMailList.emit(this.component);
      },
      err => {
        console.error(err);
        this.validationError.emit(err);
      }
    )
  }

  handleSelect(toGroup: any): void {
    this.sender = toGroup;
  }
}
