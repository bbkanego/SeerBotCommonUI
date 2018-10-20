import {
  Component,
  Input,
  ViewChild,
  forwardRef,
  OnInit,
  HostListener,
  ElementRef,
  AfterViewInit,
  Injector
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormBuilder
} from '@angular/forms';
import { TreeNode } from 'primeng/primeng';
import { FormGroup } from '@angular/forms';
// import {FocusForwarderDirective} from '../../../common/directive/focusForwarder.directive';
import { Dialog } from 'primeng/primeng';
import { BaseCustomComponent } from '../../../common/component/BaseCustomComponent.component';
import * as JQuery from 'jquery';

const $ = JQuery;

const noop = () => {};

/**
 * http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
 * https://medium.com/@paynoattn/custom-angular2-form-components-using-formbuilder-bb9068cd4057
 * https://stackoverflow.com/questions/40513450/controlvalueaccessor-with-multiple-formcontrol-in-child-component/40550141#40550141
 */

export const TREE_CHOOSER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TreeChooserComponent),
  multi: true
};

@Component({
  selector: 'bk-treeChooser',
  templateUrl: './treeChooser.component.html',
  styleUrls: ['./treeChooser.component.css'],
  providers: [TREE_CHOOSER_CONTROL_VALUE_ACCESSOR],
  // https://stackoverflow.com/questions/35712379/angular2-close-dropdown-on-click-outside-is-there-an-easiest-way
  host: {
    '(document:click)': 'onClickOutside($event)'
  }
})
export class TreeChooserComponent extends BaseCustomComponent
  implements OnInit, ControlValueAccessor, AfterViewInit {
  @Input() treeNodes: TreeNode[];

  // for formsModule based pages
  @Input() name: string;
  @Input() inline = true;

  showTree = false;

  private treeSelection: any[];

  nodeSelected = false;

  @ViewChild(Dialog) treeDialog: Dialog;
  @ViewChild('chooserInput') chooserInput: ElementRef;
  $nativeChooserInputObj;

  testMe: any;

  // The internal data model
  private innerValue: any = '';

  // Placeholders for the callbacks which are later provided
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor(
    private fb: FormBuilder,
    private eRef: ElementRef,
    injector: Injector
  ) {
    super(injector);
  }

  ngAfterViewInit() {
    this.$nativeChooserInputObj = $(this.chooserInput.nativeElement);
    this.$nativeChooserInputObj.attr('errorContainerId', this.controlId);
  }

  ngOnInit(): void {
    if (this.currentFormGroup == null) {
      this.currentFormGroup = this.currentForm.form;
    }

    if (this.controlId == null) {
      this.controlId = this.currentFormControlName;
    }
  }

  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  // @HostListener('focus', ['$event'])
  onIconClick($event) {
    this.showTree = true;
    this.nodeSelected = false;
    console.log('---------------->>>> ' + $event);
    if (!this.inline) {
      this.treeDialog.visible = true;
    }
  }

  hideTreeDialog() {
    this.nodeSelected = true;
    if (!this.inline) {
      this.treeDialog.visible = false;
    }
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  /**
   * This captures any clicks outside of the component. That is clicked anywhere in the document.
   * Then we check what the target of the click event was. And compare that with the native element
   * which makes up the component.
   * @param event
   */
  onClickOutside(event) {
    // due to bug with dialog onHide callbacks I have to do this below workaround
    if (event.target.className === 'fa fa-fw fa-close') {
      this.treeDialog.visible = false;
      return;
    }

    if (this.nodeSelected) {
      this.treeDialog.visible = false;
      return;
    }

    if (this.eRef.nativeElement.contains(event.target)) {
      this.showTree = true;
      this.treeDialog.visible = true;
    } else {
      this.showTree = false;
      this.treeDialog.visible = false;
    }
  }

  nodeSelect(event) {
    const label: string = event.node.label;
    if (label) {
      console.log('Selected node is = ' + label);
      if (this.currentFormGroup) {
        this.currentFormGroup.controls[this.currentFormControlName].patchValue(
          label
        );
      }
    }

    this.nodeSelected = true;

    // this.hideTreeDialog();

    this.treeSelection = [];
    this.treeSelection.push({
      severity: 'info',
      summary: 'Node Selected',
      detail: event.node.label
    });
  }

  nodeUnselect(event) {
    this.treeSelection = [];
    this.treeSelection.push({
      severity: 'info',
      summary: 'Node Unselected',
      detail: event.node.label
    });
  }

  onBlurEvent($event) {
    this.elementBlurred = true;
    const widgetObj = $(this.chooserInput.nativeElement);
    const id = widgetObj.parent().attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit($event);
  }
}
