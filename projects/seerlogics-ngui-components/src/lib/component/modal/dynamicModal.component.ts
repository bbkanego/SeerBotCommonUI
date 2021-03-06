// http://jasonwatmore.com/post/2017/01/24/angular-2-custom-modal-window-dialog-box
import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Injector, Input,
  NgModuleFactoryLoader,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SystemJsNgModuleLoader,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {NotificationService} from '../../service/notification.service';
import {ErrorMessagesComponent} from '../errorMessages/errorMessages.component';

export interface DynamicModalMetadata {
  extraData: {
    showCloseX?: boolean,
    modalHeader?: string,
    lazyModule?: boolean
  },
  component: any;
}

/**
 * http://stackoverflow.com/questions/34513558/angular-2-0-and-modal-dialog
 * https://netbasal.com/dynamically-creating-components-with-angular-a7346f4a982d
 * https://indepth.dev/here-is-what-you-need-to-know-about-dynamic-components-in-angular/
 */
@Component({
  templateUrl: './dynamicModal.component.html',
  selector: 'seer-dynamic-modal',
  styleUrls: ['./dynamicModal.component.css'],
  providers: [
    {
      provide: NgModuleFactoryLoader,
      useClass: SystemJsNgModuleLoader
    }
  ]
})
export class DynamicModalComponent implements OnInit, OnDestroy {
  public static SHOW_DYNAMIC_MODAL = 'ShowDynamicModal';
  visible = false;
  visibleAnimate = false;
  @Input() showCloseX = false;
  @Output() modalState: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('theBody', {read: ViewContainerRef}) theBodyContainer: ViewContainerRef;
  @ViewChild('theError', {read: ViewContainerRef}) theErrorContainer: ViewContainerRef;
  theHeader: string;
  modalShim;
  private componentRef;
  private errorComponentRef;

  constructor(private notificationService: NotificationService, private injector: Injector,
              private componentFactoryResolver: ComponentFactoryResolver,
              private renderer: Renderer2,
              private _injector: Injector,
              private loader: NgModuleFactoryLoader) {
  }

  ngOnInit(): void {
    this.notificationService.onNotification().subscribe((eventData: any) => {
      if (eventData.type === DynamicModalComponent.SHOW_DYNAMIC_MODAL) {
        if (this.theBodyContainer) {
          this.theBodyContainer.clear();
        }
        if (this.theErrorContainer) {
          this.theErrorContainer.clear();
        }

        const dynamicModalMetadata: DynamicModalMetadata = eventData.message;
        const extraData = dynamicModalMetadata.extraData;
        this.showCloseX = extraData.showCloseX;
        if (extraData.lazyModule) {
          this.loadSubComponent(extraData);
          this.theHeader = extraData.modalHeader;

          // error component
          const errorFactory = this.componentFactoryResolver.resolveComponentFactory(ErrorMessagesComponent);
          this.errorComponentRef = this.theErrorContainer.createComponent(errorFactory);
        } else {
          const componentToAppend = dynamicModalMetadata.component;
          const factory = this.componentFactoryResolver.resolveComponentFactory(componentToAppend);
          this.componentRef = this.theBodyContainer.createComponent(factory);
          this.componentRef.instance.extraDynamicData = extraData;
          this.theHeader = extraData.modalHeader;

          // error component
          const errorFactory = this.componentFactoryResolver.resolveComponentFactory(ErrorMessagesComponent);
          this.errorComponentRef = this.theErrorContainer.createComponent(errorFactory);
        }
        // once component inserted show the modal!
        this.show();
      }
    });
  }

  ngOnDestroy() {
    this.theErrorContainer.clear();
    this.theBodyContainer.clear();
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    if (this.errorComponentRef) {
      this.errorComponentRef.destroy();
    }
  }

  show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 200);
    this.modalState.emit('Shown!');
    /* this.modalShim = this.renderer.createElement('div');
    this.renderer.addClass(this.modalShim, 'backdrop');
    this.renderer.appendChild(document.body, this.modalShim); */
  }

  hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
    this.modalState.emit('hidden');
    // this.renderer.removeChild(document.body, this.modalShim);
  }

  /**
   * https://blog.angularindepth.com/here-is-what-you-need-to-know-about-dynamic-components-in-angular-ac1e96167f9e
   * @param lazyModule
   */
  private loadSubComponent(extraData) {
    const moduleNameString = extraData.lazyModule.modulePath;
    const componentName = extraData.lazyModule.componentName;
    this.loader.load(moduleNameString).then((factory) => {
      const module = factory.create(this._injector);
      const r = module.componentFactoryResolver;
      const cmpFactory = r.resolveComponentFactory(componentName);

      // create a component and attach it to the view
      this.componentRef = cmpFactory.create(this._injector);
      this.componentRef.instance.extraDynamicData = extraData;
      this.theBodyContainer.insert(this.componentRef.hostView);
    });
  }
}
