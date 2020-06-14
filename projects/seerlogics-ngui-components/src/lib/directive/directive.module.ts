import {NgModule} from '@angular/core';
import {BlurForwarderDirective} from './blurForwarder.directive';
import {ClickOutsideDirective} from './clickOutside.directive';
import {DraggableDirective} from './draggable.directive';
import {DropTargetDirective} from './dropTarget.directive';
import {FocusForwarderDirective} from './focusForwarder.directive';
import {IncludePartialDirective} from './ngInclude.directive';
import {ScrollToDirective} from './scrollTo.directive';
import {ValidationOnBlurDirective} from './validateOnBlur.directive';
import {WebSocketDirective} from './websocket.directive';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [BlurForwarderDirective, ClickOutsideDirective, FocusForwarderDirective, WebSocketDirective,
    DraggableDirective, DropTargetDirective, IncludePartialDirective, ScrollToDirective, ValidationOnBlurDirective],
  declarations: [BlurForwarderDirective, ClickOutsideDirective, FocusForwarderDirective, WebSocketDirective,
    DraggableDirective, DropTargetDirective, IncludePartialDirective, ScrollToDirective, ValidationOnBlurDirective],
  providers: [],
})
export class DirectiveModule {
}
