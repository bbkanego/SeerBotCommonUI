import {AfterViewInit, Component, ElementRef, forwardRef, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR} from '@angular/forms';
// import {FocusForwarderDirective} from '../../../common/directive/focusForwarder.directive';
import {Dialog, TreeNode} from 'primeng';
import {BaseCustomComponent} from '../baseCustom.component';
import * as $ from 'jquery';

export interface SeerTreeNode {
  children?: SeerTreeNode[],
  label: string,
  code: string,
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  locked?: boolean,
  draggable?: boolean,
  droppable?: boolean
}

const noop = () => {
};

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
  selector: 'seer-treeChooser',
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
  //@Input() treeNodes: TreeNode[];
  @Input() treeNodes: SeerTreeNode[];

  // for formsModule based pages
  @Input() name: string;
  @Input() inline = true;

  showTree = false;
  nodeSelected = false;
  @ViewChild(Dialog) treeDialog: Dialog;
  @ViewChild('chooserInput') chooserInput: ElementRef;
  $nativeChooserInputObj;
  testMe: any;
  private treeSelection: any[];
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
