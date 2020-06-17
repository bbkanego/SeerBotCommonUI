import {
  AfterViewChecked,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {StompService} from '../../service/stomp.service';
import {AuthenticationService} from '../../service/authentication.service';
import {Notification, NotificationService} from '../../service/notification.service';
import {ChatData} from '../../model/models';
import {TextChatComponentComponent} from './text-chat-component.component';
import {TableChatComponentComponent} from './table-chat-component.component';
import {BaseDynamicComponent} from '../baseDynamic.component';
import {Subscription} from 'rxjs';
import {ConfirmChatComponent} from './confirm-chat.component';
import {Router} from '@angular/router';
import {OptionsChatComponent} from './options-chat.component';
import {HttpClientHelper} from '../../service/httpClient.helper';
import {environment} from '../../environments/environment';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-bk-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [StompService]
})
export class ChatComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
  clickedColumn: any;
  localMessageJSON: any;
  localEventSubscription: Subscription;
  @ViewChild('chatbox') chatBox: ElementRef;
  @ViewChild('chatMessageBoxContainer') chatMessageBoxContainer: ElementRef;
  @ViewChild('chatMessageBox', {read: ViewContainerRef})
  chatMessageBox: ViewContainerRef;
  showChatBox = false;
  @Input() showChatBoxAfterSeconds = 10000;
  @Input() hostUrl: string;
  @Input() subscriptionUrl: string;
  chatMessages: ChatData[] = [];
  componentRef: ComponentRef<{}>;
  private dynamicComponentMap: Map<number, ComponentRef<{}>> = new Map();
  private dynamicComponentCount = 0;
  private subscription: any;
  private headers = {};
  private chatSessionId;
  private previousChatId;
  private currentSessionId;
  private scrollToTheBottom = false;
  private initiateMessageSent = false;
  private DYNAMIC_COMPONENTS = {
    'text': TextChatComponentComponent,
    'table': TableChatComponentComponent,
    'confirmAction': ConfirmChatComponent,
    'options': OptionsChatComponent
  };

  constructor(private httpClient: HttpClientHelper, private stomp: StompService, private componentFactoryResolver: ComponentFactoryResolver,
              private notificationService: NotificationService, private router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.showChatBox = true;
    }, this.showChatBoxAfterSeconds);

    this.localEventSubscription = this.notificationService.onNotification().subscribe((eventObj: Notification) => {
      if (eventObj.subscriberType === 'clickAndSendResponse') {
        this.clickAndSendResponse(eventObj);
      } else if (eventObj.subscriberType === 'performYesNoAction') {
        this.performYesNoAction(eventObj);
      } else if (eventObj.subscriberType === 'deleteChildComponent') {
        this.deleteChildComponent(eventObj);
      }
    });

    this.setUpStomp();
    this.connect();
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
      uniqueClientId: '',
      authCode: '',
      response: ''
    };
    this.httpClient
      .post(environment.SEND_CHAT_URL, JSON.stringify(message))
      .subscribe(() => {
      });
  }

  sendMessage() {
    this.sendMessageGeneral(this.chatBox.nativeElement.value, true);
  }

  sendMessageGeneral(messageStr: string, appendRequest: boolean) {
    const message: ChatData = {
      id: null,
      message: messageStr,
      chatSessionId: this.chatSessionId,
      accountId: null,
      previousChatId: this.previousChatId,
      currentSessionId: this.currentSessionId,
      uniqueClientId: '',
      authCode: '',
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
    const currentUser = JSON.parse(AuthenticationService.getCurrentUser());
    if (currentUser && currentUser.token) {
      this.headers['Authorization'] = currentUser.token;
    }
    console.log('hostUrl = ' + this.hostUrl + ', subscriptionUrl = ' + this.subscriptionUrl);
    this.stomp.stompConfig = {
      host: this.hostUrl + '?token=' + currentUser.token,
      debug: true,
      headers: this.headers,
      queue: {init: false}
    };
  }

  connect() {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      this.subscription = this.stomp.subscribe(
        this.subscriptionUrl,
        this.handleResponse.bind(this),
        this.headers
      );
      this.sendPingMessage();
    });
  }

  ngAfterViewChecked() {
    if (this.scrollToTheBottom) {
      this.scrollToBottom();
      this.scrollToTheBottom = false;
    }
  }

  scrollToBottom(): void {
    if (this.chatMessageBoxContainer) {
      this.chatMessageBoxContainer.nativeElement.scrollTop = this.chatMessageBoxContainer.nativeElement.scrollHeight;
    }
  }

  appendChatRequest(data: ChatData) {
    if (this.chatMessageBox) {
      const contextData = {
        'chatData': data,
        'message': data.message
      };
      this.createDynamicComponent('text', contextData);
    }
  }

  appendChatResponse(data: ChatData) {
    if (this.chatMessageBox) {
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
  }

  getChatResponse(chat: ChatData) {
    if (chat.accountId === 'ChatBot') {
      return chat.response;
    } else {
      return chat.message;
    }
  }

  private deleteChildComponent(eventObj: Notification) {
    const childComponent: ComponentRef<{}> = this.dynamicComponentMap.get(+eventObj.message);
    childComponent.destroy();
    this.dynamicComponentMap.delete(+eventObj.message);
  }

  private performYesNoAction(eventObj: Notification) {
    if (this.clickedColumn && eventObj.message.response === 'yes') {
      // this.router.navigate([this.clickedColumn.clickActionUrl]);
      this.sendMessageGeneral(eventObj.message.messageJSON.yesResponse
        + '|' + this.clickedColumn.clickItemId, false);
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
      uniqueClientId: '',
      authCode: '',
      response: ''
    };
    this.httpClient
      .post(environment.SEND_CHAT_URL, JSON.stringify(message))
      .subscribe(() => {
        this.chatBox.nativeElement.value = '';
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

  private processTextWidget(messageJSON, data: ChatData) {
    const contextData = {
      'chatData': data,
      'message': messageJSON.content
    };
    this.createDynamicComponent('text', contextData);
  }

  private processTableWidget(messageJSON, data: ChatData) {
    this.localMessageJSON = messageJSON;
    const contextData = {
      'chatData': data,
      'message': messageJSON
    };
    this.createDynamicComponent('table', contextData);
  }

  private proccessConfirmAction(messageJSON, data: ChatData) {
    const contextData = {
      'chatData': data,
      'message': messageJSON
    };
    this.createDynamicComponent('confirmAction', contextData);
  }

  private proccessOptionsAction(messageJSON, data: ChatData) {
    const contextData = {
      'chatData': data,
      'message': messageJSON
    };
    this.createDynamicComponent('options', contextData);
  }

  private createDynamicComponent(type, contextData) {
    if (type) {
      this.dynamicComponentCount++;
      const componentType = this.DYNAMIC_COMPONENTS[type];

      const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
      this.componentRef = this.chatMessageBox.createComponent(factory);

      // supply extra information
      const componentInstance = <BaseDynamicComponent>this.componentRef.instance;
      componentInstance.context = contextData;
      componentInstance.id = this.dynamicComponentCount;

      this.dynamicComponentMap.set(this.dynamicComponentCount, this.componentRef);
    }
  }
}


