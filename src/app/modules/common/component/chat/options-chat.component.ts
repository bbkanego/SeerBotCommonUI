import { Component, OnInit } from '@angular/core';
import { BaseDynamicComponent } from '../BaseDynamicComponent';
import { NotificationService } from '../../../common/service/notification.service';
import { Router } from '@angular/router';
import { ChatData } from '../../../common/model/models';

@Component({
  selector: 'app-options-chat',
  templateUrl: './options-chat.component.html',
  styleUrls: ['./options-chat.component.css']
})
export class OptionsChatComponent extends BaseDynamicComponent implements OnInit {

  constructor(private router: Router, private notificationService: NotificationService) {
    super()
  }

  ngOnInit() {
  }

  get chatData(): ChatData {
    return this.context.chatData;
  }

  get messageJSON(): any {
    return this.context.message;
  }

  navigateTo(column) {
    this.router.navigate([column.clickUrl]);
  }

  clickAndSendResponse(col) {
    this.notificationService.notify(col,
                'clickAndSendResponse', 'clickAndSendResponse');
  }

  getChatMessageClass() {
    const chat = this.chatData;
    if (chat.accountId === 'ChatBot') {
      return 'left';
    } else {
      return 'right';
    }
  }
}
