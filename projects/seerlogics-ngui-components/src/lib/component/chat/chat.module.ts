import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Chat2Component} from './chat2.component';
import {ChatComponent} from './chat.component';
import {ConfirmChatComponent} from './confirm-chat.component';
import {OptionsChatComponent} from './options-chat.component';
import {TableChatComponentComponent} from './table-chat-component.component';
import {TextChatComponentComponent} from './text-chat-component.component';
import {TextChat2ComponentComponent} from './text-chat2-component.component';

@NgModule({
  imports: [CommonModule],
  exports: [Chat2Component, ChatComponent,
    ConfirmChatComponent, OptionsChatComponent, TableChatComponentComponent,
    TextChatComponentComponent, TextChat2ComponentComponent],
  declarations: [Chat2Component, ChatComponent,
    ConfirmChatComponent, OptionsChatComponent, TableChatComponentComponent,
    TextChatComponentComponent, TextChat2ComponentComponent],
  providers: [],
})
export class ChatModule {}
