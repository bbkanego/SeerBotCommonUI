import {NgModule} from '@angular/core';
import {RadioComponent} from './radio.component';
import {RadioGroupComponent} from './radioGroup.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule],
  exports: [RadioComponent, RadioGroupComponent],
  declarations: [RadioComponent, RadioGroupComponent],
  providers: [],
})
export class RadioModule {
}
