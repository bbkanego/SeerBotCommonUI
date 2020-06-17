import {NgModule} from '@angular/core';

import {TreeChooserComponent} from './treeChooser.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DialogModule, TreeModule} from 'primeng';

@NgModule({
  imports: [CommonModule, FormsModule,
    ReactiveFormsModule, DialogModule, TreeModule],
  exports: [TreeChooserComponent],
  declarations: [TreeChooserComponent],
  providers: [],
})
export class TreeChooserModule {
}
