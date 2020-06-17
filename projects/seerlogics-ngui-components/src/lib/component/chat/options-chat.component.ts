import {Component, OnInit} from '@angular/core';
import {BaseDynamicComponent} from '../baseDynamic.component';
import {NotificationService} from '../../service/notification.service';
import {Router} from '@angular/router';
import {ChatData} from '../../model/models';

@Component({
  selector: 'app-options-chat',
  templateUrl: './options-chat.component.html',
  styleUrls: ['./options-chat.component.css']
})
export class OptionsChatComponent extends BaseDynamicComponent implements OnInit {

  constructor(private router: Router, private notificationService: NotificationService) {
    super();
  }

  get chatData(): ChatData {
    return this.context.chatData;
  }

  get messageJSON(): any {
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

  isButtonWidgetType(widget) {
    return widget.type == 'button';
  }

  isLinkWidgetType(widget) {
    return widget.type == 'link';
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
