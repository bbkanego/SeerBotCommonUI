import {NgModule} from '@angular/core';
import {SelectorComponent} from './selector.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [SelectorComponent],
  declarations: [SelectorComponent],
  providers: [],
})
export class SelectorModule {
}
