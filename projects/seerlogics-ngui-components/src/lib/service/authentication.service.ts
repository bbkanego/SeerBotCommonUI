import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {NotificationService} from './notification.service';
import {COMMON_CONST, SUBSCRIBER_TYPES} from '../model/constants';
import {Login} from '../model/models';
import {HttpClientHelper} from './httpClient.helper';
import {HttpResponse} from '@angular/common/http';

// tree shakable service
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClientHelper: HttpClientHelper, private notificationService: NotificationService) {

  }

  public static getCurrentUser() {
    return localStorage.getItem(COMMON_CONST.CURRENT_USER);
  }

  /**
   * We are not unsubscribing here since HTTP will clean it self up.
   * https://stackoverflow.com/questions/35042929/do-you-need-to-unsubscribe-from-angular-2-http-calls-to-prevent-memory-leak
   * @param login
   */
  login(login: Login): any {
    return this.httpClientHelper.post(environment.LOGIN_URL, JSON.stringify({'userName': login.username, 'password': login.password}))
    // get the response and call .json() to get the JSON data
    // .map((res:Response) => res.json())
      .subscribe((res: HttpResponse<any>) => {
        // var payload = res.json();
        const authorization = res.headers.get('Authorization');
        console.log('AuthenticationService = ' + authorization);
        if (authorization) {
          localStorage.setItem(COMMON_CONST.CURRENT_USER,
            JSON.stringify({'userName': login.username, 'password': login.password, 'token': authorization}));
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
  }

  isLoggedIn() {
    return AuthenticationService.getCurrentUser() != null;
  }

  logout(): void {
    localStorage.removeItem(COMMON_CONST.CURRENT_USER);
    this.notificationService.notify('Logout was a success', SUBSCRIBER_TYPES.LOGIN_SUCCESS,
      SUBSCRIBER_TYPES.LOGIN_SUCCESS);
  }
}
