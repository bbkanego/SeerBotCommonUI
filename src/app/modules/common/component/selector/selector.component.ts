import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { BaseCustomComponent } from '../BaseCustomComponent.component';
import { Option } from '../../model/models';
import { SUBSCRIBER_TYPES } from '../../model/constants';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bk-select',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectComponent extends BaseCustomComponent
  implements AfterViewInit, OnInit, OnDestroy {
  private formResetSub: Subscription;

  @Input() options: Option[];
  @ViewChild('selectWidget') selectWidget: ElementRef;

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.initFormGroup();

    this.formResetSub = this.notificationService
      .onNotification()
      .subscribe((eventData: any) => {
        if (eventData.type === SUBSCRIBER_TYPES.FORM_GROUP_RESET) {
          this.currentForm.form = eventData.message;
          this.currentFormGroup = null;
          this.initFormGroup();
        }
      });
  }

  ngOnDestroy() {
    this.formResetSub.unsubscribe();
  }

  /**
   * This method is here for a reason. Do not remove since the parent class' "isInvalid" method
   * does not work for select.
   */
  isInvalid() {
    return (
      this.getFormControl().errors &&
      this.currentFormGroup.invalid &&
      (this.currentForm.submitted || this.getFormControl().touched)
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
