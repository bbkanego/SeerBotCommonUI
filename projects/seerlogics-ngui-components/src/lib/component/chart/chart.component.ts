import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {Chart} from 'chart.js';
import {ChartData} from '../../model/models';

@Component({
  selector: 'seer-chart',
  templateUrl: './chart.component.html'
})
export class ChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() chartData: ChartData = null;
  @ViewChild('chart') chartElement: ElementRef;
  chart: Chart = null;
  @Output() onClick: EventEmitter<any> = new EventEmitter();

  reInit(inputChartData) {
    if (this.chart) {
      this.chart.destroy();
      this.initChart(inputChartData);
    }
  }

  initChart(inputChartData) {
    if (this.chartElement) {
      const chartContext = this.chartElement.nativeElement.getContext('2d');

      if (inputChartData) {
        this.chartData = inputChartData;
      }

      this.chartData.options.onClick = (event) => {
        const activePoints = this.chart.getElementsAtEvent(event);
        this.clickEvent(activePoints);
      };

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
    this.initChart(null);
  }

  isAllDataProvided() {
    return this.chartData != null;
  }

  private clickEvent(activePoints) {
    this.onClick.emit(activePoints);
  }
}
