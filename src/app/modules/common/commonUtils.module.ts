import { NgModule } from '@angular/core';
import { TreeChooserComponent } from './component/chooser/treeChooser.component';
// component
import { ErrorHandler } from './component/errorHandler/errorHandler.component';

import { ModalComponent } from './component/modal/modal.component';
import { DynamicModalComponent } from './component/modal/dynamicModal.component';
import { CustomTabMenu } from './component/tabMenu/customTabMenu';
import { DatePickerComponent } from './component/datepicker/datepicker.component';
import { SelectComponent } from './component/selector/selector.component';
import { FileUploadComponent } from './component/fileupload/fileupload.component';
import { InputComponent } from './component/input/input.component';
import { RadioComponent } from './component/radio/radio.component';
import {
  DataTableComponent,
  DataColumnComponent,
  ColumnBodyTemplateLoader,
  BkTemplateDirective,
  ColumnHeaderTemplateLoader
} from './component/dataTable/dataTable.component';
import { ButtonComponent } from './component/button/button.component';
import { ChartComponent } from './component/chart/chart.component';
import { SessionTimeoutComponent } from './component/sessiontimeout/sessionTimeout.component';
import { ErrorMessagesComponent } from './component/errorMessages/errorMessages.component';
import { BaseReactiveComponent } from './component/baseReactive.component';
import {
  TreeViewComponent,
  TreeNodeComponent
} from './component/treeView/treeView.component';
import { TooltipComponent } from './component/tooltip/tooltip.component';
import { LoaderComponent } from './component/loader/loader.component';

// directives
import { ValidationOnBlurDirective } from './directive/validateOnBlur.directive';
import { FocusForwarderDirective } from './directive/focusForwarder.directive';
import { BlurForwarderDirective } from './directive/blurForwarder.directive';
import { ScrollToDirective } from './directive/scrollTo.directive';
import { WebSocketDirective } from './directive/websocket.directive';
import { DraggableDirective } from './directive/draggable.directive';
import { DropTargetDirective } from './directive/dropTarget.directive';
import { IncludePartialDirective } from './directive/ngInclude.directive';

// services
import { NotificationService } from './service/notification.service';
import { LoggerService } from './service/logger.service';
import { ValidationService } from './service/validation.services';
import { HttpClient } from './service/httpClient.helper';
import { Utils } from './service/utils.service';

// Guards
import { PendingChangesGuard } from './guard/pendingChanges.guard';

// Pipes
import { FilterArrayPipe } from './pipe/filterArray.pipe';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  ButtonModule,
  TreeModule,
  FileUploadModule
} from 'primeng/primeng';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './component/checkbox/checkbox.component';
import { CheckboxGroupComponent } from './component/checkbox/checkboxGroup.component';
import { RadioGroupComponent } from './component/radio/radioGroup.component';
import { ChatComponent } from './component/chat/chat.component';
import { Chat2Component } from './component/chat/chat2.component';
import { TextChatComponentComponent } from './component/chat/text-chat-component.component';
import { TextChat2ComponentComponent } from './component/chat/text-chat2-component.component';
import { TableChatComponentComponent } from './component/chat/table-chat-component.component';
import { ConfirmChatComponent } from './component/chat/confirm-chat.component';
import { OptionsChatComponent } from './component/chat/options-chat.component';
import { TextareaComponent } from './component/textarea/textarea.component';

import {MatInputModule} from '@angular/material';

@NgModule({
  declarations: [
    ModalComponent,
    ErrorHandler,
    CustomTabMenu,
    TreeChooserComponent,
    ValidationOnBlurDirective,
    DatePickerComponent,
    DataTableComponent,
    BkTemplateDirective,
    ButtonComponent,
    RadioComponent,
    FilterArrayPipe,
    DataColumnComponent,
    ColumnBodyTemplateLoader,
    ColumnHeaderTemplateLoader,
    SelectComponent,
    FileUploadComponent,
    InputComponent,
    TextareaComponent,
    ScrollToDirective,
    WebSocketDirective,
    IncludePartialDirective,
    ErrorMessagesComponent,
    ChartComponent,
    SessionTimeoutComponent,
    DynamicModalComponent,
    TreeViewComponent,
    TreeNodeComponent,
    DraggableDirective,
    DropTargetDirective,
    FocusForwarderDirective,
    BlurForwarderDirective,
    TooltipComponent,
    LoaderComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    RadioGroupComponent,
    ChatComponent,
    Chat2Component,
    TextChatComponentComponent,
    TextChat2ComponentComponent,
    TableChatComponentComponent,
    ConfirmChatComponent,
    OptionsChatComponent,
    BaseReactiveComponent
  ],
  entryComponents: [
    ErrorMessagesComponent,
    TextChatComponentComponent,
    TextChat2ComponentComponent,
    TableChatComponentComponent,
    ConfirmChatComponent,
    OptionsChatComponent
  ],
  providers: [
    ValidationService,
    HttpClient,
    LoggerService,
    PendingChangesGuard,
    Utils
  ],
  imports: [
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    TreeModule,
    FileUploadModule,
    MatInputModule
  ],
  exports: [
    ModalComponent,
    ErrorHandler,
    CustomTabMenu,
    InputComponent,
    TextareaComponent,
    FilterArrayPipe,
    DataTableComponent,
    TreeChooserComponent,
    SelectComponent,
    FileUploadComponent,
    RadioComponent,
    DataColumnComponent,
    ButtonComponent,
    ValidationOnBlurDirective,
    DatePickerComponent,
    BkTemplateDirective,
    ScrollToDirective,
    IncludePartialDirective,
    BlurForwarderDirective,
    FocusForwarderDirective,
    ChartComponent,
    SessionTimeoutComponent,
    WebSocketDirective,
    ErrorMessagesComponent,
    DynamicModalComponent,
    TreeViewComponent,
    TreeNodeComponent,
    DraggableDirective,
    TooltipComponent,
    LoaderComponent,
    CheckboxComponent,
    CheckboxGroupComponent,
    RadioGroupComponent,
    ChatComponent,
    Chat2Component,
    BaseReactiveComponent
  ]
})
export class CommonUtilsModule {
  /**
   * App-wide services in forRoot, and everything else in the NgModule
   */
  /* static forRoot() {
    return {
      ngModule: CommonUtilsModule,
      providers: [ NotificationService ]
    }
  }*/
}
