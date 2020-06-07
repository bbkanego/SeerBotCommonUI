import {map} from 'rxjs/operators';


import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClientHelper} from './httpClient.helper';
import {HttpResponse} from '@angular/common/http';

// Import RxJs required methods
@Injectable()
export class CommonService {
  messages: {} = null;
  cmsContent: {} = null;
  private environment;

  constructor(private httpClientHelper: HttpClientHelper, @Inject('environment') environment) {
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
      this.httpClientHelper
        .get(endPointUrl).pipe(
        // get the response and call .body() to get the JSON data and then return an observable...
        map((res: HttpResponse<any>) => res.body()))
    );
  }
}
