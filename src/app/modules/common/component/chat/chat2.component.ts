/**
 * https://bootsnipp.com/snippets/ZlkBn
 */
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  AfterViewChecked,
  ViewEncapsulation,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '../../../common/service/httpClient.helper';
import { environment } from '../../environments/environment';
import { StompService } from '../../../common/service/stomp.service';
import { AuthenticationService } from '../../service/authentication.service';
import {
  NotificationService,
  Notification
} from '../../../common/service/notification.service';
import { ChatData, Account } from '../../../common/model/models';
import { TableChatComponentComponent } from './table-chat-component.component';
import { BaseDynamicComponent } from '../BaseDynamicComponent';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmChatComponent } from './confirm-chat.component';
import { Router } from '@angular/router';
import { OptionsChatComponent } from '../../../common/component/chat/options-chat.component';
import { TextChat2ComponentComponent } from './text-chat2-component.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-bk-chat2',
  templateUrl: './chat2.component.html',
  styleUrls: ['./chat2.component.css'],
  providers: [StompService]
})
export class Chat2Component
  implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  clickedColumn: any;
  localMessageJSON: any;
  localEventSubscription: Subscription;
  @ViewChild('chatbox')
  chatBox: ElementRef;
  @ViewChild('chatMessageBoxContainer')
  chatMessageBoxContainer: ElementRef;
  @ViewChild('messageListContainer')
  messageListContainer: ElementRef;
  @ViewChild('messageList', { read: ViewContainerRef })
  messageList: ViewContainerRef;
  showChatBox = false;
  @Input()
  showChatBoxAfterSeconds = 10000;
  private dynamicComponentMap: Map<number, ComponentRef<{}>> = new Map();
  private dynamicComponentCount = 0;

  private subscription: any;
  private headers = {};
  private chatSessionId;
  private previousChatId;
  private currentSessionId;
  private scrollToTheBottom = false;
  private initiateMessageSent = false;
  private messageSide = 'left';
  private uniqueClientId;

  @Input()
  hostUrl: string;
  @Input()
  subscriptionUrl: string;
  chatMessages: ChatData[] = new Array();

  private DYNAMIC_COMPONENTS = {
    text: TextChat2ComponentComponent,
    table: TableChatComponentComponent,
    confirmAction: ConfirmChatComponent,
    options: OptionsChatComponent
  };
  componentRef: ComponentRef<{}>;

  constructor(
    private httpClient: HttpClient,
    private stomp: StompService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private notificationService: NotificationService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showChatBox = true;
    }, this.showChatBoxAfterSeconds);

    this.localEventSubscription = this.notificationService
      .onNotification()
      .subscribe((eventObj: Notification) => {
        if (eventObj.subscriberType === 'clickAndSendResponse') {
          this.clickAndSendResponse(eventObj);
        } else if (eventObj.subscriberType === 'performYesNoAction') {
          this.performYesNoAction(eventObj);
        } else if (eventObj.subscriberType === 'deleteChildComponent') {
          this.deleteChildComponent(eventObj);
        }
      });
    this.uniqueClientId = UUID.UUID();
    this.setUpStomp();
    this.connect();
  }

  private deleteChildComponent(eventObj: Notification) {
    const childComponent: ComponentRef<{}> = this.dynamicComponentMap.get(
      +eventObj.message
    );
    childComponent.destroy();
    this.dynamicComponentMap.delete(+eventObj.message);
  }

  private performYesNoAction(eventObj: Notification) {
    if (this.clickedColumn && eventObj.message.response === 'yes') {
      // this.router.navigate([this.clickedColumn.clickActionUrl]);
      this.sendMessageGeneral(
        eventObj.message.messageJSON.yesResponse +
          '|' +
          this.clickedColumn.clickItemId,
        false
      );
      this.clickedColumn = null;
    } else if (this.clickedColumn && eventObj.message.response === 'no') {
      // this.router.navigate([this.clickedColumn.clickActionUrl]);
      this.sendMessageGeneral(eventObj.message.messageJSON.noResponse, false);
      this.clickedColumn = null;
    }
  }

  private clickAndSendResponse(eventObj: Notification) {
    this.clickedColumn = eventObj.message;
    const message: ChatData = {
      id: null,
      message: eventObj.message.clickResponse,
      chatSessionId: this.chatSessionId,
      accountId: null,
      previousChatId: this.previousChatId,
      currentSessionId: this.currentSessionId,
      uniqueClientId: this.uniqueClientId,
      response: ''
    };
    this.httpClient
      .post(environment.SEND_CHAT_URL, JSON.stringify(message))
      .subscribe(() => {
        this.chatBox.nativeElement.value = '';
      });
  }

  sendPingMessage() {
    this.initiateMessageSent = true;
    const message: ChatData = {
      id: null,
      message: 'Initiate',
      accountId: '',
      chatSessionId: 'NONE',
      previousChatId: null,
      currentSessionId: null,
      uniqueClientId: this.uniqueClientId,
      response: ''
    };
    this.httpClient
      .post(environment.SEND_CHAT_URL, JSON.stringify(message))
      .subscribe(() => {});
  }

  sendMessage() {
    this.sendMessageGeneral(this.chatBox.nativeElement.value, true);
  }

  /* sendMessageNew() {
    let text = this.chatBox.nativeElement.value;
    if (text.trim() === '') {
      return;
    }
    $messages = $('.messages');
    this.messageSide = this.messageSide === 'left' ? 'right' : 'left';
    message = new Message({
      text: text,
      message_side: message_side
    });
    message.draw();
    return $messages.animate(
      { scrollTop: $messages.prop('scrollHeight') },
      300
    );
  } */

  sendMessageGeneral(messageStr: string, appendRequest: boolean) {
    const message: ChatData = {
      id: null,
      message: messageStr,
      chatSessionId: this.chatSessionId,
      accountId: null,
      previousChatId: this.previousChatId,
      currentSessionId: this.currentSessionId,
      uniqueClientId: this.uniqueClientId,
      response: ''
    };
    if (appendRequest) {
      this.chatMessages.push(message);
      this.appendChatRequest(message);
    }
    this.httpClient
      .post(environment.SEND_CHAT_URL, JSON.stringify(message))
      .subscribe(() => {
        this.chatBox.nativeElement.value = '';
      });
  }

  dismissChatbox() {
    this.showChatBox = false;
  }

  showChatbox() {
    this.showChatBox = true;
    if (!this.initiateMessageSent) {
      this.sendPingMessage();
    }
  }

  ngOnDestroy() {
    // unsubscribe
    this.subscription.unsubscribe();

    // disconnect
    this.stomp.disconnect().then(() => {
      // console.log('Connection closed')
    });

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    if (this.localEventSubscription) {
      this.localEventSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(">>>>>>>>" + this.chatMessages.length);
  }

  setUpStomp() {
    const currentUser = JSON.parse(this.authenticationService.getCurrentUser());
    if (currentUser && currentUser.token) {
      this.headers['Authorization'] = currentUser.token;
    }
    console.log(
      'hostUrl = ' +
        this.hostUrl +
        ', subscriptionUrl = ' +
        this.subscriptionUrl
    );
    this.stomp.stompConfig = {
      host: this.hostUrl + '?token=' + currentUser.token,
      debug: true,
      headers: this.headers,
      queue: { init: false }
    };
  }

  connect() {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      this.subscription = this.stomp.subscribe(
        this.subscriptionUrl + '/' + this.uniqueClientId,
        this.handleResponse.bind(this),
        this.headers
      );
      this.sendPingMessage();
    });
  }

  // response
  private handleResponse(data: ChatData) {
    // console.log('data received = ' + JSON.stringify(data));
    this.chatMessages.push(data);
    this.appendChatResponse(data);
    this.chatSessionId = data.chatSessionId;
    this.previousChatId = data.id;
    this.currentSessionId = data.currentSessionId;
    this.scrollToTheBottom = true;
    if (this.chatBox) {
      this.chatBox.nativeElement.focus();
    }
  }

  ngAfterViewChecked() {
    if (this.scrollToTheBottom) {
      this.scrollToBottom();
      this.scrollToTheBottom = false;
    }
  }

  scrollToBottom(): void {
    if (this.messageListContainer) {
      const $messageListContainerObj = $(this.messageListContainer.nativeElement);
      $messageListContainerObj.animate({ scrollTop: $messageListContainerObj.prop('scrollHeight') }, 300);
      // this.messageListContainer.nativeElement.scrollTop = this.messageListContainer.nativeElement.scrollHeight;
    }
  }

  appendChatRequest(data: ChatData) {
    const contextData = {
      chatData: data,
      message: data.message
    };
    this.createDynamicComponent('text', contextData);
  }

  appendChatResponse(data: ChatData) {
    let message = data.message;
    if (data.accountId === 'ChatBot') {
      message = data.response;
    }
    const messageJSON = JSON.parse(message);
    console.log('The widget name is = ' + messageJSON.widget);
    if (messageJSON.widget === 'text') {
      this.processTextWidget(messageJSON, data);
    } else if (messageJSON.widget === 'table') {
      this.processTableWidget(messageJSON, data);
    } else if (messageJSON.widget === 'confirmAction') {
      this.proccessConfirmAction(messageJSON, data);
    } else if (messageJSON.widget === 'options') {
      this.proccessOptionsAction(messageJSON, data);
    }
  }

  private processTextWidget(messageJSON, data: ChatData) {
    const contextData = {
      chatData: data,
      message: messageJSON.content
    };
    this.createDynamicComponent('text', contextData);
  }

  private processTableWidget(messageJSON, data: ChatData) {
    this.localMessageJSON = messageJSON;
    const contextData = {
      chatData: data,
      message: messageJSON
    };
    this.createDynamicComponent('table', contextData);
  }

  private proccessConfirmAction(messageJSON, data: ChatData) {
    const contextData = {
      chatData: data,
      message: messageJSON
    };
    this.createDynamicComponent('confirmAction', contextData);
  }

  private proccessOptionsAction(messageJSON, data: ChatData) {
    const contextData = {
      chatData: data,
      message: messageJSON
    };
    this.createDynamicComponent('options', contextData);
  }

  getChatResponse(chat: ChatData) {
    if (chat.accountId === 'ChatBot') {
      return chat.response;
    } else {
      return chat.message;
    }
  }

  private createDynamicComponent(type, contextData) {
    if (type) {
      this.dynamicComponentCount++;
      const componentType = this.DYNAMIC_COMPONENTS[type];

      const factory = this.componentFactoryResolver.resolveComponentFactory(
        componentType
      );
      this.componentRef = this.messageList.createComponent(factory);

      // supply extra information
      const componentInstance = <BaseDynamicComponent>(
        this.componentRef.instance
      );
      componentInstance.context = contextData;
      componentInstance.id = this.dynamicComponentCount;

      this.dynamicComponentMap.set(
        this.dynamicComponentCount,
        this.componentRef
      );
    }
  }

  onKeydownEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }  
  
}

export class Message {
  private text: string;
  private messageSide: string;

  constructor(text, messageSide) {
    this.text = text;
    this.messageSide = messageSide;
  }

  draw() {
    const $message = $(
      $('.message_template')
        .clone()
        .html()
    );
    $message
      .addClass(this.messageSide)
      .find('.text')
      .html(this.text);
    $('.messages').append($message);
    return setTimeout(function() {
      return $message.addClass('appeared');
    }, 0);
  }
}
