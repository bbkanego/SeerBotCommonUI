import {Component, OnInit} from '@angular/core';
import {BaseDynamicComponent} from '../baseDynamic.component';
import {Router} from '@angular/router';
import {NotificationService} from '../../service/notification.service';
import {ChatData} from '../../model/models';

@Component({
  selector: 'seer-confirm-chat-component',
  templateUrl: './confirm-chat.component.html',
  styleUrls: ['./confirm-chat.component.css']
})
export class ConfirmChatComponent extends BaseDynamicComponent implements OnInit {

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

  clickYes() {
    this.notificationService.notifyAny({response: 'yes', messageJSON: this.messageJSON}, 'performYesNoAction', 'performYesNoAction');
    this.notificationService.notify((this.id + '').trim(), 'deleteChildComponent', 'deleteChildComponent');
  }

  clickNo() {
    this.notificationService.notifyAny({response: 'no', messageJSON: this.messageJSON}, 'performYesNoAction', 'performYesNoAction');
    this.notificationService.notify((this.id + '').trim(), 'deleteChildComponent', 'deleteChildComponent');
  }

}
