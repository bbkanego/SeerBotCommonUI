import {catchError, finalize, tap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Observable, throwError as _throw} from 'rxjs';

import {SUBSCRIBER_TYPES} from '../model/constants';
import {NotificationService} from './notification.service';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
// http://stackoverflow.com/questions/34464108/angular2-set-headers-for-every-request/34465070#34465070
// https://github.com/ivanderbu2/angular-redux/blob/master/src/app/core/http.service.ts

export interface IntputHeader {
  name: string;
  value: string;
}

// tree shakable service
@Injectable({
  providedIn: 'root'
})
/**
 * This is a helper which abstracts the HTTP POST and get and adds additional headers to the each request.
 */
export class HttpClientHelper {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
  }

  get(url): Observable<HttpResponse<any>> {
    this.showLoader();

    return this.http
      .get(url, {
        observe: 'response'
      }).pipe(
        catchError(err => {
          return this.handleError(err);
        }),
        tap(
          (response: HttpResponse<Object>) => {
            return this.onSuccess(response);
          },
          (error: HttpResponse<Object>) => {
            this.onError(error);
          }
        ),
        finalize(() => {
          this.onEnd();
        }),);
  }

  post(
    url,
    serializedData,
    inputHeaders?: IntputHeader[]
  ): Observable<HttpResponse<any>> {
    this.showLoader();
    let headers: HttpHeaders = new HttpHeaders();
    if (inputHeaders) {
      inputHeaders.forEach(header => {
        headers = headers.set(header.name, header.value);
      });
    }
    const requestOptions = {
      headers: headers,
      withCredentials: true,
      observe: 'response' as 'body'
    };
    return this.http
      .post(url, serializedData, requestOptions).pipe(
        catchError(err => {
          return this.handleError(err);
        }),
        tap(
          (response: HttpResponse<Object>) => {
            return this.onSuccess(response);
          },
          (error: HttpResponse<Object>) => {
            this.onError(error);
          }
        ),
        finalize(() => {
          this.onEnd();
        }),);
  }

  put(url, serializedData): Observable<HttpResponse<any>> {
    this.showLoader();
    return this.http
      .put(url, serializedData, {
        observe: 'response'
      }).pipe(
        catchError(err => {
          return this.handleError(err);
        }),
        tap(
          (response: HttpResponse<Object>) => {
            return this.onSuccess(response);
          },
          (error: HttpResponse<Object>) => {
            this.onError(error);
          }
        ),
        finalize(() => {
          this.onEnd();
        }),);
  }

  delete(url: string, id: string): Observable<HttpResponse<any>> {
    this.showLoader();
    return this.http
      .delete(url + '/' + id, {
        observe: 'response'
      }).pipe(
        catchError(err => {
          return this.handleError(err);
        }),
        tap(
          (response: HttpResponse<Object>) => {
            return this.onSuccess(response);
          },
          (error: HttpResponse<Object>) => {
            this.onError(error);
          }
        ),
        finalize(() => {
          this.onEnd();
        }),);
  }

  postMultipart(url, formData: FormData): Observable<HttpResponse<any>> {
    this.showLoader();
    return this.http
      .post(url, formData, {}).pipe(
        catchError(err => {
          return this.handleError(err);
        }),
        tap(
          (response: HttpResponse<Object>) => {
            return this.onSuccess(response);
          },
          (error: HttpResponse<Object>) => {
            this.onError(error);
          }
        ),
        finalize(() => {
          this.onEnd();
        }),);
  }

  private handleError(error: Response | any) {
    console.log('Error, status code: ' + error.status);
    if (error.status === 0) {
      console.log('There was a network error. The target server is down!');
      this.notificationService.notifyAny(
        {},
        SUBSCRIBER_TYPES.NETWORK_ERROR,
        SUBSCRIBER_TYPES.NETWORK_ERROR
      );
      return _throw('Network Error occurred');
    }
    const errorResponseBody = JSON.parse(error._body);
    if (error.status === 401) {
      this.notificationService.notifyAny(
        errorResponseBody,
        SUBSCRIBER_TYPES.FORCE_LOGOUT,
        SUBSCRIBER_TYPES.FORCE_LOGOUT
      );
    } else if (error.status === 400) {
      this.notificationService.notifyAny(
        errorResponseBody,
        SUBSCRIBER_TYPES.ERROR_400,
        SUBSCRIBER_TYPES.ERROR_400
      );
    } else if (error.status === 207) {
      this.notificationService.notifyAny(
        errorResponseBody,
        SUBSCRIBER_TYPES.ERROR_207,
        SUBSCRIBER_TYPES.ERROR_207
      );
    } else if (error.status === 500) {
      this.notificationService.notifyAny(
        errorResponseBody,
        SUBSCRIBER_TYPES.ERROR_500,
        SUBSCRIBER_TYPES.ERROR_500
      );
    }
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.status} - ${error.statusText || ''} ${errorResponseBody}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return _throw(errMsg);
  }

  private onSuccess(response: HttpResponse<Object>) {
    console.log('Request successful, status: ' + response.status);
    if (response.status !== 200) {
      return this.handleError(response);
    }
  }

  private onError(res: HttpResponse<Object>): void {
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
