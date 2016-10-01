import {Component, ElementRef, OnInit} from '@angular/core';
import {MailList} from './mail-list/mail-list';
import {MailForm} from './mail-form/mail-form';
import {MailDetail} from './mail-detail/mail-detail';
import {MailCalendar} from './mail-calendar/mail-calendar';

declare var jQuery: any;

@Component({
  selector: 'inbox',
  template: require('./inbox.html'),
  directives: [MailList, MailForm, MailDetail, MailCalendar],
  styles: [require('./inbox.scss')]
})

export class Inbox implements OnInit {
  alertShow: boolean = true;
  alertDanger: boolean = false;

  mailListShow: boolean = true;
  mailFormShow: boolean = false;
  mailDetailShow: boolean = false;
  mailCalendarShow: boolean = false;
  currentMail: any;
  currentFolderName: string = 'Sent Mail';
  prevComponent: string = 'mailList';
  $el: any;
  repliedMessage: any;
  sentMessage: any;

  constructor(el: ElementRef) {
    this.$el = jQuery(el.nativeElement);

    this.initMailboxAppDemo(this.$el);
  }

  handleComposeBtn(event): void {
    this.repliedMessage = event || undefined;
    this.changeEmailComponents('mailForm');
  }

  handleMailListBtn(event): void {
    this.changeEmailComponents('mailList');
  }

  handleCalendarBtn(event): void {
    this.changeEmailComponents('mailCalendar');
  }

  handleBackBtn(event): void {
    this.changeEmailComponents(event);
  }

  handleError(event): void {
    console.log('Error', event);
    this.alertShow = true;
    this.alertDanger = true;
  }

  handleSentMsg(event): void {
    console.log('Sent Msg', event);
    this.sentMessage = event;
    this.alertShow = true;
    this.alertDanger = false;
  }

  onReplyMail(mail: any): void {
    this.currentMail = mail;
    this.changeEmailComponents('mailDetail');
  }

  hideAlert(): void {
    this.alertShow = false;
  }

  changeEmailComponents(componentName: string): void {
    let mailState = {
      'mailList': (that): void => {
        that.mailFormShow = that.mailDetailShow = false;
        that.mailListShow = true;
        that.mailCalendarShow = false;
        that.prevComponent = componentName;
      },

      'mailForm': (that): void => {
        that.mailListShow = that.mailDetailShow = false;
        that.mailFormShow = true;
        that.mailCalendarShow = false;
      },

      'mailDetail': (that): void => {
        that.mailListShow = that.mailFormShow = false;
        that.mailDetailShow = true;
        that.mailCalendarShow = false;
      },

      'mailCalendar': (that): void => {
        that.mailListShow = that.mailDetailShow = false;
        that.mailFormShow = false;
        that.mailCalendarShow = true;
        that.prevComponent = componentName;
      },
    };

    mailState[componentName](this);
  }

  setFolderName(folderName: string): void {
    this.currentFolderName = folderName;
  }

  initMailboxAppDemo($el: any): void {
    let showAlert = function(): void {
      $el.find('#app-alert')
        .removeClass('hide')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(): void {
          jQuery(this).removeClass('animated bounceInLeft');
        });
    };

    setTimeout(() => showAlert(), 3000);
  }

  changeActiveItem(): void {
    this.$el.find('.nav a').on('click', function(): void {
      jQuery('.nav').find('.active').removeClass('active');
      jQuery(this).parent().addClass('active');
    });
  }

  ngOnInit(): void {
    this.changeActiveItem();
  }
}
