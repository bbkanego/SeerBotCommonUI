import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { SelectComponent } from '../../../common/component/selector/selector.component';
import { Option } from '../../../common/model/models';

@Component({
  selector: 'bk-radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent extends SelectComponent
  implements OnInit, AfterViewInit {
  @Input() inline = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
