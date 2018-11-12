import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Inject, Injectable } from '@angular/core';
import { Response } from '@angular/http';
import * as JQuery from 'jquery';
import { Observable } from 'rxjs/Observable';

import { SUBSCRIBER_TYPES } from '../../common/model/constants';
import { HttpClient } from '../../common/service/httpClient.helper';
import { NotificationService } from '../../common/service/notification.service';

// Import RxJs required methods
const $ = JQuery;

@Injectable()
export class ValidationService {
  private environment;
  constructor(
    private httpClient: HttpClient,
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
      this.httpClient
        .get(url)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }

  validateAllFields(validatorName: string, serializedForm): Observable<any> {
    return (
      this.httpClient
        .post(
          this.environment.VALIDATE_ALL_FIELD_URL + '/' + validatorName,
          serializedForm
        )
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
        .catch((error: any) =>
          Observable.throw(error.json().error || 'Server error')
        )
    );
  }

  getValidationRuleMetadata(validatorRule: string): Observable<any> {
    return (
      this.httpClient
        .get(this.environment.VALIDATION_METADATA_URL + '/' + validatorRule)
        // get the response and call .json() to get the JSON data
        .map((res: Response) => res.json())
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
