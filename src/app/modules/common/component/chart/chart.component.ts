import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {Chart} from 'chart.js';
import {ChartData} from '../../model/models';

@Component({
  selector: 'app-bk-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() chartData: ChartData = null;
  @ViewChild('chart') chartElement: ElementRef;
  chart: Chart = null;

  reInit() {
    if (this.chart) {
      this.chart.destroy();
      this.initChart();
    }
  }

  initChart() {
    if (this.chartElement) {
      const chartContext = this.chartElement.nativeElement.getContext('2d');
      /**
       * Very good examples here: https://tobiasahlin.com/blog/chartjs-charts-to-get-you-started/
       */
      this.chart = new Chart(chartContext, {
        type: this.chartData.type,
        data: {
          labels: this.chartData.labels,
          datasets: this.chartData.dataSets
        },
        options: this.chartData.options
      });
    }
  }

  ngOnInit(): void {
    // this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  isAllDataProvided() {
    return this.chartData != null;
  }
}
