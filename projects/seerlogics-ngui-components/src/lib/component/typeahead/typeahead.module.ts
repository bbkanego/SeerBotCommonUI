import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TypeaheadComponent} from './typeahead.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DirectiveModule} from '../../directive/directive.module';

@NgModule({
  declarations: [TypeaheadComponent],
  exports: [
    TypeaheadComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, DirectiveModule
  ]
})
export class TypeaheadModule { }
