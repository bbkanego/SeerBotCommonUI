import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HelpExampleComponent} from './help/help-example.component';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [{path: '', component: HelpExampleComponent}];

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ],
  declarations: [HelpExampleComponent],
  exports: [
    HelpExampleComponent
  ],
  entryComponents: [
    HelpExampleComponent
  ]
})
export class TestComponentsModule {

}
