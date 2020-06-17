import {NgModule} from '@angular/core';
import {TreeNodeComponent, TreeViewComponent} from './treeView.component';
import {CommonModule} from '@angular/common';
import {DirectiveModule} from '../../directive/directive.module';

@NgModule({
  imports: [CommonModule, DirectiveModule],
  exports: [TreeViewComponent, TreeNodeComponent],
  declarations: [TreeViewComponent, TreeNodeComponent],
  providers: [],
})
export class TreeViewModule {
}
