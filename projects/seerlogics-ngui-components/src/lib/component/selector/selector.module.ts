import {NgModule} from '@angular/core';
import {SelectorComponent} from './selector.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule],
  exports: [SelectorComponent],
  declarations: [SelectorComponent],
  providers: [],
})
export class SelectorModule {
}
