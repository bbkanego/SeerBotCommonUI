import {NgModule} from '@angular/core';
import {FilterArrayPipe} from './filterArray.pipe';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [FilterArrayPipe],
  declarations: [FilterArrayPipe],
  providers: [],
})
export class PipeModule {
}
