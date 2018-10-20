import { Injectable } from '@angular/core';
import { HttpClient } from '../../common/service/httpClient.helper';
import { environment } from '../environments/environment';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SUBSCRIBER_TYPES } from '../../common/model/constants';
import { NotificationService } from '../../common/service/notification.service';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as JQuery from 'jquery';

const $ = JQuery;

@Injectable()
export class ValidationService {
  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}

  validateField(validatorName: string, fieldName: string): Observable<any> {
    console.log('This is 222222');
    let url =
      environment.VALIDATE_FIELD_URL + '/' + validatorName + '/' + fieldName;
    return (
      this.httpClient
        .get(url)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        //...errors if any
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }

  validateAllFields(validatorName: string, serializedForm): Observable<any> {
    return (
      this.httpClient
        .post(
          environment.VALIDATE_ALL_FIELD_URL + '/' + validatorName,
          serializedForm
        )
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        //...errors if any
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }

  getValidationRuleMetadata(validatorRule: string): Observable<any> {
    return (
      this.httpClient
        .get(environment.VALIDATION_METADATA_URL + '/' + validatorRule)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        //...errors if any
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }

  showValidationErrors(fieldErrors) {
    /**
     * On Save response = {"fieldErrors":[{"fieldId":"firstName","message":"First Name is required"},
     * {"fieldId":"lastName","message":"Last Name is required"},{"fieldId":"address","message":"We need at least one address from you."}]}
     */
    let pageLevelErrors = [];
    for (let error of fieldErrors) {
      let fieldId = error.fieldId;
      let $domElementObj = $('#' + fieldId);
      if ($domElementObj.length == 0) {
        pageLevelErrors.push(error);
        continue;
      }
      let errorMessage = error.message;
      let errorMsgDivId = fieldId + 'ErrorMsg';
      let $errorObject = $('#' + errorMsgDivId);
      if ($errorObject.length == 0) {
        let $errorDiv = $('<div>' + errorMessage + '</div>');
        $errorDiv.attr('id', errorMsgDivId);
        $errorDiv.addClass('alert-danger').addClass('alert');
        $errorDiv.insertAfter($domElementObj);
      } else {
        $errorObject.html(errorMessage);
        $errorObject.show();
      }
    }

    const errors = {
      pageLevelErrors: pageLevelErrors,
      fieldErrors: fieldErrors.length > 0
    };

    this.notificationService.notifyAny(
      errors,
      SUBSCRIBER_TYPES.PAGE_ERROR,
      SUBSCRIBER_TYPES.PAGE_ERROR
    );
  }
}
