import { AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as JQuery from 'jquery';
import { Subscription } from 'rxjs/Subscription';

import { BaseCustomComponent } from '../BaseCustomComponent.component';
import { SUBSCRIBER_TYPES } from '../../model/constants';

const $ = JQuery;

@Component({
  selector: 'app-bk-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent extends BaseCustomComponent implements OnInit, AfterViewInit, OnDestroy {
  formResetSub: Subscription;
  @ViewChild('bkInputWidget') bkInputWidget: ElementRef;

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
    if (this.formResetSub) {
      this.formResetSub.unsubscribe();
    }
  }

  onBlurEvent($event) {
    this.elementBlurred = true;
    const widgetObj = $(this.bkInputWidget.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit($event);
  }
}
