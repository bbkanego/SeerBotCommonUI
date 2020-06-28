import {Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseCustomComponent} from '../baseCustom.component';
import {Option} from '../../model/models';

@Component({
  selector: 'seer-checkbox-grp',
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
