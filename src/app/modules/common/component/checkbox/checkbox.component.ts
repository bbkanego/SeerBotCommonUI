import { Component, OnInit, OnDestroy, Injector, ElementRef, ViewChild } from '@angular/core';
import { BaseCustomComponent } from '../../../common/component/BaseCustomComponent.component';
import { Subscription } from 'rxjs/Subscription';
import { SUBSCRIBER_TYPES } from '../../../common/model/constants';

@Component({
  selector: 'app-bk-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent extends BaseCustomComponent
  implements OnInit, OnDestroy {

  formResetSub: Subscription;
  @ViewChild('bkInputWidget') bkInputWidget: ElementRef;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnDestroy(): void {
    this.formResetSub.unsubscribe();
  }

  ngOnInit() {
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

  onBlurEvent(event) {
    this.elementBlurred = true;
    const widgetObj = $(this.bkInputWidget.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit(event);
  }
}
