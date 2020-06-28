import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SelectorComponent} from '../selector/selector.component';

@Component({
  selector: 'seer-radio',
  templateUrl: './radio.component.html'
})
export class RadioComponent extends SelectorComponent
  implements OnInit, AfterViewInit {
  @Input() inline = false;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }
}
