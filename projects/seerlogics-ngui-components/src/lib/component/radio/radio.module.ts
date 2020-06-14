import {NgModule} from '@angular/core';
import {RadioComponent} from './radio.component';
import {RadioGroupComponent} from './radioGroup.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [RadioComponent, RadioGroupComponent],
  declarations: [RadioComponent, RadioGroupComponent],
  providers: [],
})
export class RadioModule {
}
