import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Inject, Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpClient } from './httpClient.helper';

// Import RxJs required methods
@Injectable()
export class CommonService {
  messages: {} = null;
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
      this.getMessagesLocal().subscribe((incomingMessages: any) => {
        this.messages = incomingMessages;
      });
    }
  }

  /**
   */
  private getMessagesLocal(): Observable<any> {
    return (
      this.httpClient
        .get(this.environment.ALL_MESSAGES_URL)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }
}