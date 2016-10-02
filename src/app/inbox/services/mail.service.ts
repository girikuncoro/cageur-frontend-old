import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ConfigService } from '../../core/config';
import { Mail } from '../models/mail';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class MailService {
    private baseUrl: string;
    private mailUrl: string;
    private config: any;

    constructor(private http : Http, private conf : ConfigService) {
      this.config = conf.getConfig();
      this.baseUrl = this.config.baseUrl;
      this.mailUrl = `${this.baseUrl}/api/v1/sms/broadcast/group`;
    }

    sendMail(body: Object): Observable<Mail[]> {
      let bodyString = JSON.stringify(body);
      let options = new RequestOptions({ headers: this.getHeaders() });

      return this.http.post(this.mailUrl, body, options)
        .map((res: Response) => res.json())
        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    private getHeaders() : Headers {
      return new Headers({ 'Content-Type': 'application/json' });
    }
}
