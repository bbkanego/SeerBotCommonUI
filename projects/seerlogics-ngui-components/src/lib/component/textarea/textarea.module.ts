import {NgModule} from '@angular/core';
import {TextareaComponent} from './textarea.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule],
  exports: [TextareaComponent],
  declarations: [TextareaComponent],
  providers: [],
})
export class TextareaModule {
}
