import {Component, Input, AfterViewInit, ViewChild, ElementRef, OnInit, OnDestroy} from '@angular/core';
import {BaseCustomComponent} from '../../../common/component/BaseCustomComponent.component';
import {Option} from '../../../common/model/models';
import { SUBSCRIBER_TYPES } from '../../../common/model/constants';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bk-select',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectComponent extends BaseCustomComponent implements AfterViewInit, OnInit, OnDestroy {
  private formResetSub: Subscription;

  @Input() options: Option[];
  @ViewChild('selectWidget') selectWidget: ElementRef;

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.initFormGroup();

    this.formResetSub = this.notificationService.onNotification().subscribe((eventData: any) => {
      if (eventData.type === SUBSCRIBER_TYPES.FORM_GROUP_RESET) {
        this.currentForm.form = eventData.message;
        this.currentFormGroup = null;
        this.initFormGroup();
      }
    })
  }

  ngOnDestroy() {
    this.formResetSub.unsubscribe();
  }

  isInvalid() {
    return (
      this.getFormControl().errors && this.currentFormGroup.invalid
    );
  }
}
