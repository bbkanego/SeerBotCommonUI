import {Component, OnInit, ElementRef, ViewChild, SimpleChanges, OnDestroy,
  Input, OnChanges, AfterViewInit} from '@angular/core';
import Chart from 'chart.js';

import {BaseCustomComponent} from '../../../common/component/BaseCustomComponent.component';

@Component({
  selector: 'bk-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent extends BaseCustomComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() type:string = 'pie';
  _data:any = null;
  @ViewChild('chart') chartElement:ElementRef;
  chart:any = null;

  @Input() get data():any {
    return this._data;
  }

  set data(val:any) {
    this._data = val;
    this.reInit();
  }

  reInit() {
    if (this.chart) {
      this.chart.destroy();
      this.initChart();
    }
  }

  initChart() {
    if (this.chartElement) {
      let donutCtx = this.chartElement.nativeElement.getContext('2d');
      // https://www.sitepoint.com/introduction-chart-js-2-0-six-examples/
      this.chart = new Chart(donutCtx, {
        type: 'bar',
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          datasets: [{
            backgroundColor: [
              "#2ecc71",
              "#3498db",
              "#95a5a6",
              "#9b59b6",
              "#f1c40f",
              "#e74c3c",
              "#34495e"
            ],
            data: [12, 19, 3, 17, 28, 24, 7]
          }]
        }
      });
    }

    //let context = $(this.chartElement.nativeElement).getContext('2d');
    //alert($(this.chartElement.nativeElement).length)
    /*this.chart = new Chart($(this.chartElement.nativeElement), {
     type: this.type,
     data: this._data
     });*/
  }

  ngOnInit():void {
    //this.initChart();
  }

  ngOnChanges(changes:SimpleChanges):void {
    let recordsCurrentValue = changes['data'].currentValue;
    if (recordsCurrentValue) {
      // https://www.sitepoint.com/introduction-chart-js-2-0-six-examples/

    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  ngAfterViewInit():void {
    this.initChart();
  }

  isAllDataProvided() {
    return this.data != null;
  }
}
