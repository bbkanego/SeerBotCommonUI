import {NgModule} from '@angular/core';
import {TextareaComponent} from './textarea.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [TextareaComponent],
  declarations: [TextareaComponent],
  providers: [],
})
export class TextareaModule {
}
