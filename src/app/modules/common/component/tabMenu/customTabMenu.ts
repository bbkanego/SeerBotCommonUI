import {Component, EventEmitter, Output} from '@angular/core';
import {DomHandler, MenuItem, TabMenu} from 'primeng/primeng';

@Component({
  selector: 'customTabMenu',
  template: `
        <div [ngClass]="'ui-tabmenu ui-widget ui-widget-content ui-corner-all'" [ngStyle]="style" [class]="styleClass">
            <ul class="ui-tabmenu-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
                <li *ngFor="let item of model"
                    [ngClass]="{'ui-tabmenuitem ui-state-default ui-corner-top':true,'ui-state-disabled':item.disabled,
                        'ui-tabmenuitem-hasicon':item.icon,'ui-state-active':activeItem==item}">
                    <a *ngIf="!item.routerLink" [href]="item.url||'#'" class="ui-menuitem-link ui-corner-all" (click)="itemClick($event,item)"
                        [attr.target]="item.target">
                        <span class="ui-menuitem-icon fa" [ngClass]="item.icon"></span>
                        <span class="ui-menuitem-text">{{item.label}}</span>
                    </a>
                    <a *ngIf="item.routerLink" [routerLink]="item.routerLink" [routerLinkActive]="'ui-state-active'"
                    class="ui-menuitem-link ui-corner-all" (click)="itemClick($event,item)"
                        [attr.target]="item.target" [queryParams]="item.queryParams">
                        <span class="ui-menuitem-icon fa" [ngClass]="item.icon"></span>
                        <span class="ui-menuitem-text">{{item.label}}</span>
                    </a>
                </li>
            </ul>
        </div>
    `,
  providers: [DomHandler]
})
export class CustomTabMenu extends TabMenu {
  @Output() onSelect: EventEmitter<any> = new EventEmitter();


  itemClick(event: Event, item: MenuItem): void {
    super.itemClick(event, item);

    this.onSelect.emit({
      selectedItem: item
    });
  }
}
