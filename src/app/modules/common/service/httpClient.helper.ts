// http://stackoverflow.com/questions/34464108/angular2-set-headers-for-every-request/34465070#34465070
// https://github.com/ivanderbu2/angular-redux/blob/master/src/app/core/http.service.ts
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';

import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SUBSCRIBER_TYPES } from '../../common/model/constants';
import { NotificationService } from '../../common/service/notification.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
/**
 * This is a helper which abstracts the HTTP POST and get and adds additional headers to the each request.
 */
export class HttpClient {
  private timeoutObj;

  constructor(
    private http: Http,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) {}

  // tslint:disable-next-line:member-ordering
  static createAuthorizationHeader(
    authenticationService: AuthenticationService,
    headers: Headers
  ) {
    const currentUser = JSON.parse(authenticationService.getCurrentUser());
    if (currentUser && currentUser.token) {
      /*headers.append('Authorization', 'Basic ' +
          // The btoa() method encodes a string in base-64.
        btoa('username:password'));*/
      headers.append('Authorization', 'Bearer ' + currentUser.token);
    }
  }

  // tslint:disable-next-line:member-ordering
  static setCommonHeaders(headers: Headers) {
    headers.append('Content-Type', 'application/json');
  }

  private handleError(error: Response | any) {
    console.log('Error, status code: ' + error.status);
    if (error.status === 401) {
      this.notificationService.notifyAny(
        error,
        SUBSCRIBER_TYPES.FORCE_LOGOUT,
        SUBSCRIBER_TYPES.FORCE_LOGOUT
      );
    } else if (error.status === 400) {
      this.notificationService.notifyAny(
        error.json(),
        SUBSCRIBER_TYPES.ERROR_400,
        SUBSCRIBER_TYPES.ERROR_400
      );
    } else if (error.status === 207) {
      this.notificationService.notifyAny(
        error.json(),
        SUBSCRIBER_TYPES.ERROR_207,
        SUBSCRIBER_TYPES.ERROR_207
      );
    } else if (error.status === 500) {
      this.notificationService.notifyAny(
        error.json(),
        SUBSCRIBER_TYPES.ERROR_500,
        SUBSCRIBER_TYPES.ERROR_500
      );
    }
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.notificationService.notify(
      error,
      SUBSCRIBER_TYPES.NETWORK_ERROR,
      SUBSCRIBER_TYPES.NETWORK_ERROR
    );
    return Observable.throw(errMsg);
  }

  get(url): Observable<Response> {
    this.showLoader();

    const headers = new Headers();
    HttpClient.setCommonHeaders(headers);
    HttpClient.createAuthorizationHeader(this.authenticationService, headers);
    return this.http
      .get(url, {
        headers: headers
      })
      .catch(err => {
        return this.handleError(err);
      })
      .do(
        (response: Response) => {
          return this.onSuccess(response);
        },
        (error: any) => {
          this.onError(error);
        }
      )
      .finally(() => {
        this.onEnd();
      });
  }

  post(url, serializedData): Observable<Response> {
    this.showLoader();
    const headers = new Headers();
    HttpClient.setCommonHeaders(headers);
    HttpClient.createAuthorizationHeader(this.authenticationService, headers);
    return this.http
      .post(url, serializedData, {
        headers: headers
      })
      .catch(err => {
        return this.handleError(err);
      })
      .do(
        (res: Response) => {
          this.onSuccess(res);
        },
        (error: any) => {
          this.onError(error);
        }
      )
      .finally(() => {
        this.onEnd();
      });
  }

  put(url, serializedData): Observable<Response> {
    this.showLoader();
    const headers = new Headers();
    HttpClient.setCommonHeaders(headers);
    HttpClient.createAuthorizationHeader(this.authenticationService, headers);
    return this.http
      .put(url, serializedData, {
        headers: headers
      })
      .catch(err => {
        return this.handleError(err);
      })
      .do(
        (res: Response) => {
          this.onSuccess(res);
        },
        (error: any) => {
          this.onError(error);
        }
      )
      .finally(() => {
        this.onEnd();
      });
  }

  delete(url: string, id: string): Observable<Response> {
    this.showLoader();
    const headers = new Headers();
    HttpClient.setCommonHeaders(headers);
    HttpClient.createAuthorizationHeader(this.authenticationService, headers);
    return this.http
      .delete(url + '/' + id, {
        headers: headers
      })
      .catch(err => {
        return this.handleError(err);
      })
      .do(
        (res: Response) => {
          this.onSuccess(res);
        },
        (error: any) => {
          this.onError(error);
        }
      )
      .finally(() => {
        this.onEnd();
      });
  }

  postMultipart(url, formData: FormData) {
    this.showLoader();
    const headers = new Headers();
    // do not set the content type. the browser will set that. if you set content type manually u will get error.
    HttpClient.createAuthorizationHeader(this.authenticationService, headers);
    return this.http
      .post(url, formData, {
        headers: headers
      })
      .catch(err => {
        return this.handleError(err);
      })
      .do(
        (res: Response) => {
          this.onSuccess(res);
        },
        (error: any) => {
          this.onError(error);
        }
      )
      .finally(() => {
        this.onEnd();
      });
  }

  private onSuccess(response: Response) {
    console.log('Request successful, status: ' + response.status);
    if (response.status !== 200) {
      return this.handleError(response);
    }
  }

  private onError(res: Response): void {
    console.log('Error, status code: ' + res.status);
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.notificationService.notifyAny(
      true,
      SUBSCRIBER_TYPES.TOGGLE_LOADER,
      SUBSCRIBER_TYPES.TOGGLE_LOADER
    );
  }

  private hideLoader(): void {
    // clearTimeout(this.timeoutObj);

    this.notificationService.notifyAny(
      false,
      SUBSCRIBER_TYPES.TOGGLE_LOADER,
      SUBSCRIBER_TYPES.TOGGLE_LOADER
    );
  }
}
