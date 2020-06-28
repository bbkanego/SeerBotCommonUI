import {AfterViewInit, Component, ElementRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseCustomComponent} from '../baseCustom.component';

@Component({
  selector: 'seer-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent extends BaseCustomComponent implements OnInit, AfterViewInit {
  @Input() intent = 'default';
  // button or submit
  @Input() type = 'button';
  @Input() label = 'None';
  @Input() icon: string = null;
  @Input() size = 'NONE';
  @Input() disabled = false;
  @Input() blockLevel = false; // block level elements occupy the full width of the parent
  @Input() class = '';
  @Input() style: string = null;
  @Input() tooltip;
  @Input() tootipPosition = 'bottom';

  @ViewChild('targetButton') targetButton: ElementRef;

  private buttonTypes = {
    'success': 'btn btn-success active', 'danger': 'btn btn-danger active',
    'default': 'btn btn-default active', 'primary': 'btn btn-primary active',
    'info': 'btn btn-info active', 'warning': 'btn btn-warning active',
    'link': 'btn btn-link active'
  };

  private buttonSizes = {'small': 'btn-sm', 'large': 'btn-lg', 'NONE': ''};

  constructor(injector: Injector) {
    super(injector);
  }

  getButtonClass(): string {
    return this.buttonTypes[this.intent] + ' ' + this.buttonSizes[this.size] + ' ' + this.class
      + ' button-xs';
    // + " " + (this.blockLevel === true)? "btn-block": "";
  }

  getStyle(): {} {
    return this.style ? JSON.parse(this.style) : {};
  }

  clickEvent(event) {
    this.onClick.emit(event);
  }

  ngAfterViewInit(): void {
    // $(this.targetButton.nativeElement).tooltip({placement: this.tootipPosition});
  }

  ngOnInit(): void {
    if (this.currentFormGroup == null && this.currentForm != null) {
      this.currentFormGroup = this.currentForm.form;
    }
  }

  isButtonDisabled(): boolean {
    return this.disabled || (this.currentFormGroup != null && this.currentFormGroup.invalid
      && this.currentForm != null && this.currentForm.submitted);
  }
}
