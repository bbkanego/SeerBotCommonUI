import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

// @dynamic
export class CustomValidator {

  static validateDateFormat(format: string) {
    return (control: AbstractControl) => {
      const isValid = moment(control.value, format.toUpperCase(), true).isValid();
      return isValid ? null : { 'invalidDateFormat': true };
    }
  }

  static hasPunctuation(punctuation: string, errorType: string) {
    return (input: AbstractControl) => {
      return input.value.indexOf(punctuation) >= 0 ?
        null :
        { [errorType]: true };
    };
  }

  static checkAllowedChars(regEx: RegExp) {
    return (input: AbstractControl) => {
      const isMatch = regEx.test(input.value);
      return isMatch ? null : { 'invalidChars': true };
    };
  }

  static isInteger() {
    return (input: AbstractControl) => {
      const forbidden = Number(input.value);
      return !Number.isNaN(forbidden) ? (Number.isInteger(forbidden) ? null : { 'invalidInteger': true }) : { 'invalidInteger': true };
    };
  }

  static isFloat() {
    return (input: AbstractControl) => {
      const forbidden = Number(input.value);
      return !Number.isNaN(forbidden) ? null : { 'invalidFloat': true };
    };
  }

  static containsAllowedString(allowedStrings: string) {
    return (input: AbstractControl) => {
      const allowedStrArray: string[] = allowedStrings.split(',');
      let containsVal = false;
      for (const val of allowedStrArray) {
        if (input.value && input.value.indexOf(val) > -1) {
          containsVal = true;
          break;
        }
      }
      return containsVal ? null : { 'invalidStringEntered': true };
    };
  }
}
