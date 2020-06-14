import {NgModule} from '@angular/core';

import {InputComponent} from './input.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [InputComponent],
  declarations: [InputComponent],
  providers: [],
})
export class InputModule {
}
