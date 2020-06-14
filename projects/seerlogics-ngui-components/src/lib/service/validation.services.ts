import {map} from 'rxjs/operators';


import {Inject, Injectable} from '@angular/core';
import * as JQuery from 'jquery';
import {Observable} from 'rxjs';

import {SUBSCRIBER_TYPES} from '../model/constants';
import {HttpClientHelper} from './httpClient.helper';
import {NotificationService} from './notification.service';
import {HttpResponse} from '@angular/common/http';

// Import RxJs required methods
const $ = JQuery;

// tree shakable service
@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private environment;

  constructor(
    private httpClientHelper: HttpClientHelper,
    private notificationService: NotificationService,
    @Inject('environment') environment
  ) {
    this.environment = environment;
  }

  validateField(validatorName: string, fieldName: string): Observable<any> {
    const url =
      this.environment.VALIDATE_FIELD_URL +
      '/' +
      validatorName +
      '/' +
      fieldName;
    return (
      this.httpClientHelper
        .get(url).pipe(
        // get the response and call .json() to get the JSON data
        map((res: HttpResponse<any>) => res.body()))
    );
  }

  validateAllFields(validatorName: string, serializedForm): Observable<any> {
    return (
      this.httpClientHelper
        .post(
          this.environment.VALIDATE_ALL_FIELD_URL + '/' + validatorName,
          serializedForm
        ).pipe(
        // get the response and call .json() to get the JSON data
        map((res: HttpResponse<any>) => res.body()))
    );
  }

  getValidationRuleMetadata(validatorRule: string): Observable<any> {
    return (
      this.httpClientHelper
        .get(this.environment.VALIDATION_METADATA_URL + '/' + validatorRule).pipe(
        // get the response and call .json() to get the JSON data
        map((res: HttpResponse<any>) => res.body()))
    );
  }

  showValidationErrors(fieldErrors) {
    /**
     * On Save response = {"fieldErrors":[{"fieldId":"firstName","message":"First Name is required"},
     * {"fieldId":"lastName","message":"Last Name is required"},{"fieldId":"address","message":"We need at least one address from you."}]}
     */
    const pageLevelErrors = [];
    for (const error of fieldErrors) {
      const fieldId = error.fieldId;
      const $domElementObj = $('#' + fieldId);
      if ($domElementObj.length === 0) {
        pageLevelErrors.push(error);
        continue;
      }
      const errorMessage = error.message;
      const errorMsgDivId = fieldId + 'ErrorMsg';
      const $errorObject = $('#' + errorMsgDivId);
      if ($errorObject.length === 0) {
        const $errorDiv = $('<div>' + errorMessage + '</div>');
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
