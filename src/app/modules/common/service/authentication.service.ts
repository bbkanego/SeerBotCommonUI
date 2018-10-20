import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Headers, Http, Response } from '@angular/http';
import { NotificationService } from '../../common/service/notification.service';
import { SUBSCRIBER_TYPES, COMMON_CONST } from '../../common/model/constants';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http, private notificationService: NotificationService) {

  }

  /**
   * We are not unsubscribing here since HTTP will clean it self up.
   * https://stackoverflow.com/questions/35042929/do-you-need-to-unsubscribe-from-angular-2-http-calls-to-prevent-memory-leak
   * @param user
   */
  login(user): any {
    return this.http.post(environment.LOGIN_URL, JSON.stringify({ 'userName': user.username, 'password': user.password }))
      // get the response and call .json() to get the JSON data
      // .map((res:Response) => res.json())
      .subscribe((res: Response) => {
        // var payload = res.json();
        const authorization = res.headers.get('Authorization');
        console.log('AuthenticationService = ' + authorization);
        if (authorization) {
          localStorage.setItem(COMMON_CONST.CURRENT_USER,
            JSON.stringify({ 'userName': user.username, 'password': user.password, 'token': authorization }));
          this.notificationService.notify('Login was a success', SUBSCRIBER_TYPES.LOGIN_SUCCESS,
            SUBSCRIBER_TYPES.LOGIN_SUCCESS);
        }
        const contentType = res.headers.get('Content-Type');
        console.log(contentType, authorization);
      }, err => {
        console.log(err);
        if (err.status === 401) {
          this.notificationService.notify('Login was NOT a success', SUBSCRIBER_TYPES.LOGIN_FAILED,
            SUBSCRIBER_TYPES.LOGIN_FAILED);
        }
      });
    // ...errors if any
    // .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  isLoggedIn() {
    return this.getCurrentUser() != null;
  }

  logout(): void {
    localStorage.removeItem(COMMON_CONST.CURRENT_USER)
    this.notificationService.notify('Logout was a success', SUBSCRIBER_TYPES.LOGIN_SUCCESS,
      SUBSCRIBER_TYPES.LOGIN_SUCCESS);
  }

  getCurrentUser() {
    return localStorage.getItem(COMMON_CONST.CURRENT_USER);
  }
}
