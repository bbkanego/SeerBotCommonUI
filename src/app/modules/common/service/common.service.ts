import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {Inject, Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {HttpClient} from './httpClient.helper';
import {CommonModalModel} from '../../../app.component';

// Import RxJs required methods
@Injectable()
export class CommonService {
  messages: {} = null;
  cmsContent: {} = null;
  private environment;

  constructor(private httpClient: HttpClient, @Inject('environment') environment) {
    this.environment = environment;
  }

  /**
   * unsubscribing to observables created by angular's http service is not needed
   * https://stackoverflow.com/questions/40861494/angular2-unsubscribe-from-http-observable-in-service
   */
  getMessages(): void {
    if (this.messages == null) {
      this.getMessagesLocal(this.environment.ALL_MESSAGES_URL).subscribe((incomingMessages: any) => {
        this.messages = incomingMessages;
      });
    }
  }

  getCmsContent(): void {
    if (this.cmsContent == null) {
      this.getMessagesLocal(this.environment.GET_ALL_CMS_CONTENT).subscribe((incomingMessages: any) => {
        this.cmsContent = incomingMessages;
      });
    }
  }

  /**
   */
  private getMessagesLocal(endPointUrl): Observable<any> {
    return (
      this.httpClient
        .get(endPointUrl)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
    );
  }
}
