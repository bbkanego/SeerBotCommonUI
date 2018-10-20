import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl, ValidatorFn, Validators } from '@angular/forms';
import { CustomValidator } from '../../common/validator/custom.validator';

export const VALIDATION_ERROR_TYPES = {
  REQUIRED: 'required',
  INVALID_DATA: 'invalidData'
};

// @dynamic
@Injectable()
export class CustomFormControl extends FormControl {
  private validationErrorMap = new Map<string, string>();
  private _errorMessages: any;
  validationRules = {};

  constructor(formState?: any, validationRules?: {}, validator?: ValidatorFn | ValidatorFn[],
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[]) {
    super(formState, validator, asyncValidator);
    this.validationRules = validationRules ? validationRules : {};
    this.addValidationRules(this.validationRules);
    if (formState) {
      for (const key in formState) {
        if (key === 'value') {
          this.setValue(formState[key]);
        } else if (key === 'errorMessages') {
          this._errorMessages = formState[key];
        }
      }
    }
  }

  private addValidationRules(validationRules: any) {
    const REGEX_ONLY_NUMBERS = '[0-9]*$';
    const tempValidators = [];
    if (validationRules['required']) {
      tempValidators.push(Validators.required)
    }

    if (validationRules['validateMinMaxLength']) {
      const maxLength = validationRules['vars'].maxLength.value;
      const minLength = validationRules['vars'].minLength.value;
      tempValidators.push(Validators.minLength(minLength))
      tempValidators.push(Validators.maxLength(maxLength))
    }

    if (validationRules['validateMaxLength']) {
      const maxLength = validationRules['vars'].maxLength.value;
      tempValidators.push(Validators.maxLength(maxLength))
    }

    if (validationRules['validateMinLength']) {
      const minLength = validationRules['vars'].minLength.value;
      tempValidators.push(Validators.minLength(minLength))
    }

    if (validationRules['validateValues']) {
      const allowedVals = validationRules['vars'].allowedValues.value;
      tempValidators.push(CustomValidator.containsAllowedString(allowedVals));
    }

    if (validationRules['validateDateFormat']) {
      const format = validationRules['vars'].format.value;
      tempValidators.push(CustomValidator.validateDateFormat(format));
    }

    if (validationRules['containsChars']) {
      const regEx = validationRules['vars'].regEx.value;
      tempValidators.push(CustomValidator.checkAllowedChars(new RegExp(regEx)));
    }

    if (validationRules['validateLong']) {
      tempValidators.push(CustomValidator.isInteger());
    }

    if (validationRules['validateDouble']) {
      tempValidators.push(CustomValidator.isFloat());
    }

    if (validationRules['validateFloat']) {
      tempValidators.push(CustomValidator.isFloat());
    }

    if (validationRules['validateMaxValue']) {
      const maxValue = validationRules['vars'].maxValue.value;
      tempValidators.push(Validators.max(maxValue));
      tempValidators.push(Validators.pattern(REGEX_ONLY_NUMBERS));
    }

    if (tempValidators.length > 0) {
      this.setValidators(tempValidators);
    }
  }

  public get errorMessages(): any {
    return this._errorMessages;
  }

  addValidationError(key: string, value: string) {
    this.validationErrorMap.set(key, value);
  }

  getValidationErrorsMap(): Map<string, string> {
    return this.validationErrorMap;
  }
}
