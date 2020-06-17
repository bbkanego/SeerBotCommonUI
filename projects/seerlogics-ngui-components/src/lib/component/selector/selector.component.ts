import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseCustomComponent} from '../baseCustom.component';
import {Option} from '../../model/models';
import {CustomValidator} from '../../validator/custom.validator';

@Component({
  selector: 'app-bk-select',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent extends BaseCustomComponent
  implements AfterViewInit, OnInit, OnDestroy {

  @Input() options: Option[];
  @ViewChild('selectWidget') selectWidget: ElementRef;

  ngAfterViewInit(): void {
    if (!this.getFormControl().value) {
      this.getFormControl().setValue(this.options[0].value);
    }
  }

  ngOnInit(): void {
    if (this.getFormControl().validationRules['required']) {
      this.getFormControl().setValidators([CustomValidator.isSelectValid()]);
    }
    this.initFormGroup();
  }

  ngOnDestroy() {
  }

  /**
   * This method is here for a reason. Do not remove since the parent class' "isInvalid" method
   * does not work for select.
   */
  isInvalid() {
    return (
      this.getFormControl().errors && this.currentFormGroup.invalid && this.getFormControl().touched
    );
  }

  onChange(event) {
    this.onSelect.emit(event);
  }

  onBlurEvent(event) {
    this.onBlur.emit(event);
  }

  onFocusEvent(event) {
    this.onFocus.emit(event);
  }
}
