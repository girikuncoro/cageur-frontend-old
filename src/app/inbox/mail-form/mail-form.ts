import {Component, ViewEncapsulation} from '@angular/core';
import {Output, Input} from '@angular/core';
import {EventEmitter} from '@angular/core';

import {FormsSelect} from '../../forms-select/forms-select';
import { MailService } from '../services/mail.service';
import { Observable } from 'rxjs/Rx';
import { Mail } from '../models/mail';

import { NKDatetime } from 'ng2-datetime/ng2-datetime';
import { Widget } from '../../core/widget/widget';
import {HolderJs} from '../../components/holderjs/holderjs';
import {DropzoneDemo} from '../../components/dropzone/dropzone';
import {Autosize} from 'angular2-autosize/angular2-autosize';
import {AlertComponent} from 'ng2-bootstrap/components/alert';
declare var jQuery: any;

@Component({
  selector: '[mail-form]',
  template: require('./mail-form.html'),
  directives: [FormsSelect, Widget, DropzoneDemo, HolderJs, NKDatetime, Autosize, AlertComponent],
  providers: [MailService],
  encapsulation: ViewEncapsulation.None,
  styles: [require('../../forms-elements/forms-elements.scss')]
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

  scheduled: boolean = false;
  date: string;
  period: string = 'once';

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
    jQuery('.selectpicker').selectpicker();
  }

  sendMessage(object: any, schedule: boolean): void {
    // call API to send SMS here
    let mailOps: Observable<Mail[]>;
    if (schedule) {
      mailOps = this.mailService.scheduleMail(object);
    } else {
      mailOps = this.mailService.sendMail(object);
    }

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

  handleSend(): void {
    // validate in client
    if (this.sender === '') {
      return this.validationError.emit('Group is empty');
    }
    if (this.body === '') {
      return this.validationError.emit('Message is empty');
    }
    this.sendMessage({ group: this.sender, message: this.body }, false);
  }

  handleSelect(toGroup: any): void {
    this.sender = toGroup;
  }

  handleSchedule(): void {
    this.scheduled = !this.scheduled;
  }

  handleSave(): void {
    if (this.sender === '') {
      return this.validationError.emit('Group is empty');
    }
    if (this.body === '') {
      return this.validationError.emit('Message is empty');
    }
    if (this.period === '') {
      return this.validationError.emit('Choose one time, daily or monthly');
    }
    if (!this.date) {
      return this.validationError.emit('Choose date and time for sms schedule');
    }
    const req = {
      message: this.body,
      groupId: this.sender,
      timeSchedules: [Date.parse(this.date)/1000],
      frequency: this.period,
      timeStart: Date.parse(this.date)/1000,
    };
    this.sendMessage(req, true);
  }
}
