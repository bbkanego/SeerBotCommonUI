import {NgModule} from '@angular/core';

import {InputComponent} from './input.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule,],
  exports: [InputComponent],
  declarations: [InputComponent],
  providers: [],
})
export class InputModule {
}
