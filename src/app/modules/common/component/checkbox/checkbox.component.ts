import {Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseCustomComponent} from '../../../common/component/BaseCustomComponent.component';
import {Dialog} from 'primeng/primeng';

@Component({
  selector: 'app-bk-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent extends BaseCustomComponent
  implements OnInit, OnDestroy {

  @ViewChild('bkInputWidget', {static: false}) bkInputWidget: ElementRef;

  @Input() value: string;

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.initFormGroup();
  }

  onCheckChange(event) {
    if (event.target.checked) {
      this.onClick.emit(event.target.value);
    }
  }

  onBlurEvent(event) {
    this.elementBlurred = true;
    const widgetObj = $(this.bkInputWidget.nativeElement);
    const id = widgetObj.attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit(event);
  }
}
