import { Component, OnInit } from '@angular/core';
import { BaseDynamicComponent } from '../BaseDynamicComponent';
import { ChatData } from '../../../common/model/models';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-table-chat-component',
  templateUrl: './table-chat-component.component.html',
  styleUrls: ['./table-chat-component.component.css']
})
export class TableChatComponentComponent extends BaseDynamicComponent implements OnInit {

  constructor(private router: Router, private notificationService: NotificationService) {
    super()
  }

  getChatData(): ChatData {
    return this.context.chatData;
  }

  getMessage(): any {
    return this.context.message;
  }

  ngOnInit() {
  }

  navigateTo(column) {
    this.router.navigate([column.clickUrl]);
  }

  clickAndSendResponse(col) {
    this.notificationService.notify(col,
                'clickAndSendResponse', 'clickAndSendResponse');
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
