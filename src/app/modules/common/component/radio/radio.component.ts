import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SelectComponent} from '../../../common/component/selector/selector.component';

@Component({
  selector: 'bk-radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent extends SelectComponent
  implements OnInit, AfterViewInit {
  @Input() inline = false;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
}
