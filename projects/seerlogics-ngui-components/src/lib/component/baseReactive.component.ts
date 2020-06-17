import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {CustomFormControl} from '../model/controls';
import {NotificationService} from '../service/notification.service';
import {Directive, Injector} from '@angular/core';
import {SUBSCRIBER_TYPES} from '../model/constants';
import {BaseCustomComponent} from './baseCustom.component';

export interface AllValidationErrors {
  controlName: string;
  errorName: string;
  errorValue: any;
}

export interface FormGroupControls {
  [key: string]: AbstractControl;
}

function getFormValidationErrors(controls: FormGroupControls): AllValidationErrors[] {
  let errors: AllValidationErrors[] = [];
  Object.keys(controls).forEach(key => {
    const control = controls[key];
    if (control instanceof FormGroup) {
      errors = errors.concat(getFormValidationErrors(control.controls));
    }
    const controlErrors: ValidationErrors = controls[key].errors;
    if (controlErrors !== null) {
      Object.keys(controlErrors).forEach(keyError => {
        errors.push({
          controlName: key,
          errorName: keyError,
          errorValue: controlErrors[keyError]
        });
      });
    }
  });
  return errors;
}

@Directive()
export abstract class BaseReactiveComponent extends BaseCustomComponent {
  constructor(injector: Injector) {
    super(injector);
    this.notificationService = injector.get(NotificationService);
  }

  /**
   * This performs client side JS validations using angular2 built in validations.
   */
  performValidations(formGroup: FormGroup) {
    /* for (const controlkey in formGroup.controls) {
      const control = formGroup.get(controlkey);
      if (control instanceof FormArray) {
        const allFormGroups: FormGroup[] = control.controls as FormGroup[];
        for (let i = 0; i < allFormGroups.length; i++) {
          const tempGroup: FormGroup = allFormGroups[i] as FormGroup;
          this.performValidations(tempGroup);
        }
      } else {
        const customFormControl: CustomFormControl = control as CustomFormControl;
        const messages = customFormControl.errorMessages;
        for (const key in control.errors) {
          console.log("key = " + key + ", messages = " + JSON.stringify(messages)
           + ", control valid = " + control.valid
           + ", validationMessages = " + JSON.stringify(validationMessages));
          customFormControl.addValidationError(key, messages[key] + ' ');
        }
      }
    } */

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof CustomFormControl) {
        control.markAsTouched();
      } else if (control instanceof FormGroup) {
        this.performValidations(control);
      }
    });

    this.notificationService.notifyValidationError(
      SUBSCRIBER_TYPES.VALIDATION_ERROR
    );
  }

  /**
   * This method introspects the props on itself and creates a FormGroup which mimics the incoming entities
   * nesting and structure. This makes it easier to manage changes and saving of the changes without copying of
   * data from entity to Form and vice-versa.
   */
  autoGenFormGroup(entity: any, rulesMetadata?): FormGroup {
    const formGroup: FormGroup = new FormGroup({});
    const props: string[] = Object.getOwnPropertyNames(entity);
    for (const prop of props) {
      const value = entity[prop];
      if (value instanceof Array) {
        if (this.isStringArray(value)) {
          const rules = this.findValidatorRuleForProperty(rulesMetadata, prop);
          formGroup.addControl(
            prop,
            new CustomFormControl(
              value,
              this.createValidatorRuleForProperty(prop, rules)
            )
          );
        } else {
          const formArray: FormArray = new FormArray([]);
          formGroup.addControl(prop, formArray);
          const rules = this.findValidatorRuleForProperty(rulesMetadata, prop);
          for (const arrayObj of value) {
            formArray.push(
              this.autoGenFormGroup(arrayObj, rules ? rules.fields : null)
            );
          }
        }
      } else if (this.isObjectType(value)) {
        const rules = this.findValidatorRuleForProperty(rulesMetadata, prop);
        formGroup.addControl(
          prop,
          this.autoGenFormGroup(value, rules ? rules.fields : null)
        );
      } else {
        const rules = this.findValidatorRuleForProperty(rulesMetadata, prop);
        formGroup.addControl(
          prop,
          new CustomFormControl(
            value,
            this.createValidatorRuleForProperty(prop, rules)
          )
        );
      }
    }

    /*this.loggerService.logDebug("-----------Input entity = " + JSON.stringify(entity)
              + "\n\n------- AutoGen fG = " + JSON.stringify(formGroup.value));*/
    return formGroup;
  }

  isObjectType(valueToCheck: any) {
    if (valueToCheck instanceof Object) {
      return true;
    } else {
      return false;
    }
  }

  isStringArray(valueToCheck: any) {
    if (valueToCheck instanceof Array) {
      let isThisString = false;
      for (const item of valueToCheck) {
        if (typeof item === 'string') {
          isThisString = true;
          break;
        }
      }
      return isThisString;
    }
  }

  getFormValidationErrors(controls: FormGroupControls): AllValidationErrors[] {
    let errors: AllValidationErrors[] = [];
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control instanceof FormGroup) {
        errors = errors.concat(getFormValidationErrors(control.controls));
      }
      const controlErrors: ValidationErrors = controls[key].errors;
      if (controlErrors !== null) {
        Object.keys(controlErrors).forEach(keyError => {
          errors.push({
            controlName: key,
            errorName: keyError,
            errorValue: controlErrors[keyError]
          });
        });
      }
    });
    return errors;
  }

  scrollTo(scrollToElement) {
    $('html, body').animate({
      scrollTop: scrollToElement.offset().top
    }, 500);
  }

  countControls(control: AbstractControl): number {
    if (control instanceof FormControl) {
      return 1;
    }

    if (control instanceof FormArray) {
      return control.controls.reduce((acc, curr) => acc + this.countControls(curr), 1);
    }

    if (control instanceof FormGroup) {
      return Object.keys(control.controls)
        .map(key => control.controls[key])
        .reduce((acc, curr) => acc + this.countControls(curr), 1);
    }
  }

  protected findValidatorRuleForProperty(rulesMetadata, prop): any {
    if (rulesMetadata) {
      for (const rule of rulesMetadata) {
        if (rule['property'] === prop) {
          return rule;
        }
      }
    } else {
      return null;
    }
  }

  /**
   * This method takes a validation rule comming from the server side and creates a client side
   * equivalent rule.
   * @param prop
   * @param validationRule
   */
  protected createValidatorRuleForProperty(prop, validationRule?): {} {
    let rule = null;
    if (!validationRule) {
      return;
    }
    if (validationRule['property'] === prop) {
      if (!rule) {
        rule = {};
      }
      const rules: string = validationRule['depends'];
      if (rules.indexOf(',')) {
        const pieces: string[] = rules.split(',');
        pieces.map((piece) => {
          rule[piece.trim()] = true;
          if (validationRule['modifiableVars'][piece.trim() + 'Message']) {
            const customMessage = validationRule['modifiableVars'][piece.trim() + 'Message'];
            rule[piece.trim() + 'Message'] = customMessage;
          }
        });
      } else {
        rule[rules] = true;
      }

      rule['vars'] = validationRule['vars'];
    }
    return rule;
  }

  protected enableBackButton(): void {
    this.notificationService.notify(
      'Enable Back Button',
      SUBSCRIBER_TYPES.ENABLE_BACK_BUTTON,
      SUBSCRIBER_TYPES.ENABLE_BACK_BUTTON
    );
  }
}
