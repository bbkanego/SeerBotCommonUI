import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormControlName, FormGroup, NgControl} from '@angular/forms';
import {CustomFormControl} from '../model/controls';
import {ValidationService} from '../service/validation.services';
import {NotificationService} from '../service/notification.service';
import {COMMON_CONST} from '../model/constants';

/**
 * https://stackoverflow.com/questions/33866824/angular2-control-validation-on-blur/41973780#41973780
 *
 * This directive is design to capture the Blur/Keyup/change events on the host component where this directive is used and then
 * perform server side validations. See this method 'validateOnBlur'. This is called on Blur event.
 */
@Directive({
  selector: '[appBkValidateOnblur]'
})
export class ValidationOnBlurDirective implements OnInit, OnDestroy {
  @Input() bkValidatorRule: string = COMMON_CONST.DEFAULT_VALIDATION_RULE;

  private wasChanged: any;
  private nativeElement;
  private oldValue;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private formControl: NgControl,
    private validationService: ValidationService,
    private notificationService: NotificationService
  ) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.oldValue = this.nativeElement.value;
    console.log('ValidationOnBlurDirective inited = ' + this.oldValue);
  }

  ngOnDestroy(): void {
    console.log('ValidationOnBlurDirective destroyed');
  }

  @HostListener('focus')
  onFocus($event) {
    this.wasChanged = false;
  }

  @HostListener('keyup')
  onKeyup($event) {
    this.wasChanged = true; // keyboard change
  }

  @HostListener('change')
  onChange($event) {
    this.wasChanged = true; // copypaste change
  }

  @HostListener('ngModelChange')
  onNgModelChange($event) {
    this.wasChanged = true; // ng-value change
  }

  @HostListener('blur')
  onBlur($event) {
    // this.validateOnBlur($event);
  }

  private isEqual(): boolean {
    const newValue = this.nativeElement.value;
    if (newValue === '') {
      return false;
    }
    if (this.oldValue === newValue) {
      return true;
    }
    return false;
  }

  private validateOnBlur($event) {
    if (
      this.isEqual() ||
      this.bkValidatorRule === COMMON_CONST.DEFAULT_VALIDATION_RULE
    ) {
      return;
    }
    this.oldValue = this.nativeElement.value;

    const formControlName: FormControlName = this.formControl as FormControlName;
    const control: CustomFormControl = formControlName.control as CustomFormControl;
    const formGroup = control.parent;
    const formObj: FormGroup = formGroup.root as FormGroup;
    const serializedForm = JSON.stringify(formObj.getRawValue());
    const $nativeElementObj = $(this.nativeElement);
    const $containerDomId =
      $nativeElementObj.attr('errorContainerId') != null
        ? $nativeElementObj.attr('errorContainerId')
        : $nativeElementObj.attr('id');
    const $containerDomObj = $('#' + $containerDomId);
    console.log(
      'OnBlur called ---------- ' +
      JSON.stringify($event) +
      ', ' +
      this.formControl
    );
    this.validationService
      .validateAllFields(this.bkValidatorRule, serializedForm)
      .subscribe(
        (successObj: any) => {
          console.log(JSON.stringify(successObj));
          // create a div first
          const errorObjId = $containerDomId + 'ErrorMsg';
          let errorMessage = null;
          for (const entry of successObj.fieldErrors) {
            if (entry['fieldId'] === $containerDomId) {
              errorMessage = entry['message'];
              break;
            }
          }
          const $errorObject = $('#' + errorObjId);
          if (errorMessage != null) {
            if ($errorObject.length === 0) {
              const $errorDiv = $('<div>' + errorMessage + '</div>');
              $errorDiv.attr('id', $containerDomId + 'ErrorMsg');
              $errorDiv.addClass('alert-danger').addClass('alert');
              $errorDiv.insertAfter($containerDomObj);
            } else {
              $errorObject.html(errorMessage);
              $errorObject.show();
            }
          } else {
            $errorObject.hide();
          }
        },
        err => {
          this.notificationService.notifyError('validateField failed!');
        }
      );
  }
}
