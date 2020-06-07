import {AbstractControl, ValidatorFn} from '@angular/forms';
import * as _moment from 'moment';

const moment = _moment;

/**
 * https://alligator.io/angular/reactive-forms-custom-validator/
 */
// @dynamic
export class CustomValidator {

  static validateDateFormat(format: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const isValid = moment(control.value, format.toUpperCase(), true).isValid();
      return isValid ? null : {'invalidDateFormat': true};
    };
  }

  /**
   * https://www.jokecamp.com/blog/angular-whitespace-validator-directive/
   * @param notAllowedValue
   */
  static isSelectValid(notAllowedValue?: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value || control.value.length === 0 || control.value === '_NONE_' || control.value === notAllowedValue) {
        return {required: true};
      }
      return null;
    };
  }

  static hasPunctuation(punctuation: string, errorType: string) {
    return (input: AbstractControl) => {
      return input.value.indexOf(punctuation) >= 0 ?
        null :
        {[errorType]: true};
    };
  }

  static checkAllowedChars(regEx: RegExp) {
    return (input: AbstractControl) => {
      let isMatch = true;
      if (input.value != null && input.value.length > 0) {
        isMatch = regEx.test(input.value);
      }
      return isMatch ? null : {'invalidChars': true};
    };
  }

  static isInteger() {
    return (input: AbstractControl) => {
      const forbidden = Number(input.value);
      return !Number.isNaN(forbidden) ? (Number.isInteger(forbidden) ? null : {'invalidInteger': true}) : {'invalidInteger': true};
    };
  }

  static isFloat() {
    return (input: AbstractControl) => {
      const forbidden = Number(input.value);
      return !Number.isNaN(forbidden) ? null : {'invalidFloat': true};
    };
  }

  static containsAllowedString(allowedStrings: string): ValidatorFn {
    return (input: AbstractControl): { [key: string]: any } => {
      const allowedStrArray: string[] = allowedStrings.split(',');
      let containsVal = false;
      for (const val of allowedStrArray) {
        if (input.value && input.value.indexOf(val) > -1) {
          containsVal = true;
          break;
        }
      }
      return containsVal ? null : {'invalidStringEntered': true};
    };
  }
}
