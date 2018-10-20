import { Input, Output, EventEmitter, Injectable, Injector } from '@angular/core';
import { FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { COMMON_CONST } from '../../common/model/constants';
import { CustomFormControl } from '../../common/model/controls';
import { CommonService } from '../../common/service/common.service';
import { ValidationService } from '../../common/service/validation.services';
import { NotificationService } from '../../common/service/notification.service';
import { LoggerService } from '../../common/service/logger.service';

@Injectable()
export abstract class BaseCustomComponent {
  protected notificationService: NotificationService;
  protected loggerService: LoggerService;

  // FOR reactive forms based pages
  @Input() currentFormGroup: FormGroup;
  @Input() currentFormControlName: string;
  @Input() controlId: string;
  @Input() label: string;
  @Input() disabled: any;
  @Input() currentForm: FormGroupDirective;
  protected elementBlurred = false;

  protected validationService: ValidationService;
  protected commonService: CommonService;

  @Input() validationRule: string = COMMON_CONST.DEFAULT_VALIDATION_RULE;

  @Output() onFocus: EventEmitter<any> = new EventEmitter();

  @Output() onBlur: EventEmitter<any> = new EventEmitter();

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  @Output() onContextMenu: EventEmitter<any> = new EventEmitter();

  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  @Output() onDrop: EventEmitter<any> = new EventEmitter();

  // use this to pass data to component when creating components using angular dynamic components
  extraDynamicData: any = {};

  getFormControl(): CustomFormControl {
    if (this.currentFormGroup == null) {
      this.currentFormGroup = this.currentForm.form;
    }
    const customerFormControl = this.currentFormGroup.get(
      this.currentFormControlName
    ) as CustomFormControl;
    if (!customerFormControl) {
      throw new Error(
        'NULL form control for control name = ' + this.currentFormControlName
      );
    } else {
      return customerFormControl;
    }
  }

  isRequired(): boolean {
    return this.getFormControl().validationRules['required'] ? true : false;
  }

  isInvalid() {
    return (
      this.getFormControl().errors && this.currentFormGroup.invalid && (this.currentForm.submitted || this.elementBlurred)
    );
  }

  constructor(private injector: Injector) {
    this.validationService = injector.get(ValidationService);
    this.commonService = injector.get(CommonService);
    this.notificationService = injector.get(NotificationService);
    this.loggerService = injector.get(LoggerService);
  }

  getErrorMessage() {
    if (this.getFormControl().errors.required) {
      return this.commonService.messages['message.field.required'];
    } else if (this.getFormControl().errors.minlength) {
      return this.commonService.messages['message.field.lessthan']
                + ' ' + this.getFormControl().errors.minlength.requiredLength;
    } else if (this.getFormControl().errors.maxlength) {
      return this.commonService.messages['message.field.morethan']
                + ' ' + this.getFormControl().errors.minlength.requiredLength;
    } else if (this.getFormControl().errors.invalidChars) {
      if (this.getFormControl().validationRules['containsCharsMessage']) {
        const containsCharsMessage = this.getFormControl().validationRules['containsCharsMessage'];
        return this.commonService.messages[containsCharsMessage['value']];
      } else {
        return this.commonService.messages['message.field.invalidstring'];
      }
    } else if (this.getFormControl().errors.invalidStringEntered) {
      return this.commonService.messages['message.field.invalidstring']
    } else if (this.getFormControl().errors.max) {
      return this.commonService.messages['message.field.shouldbelessthan']
              +  ' ' + this.getFormControl().errors.max.max;
    } else if (this.getFormControl().errors.pattern) {
      return 'Invalid data entered';
    } else if (this.getFormControl().errors.invalidFloat) {
      return 'This should be a float';
    } else if (this.getFormControl().errors.invalidInteger) {
      return 'This should be a number withour any decimals';
    } else if (!this.getFormControl().errors.required && this.getFormControl().errors.invalidDateFormat) {
      return this.commonService.messages['errors.invalidDateFormat'];
    }
  }

  protected initFormGroup() {
    if (this.currentFormGroup == null) {
      this.currentFormGroup = this.currentForm.form;
    }

    if (this.controlId == null) {
      this.controlId = this.currentFormControlName;
    }
  }
}
