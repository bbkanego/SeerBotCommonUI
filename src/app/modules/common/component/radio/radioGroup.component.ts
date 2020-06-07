import {Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseCustomComponent} from '../../../common/component/BaseCustomComponent.component';
import {Option} from '../../../common/model/models';

@Component({
  selector: 'app-bk-radio-grp',
  templateUrl: './radioGroup.component.html',
  styleUrls: ['./radioGroup.component.css']
})
export class RadioGroupComponent extends BaseCustomComponent
  implements OnInit, OnDestroy {

  @ViewChild('#radioGrpLabel') radioGrpLabel: ElementRef;
  @Input() options: Option[];

  @Input() label = 'No Label Defined';

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
    const widgetObj = $(this.radioGrpLabel.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit(event);
  }
}
