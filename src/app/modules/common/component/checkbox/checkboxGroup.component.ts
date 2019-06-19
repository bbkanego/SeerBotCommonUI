import { Component, OnInit, OnDestroy, Injector, ElementRef, ViewChild, Input } from '@angular/core';
import { BaseCustomComponent } from '../../../common/component/BaseCustomComponent.component';
import { Subscription } from 'rxjs/Subscription';
import { SUBSCRIBER_TYPES } from '../../../common/model/constants';
import { Option } from '../../../common/model/models';

@Component({
  selector: 'app-bk-checkbox-grp',
  templateUrl: './checkboxGroup.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxGroupComponent extends BaseCustomComponent
  implements OnInit, OnDestroy {

  @ViewChild('#checkboxGrpLabel') checkboxGrpLabelObj: ElementRef;
  @Input() options: Option[];

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  onBlurEvent(event) {
    this.elementBlurred = true;
    const widgetObj = $(this.checkboxGrpLabelObj.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit(event);
  }
}
