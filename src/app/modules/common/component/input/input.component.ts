import {Component, ElementRef, OnInit, Input, Output, AfterViewInit, ViewChild, Injector, OnDestroy} from '@angular/core';
import {Calendar, DomHandler} from 'primeng/primeng';
import {BaseCustomComponent} from '../../../common/component/BaseCustomComponent.component';
import {Option} from '../../../common/model/models';
import { SUBSCRIBER_TYPES } from '../../../common/model/constants';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'bk-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
/**
 * Source of Calendar: /Users/bkane/svn/code/angular/primeng-master/components/calendar/calendar.ts
 */
export class InputComponent extends BaseCustomComponent implements OnInit, AfterViewInit, OnDestroy {
  formResetSub: Subscription;
  @ViewChild('bkInputWidget') bkInputWidget: ElementRef;
  private input;

  @Input() inputType = 'text';

  constructor(injector: Injector) {
    super(injector);
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

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.formResetSub.unsubscribe();
  }

  onBlurEvent($event) {
    this.elementBlurred = true;
    const widgetObj = $(this.bkInputWidget.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit($event);
  }
}
