import {NgModule} from '@angular/core';
import {PendingChangesGuard} from './pendingChanges.guard';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [PendingChangesGuard],
  declarations: [PendingChangesGuard],
  providers: [],
})
export class GuardModule {
}
