import {NgModule} from '@angular/core';
import {TreeViewComponent} from './treeView.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [TreeViewComponent],
  declarations: [TreeViewComponent],
  providers: [],
})
export class TreeViewModule {
}
