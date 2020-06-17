import {Component, OnInit} from '@angular/core';
import {BaseDynamicComponent} from '../baseDynamic.component';
import {ChatData} from '../../model/models';

@Component({
  selector: 'app-text-chat-component',
  templateUrl: './text-chat2-component.component.html',
  styleUrls: ['./text-chat2-component.component.css']
})
export class TextChat2ComponentComponent extends BaseDynamicComponent implements OnInit {

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
      return 'left';
    } else {
      return 'right';
    }
  }

}
