import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ConfigService } from '../config';

@Injectable()
export class MailService {
    private baseUrl: string;
    private config: any;

    constructor(private http : Http, private conf : ConfigService) {
      this.config = conf.getConfig();
      this.baseUrl = this.config.baseUrl;
    }

    sendMail(body: Object): Observable {

    }
}
