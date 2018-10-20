import { Component, OnInit } from '@angular/core';
import { BaseDynamicComponent } from '../BaseDynamicComponent';
import { ChatData } from '../../../common/model/models';

@Component({
  selector: 'app-text-chat-component',
  templateUrl: './text-chat-component.component.html',
  styleUrls: ['./text-chat-component.component.css']
})
export class TextChatComponentComponent extends BaseDynamicComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

  getChatData(): ChatData {
    return this.context.chatData;
  }

  getMessage(): string {
    return this.context.message;
  }

  getChatMessageClass() {
    const chat = this.getChatData();
    if (chat.accountId === 'ChatBot') {
      return 'botChat chatContent';
    } else {
      return 'customerChat chatContent';
    }
  }

}
