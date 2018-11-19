import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomFormControl } from './modules/common/model/controls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  testForm: FormGroup;

  ngOnInit() {
    this.testForm = new FormGroup(
      {
        'name': new CustomFormControl('Bhushan', null),
        'lastName': new CustomFormControl('Kane', null)
      }
    );
  }

  save() {
    
  }
}
