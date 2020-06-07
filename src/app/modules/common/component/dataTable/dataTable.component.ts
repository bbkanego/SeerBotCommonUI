import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Utils} from '../../../common/service/utils.service';
import {Option} from '../../../common/model/models';

/**
 * This allows you to include specific template types in components that you can work with
 * The template can be defined as follows:
 * <ng-template let-col="column" let-record="rowData" bkTemplate="body">
 * <ng-template let-col="column" let-record="rowData" bkTemplate="blah">
 * <ng-template let-col="column" let-record="rowData" bkTemplate="foo">
 * Thus above we have 3 templates of type "body, blah, foo"
 */
@Directive({
  selector: '[bkTemplate]',
  host: {}
})
export class BkTemplateDirective {
  @Input('bkTemplate') name: string;

  constructor(public template: TemplateRef<any>) {
  }

  getType(): string {
    return this.name;
  }
}

@Directive({
  selector: 'bk-column'
})
export class DataColumnComponent implements OnInit, AfterContentInit {
  @Input() field;
  @Input() header;
  @Input() style: string;
  @Input() sort: boolean = false;
  @ContentChildren(BkTemplateDirective) templates: QueryList<any>;

  /**
   * This template allows to user to alter how the each cell of the row will be displayed
   */
  bodyTemplate = null;
  // allows user to alter the header display!
  headerTemplate = null;

  constructor() {
  }

  ngAfterContentInit(): void {
    this.templates.forEach(item => {
      switch (item.getType()) {
        case 'body':
          this.bodyTemplate = item.template;
          break;
        case 'header':
          this.headerTemplate = item.template;
          break;
        default:
          this.bodyTemplate = item.template;
          break;
      }
    });
  }

  ngOnInit() {
    //this.viewContainerRef.createEmbeddedView(this.template);
  }
}

@Directive({
  selector: 'bk-columnHeaderTemplateLoader'
})
export class ColumnHeaderTemplateLoader implements OnInit, OnDestroy {
  @Input() column: any;
  @Input() records: any[];
  @Input() rowIndex: any;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    /**
     * Whats happening below:
     * Below the viewContainer is creating an embedded view from a "body" template (first arg) that was inserted inside the
     * column "component" when the table component was used. The second arg is the context object which we are supplying
     * to the template to work with at runtime.
     */

    this.view = this.viewContainer.createEmbeddedView(
      this.column.headerTemplate,
      {
        // this is the context
        column: this.column,
        records: this.records,
        rowIndex: this.rowIndex
      }
    );
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Directive({
  selector: 'bk-columnBodyTemplateLoader'
})
export class ColumnBodyTemplateLoader implements OnInit, OnDestroy {
  @Input() column: any;

  @Input() rowData: any;

  @Input() rowIndex: number;

  view: EmbeddedViewRef<any>;

  constructor(public viewContainer: ViewContainerRef) {
  }

  ngOnInit() {
    /**
     * Whats happening below:
     * Below the viewContainer is creating an embedded view from a "body" template (first arg) that was inserted inside the
     * column "component" when the table component was used. The second arg is the context object which we are supplying
     * to the template to work with at runtime.
     */

    this.view = this.viewContainer.createEmbeddedView(
      this.column.bodyTemplate,
      {
        // this is the context
        column: this.column,
        rowData: this.rowData,
        rowIndex: this.rowIndex
      }
    );
  }

  ngOnDestroy() {
    this.view.destroy();
  }
}

@Component({
  selector: 'bk-datatable',
  templateUrl: './dataTable.component.html',
  styleUrls: ['./dataTable.component.css']
})
export class DataTableComponent implements AfterViewInit, OnInit, OnChanges {
  // original records
  @Input() records: any[] = [];
  filteredRecords: any[] = [];

  @ContentChildren(DataColumnComponent)
  dataColumns: QueryList<DataColumnComponent>;
  dataColumnsArray = [];
  start: string = '0';
  end: string = '9';
  @Input() pageSize: number = 20;
  numberOfPages: number;
  numberOfPagesArray: number[] = [];

  pagingStart: string = '0';
  pagingEnd: string = '5';

  currentPage: number = 1;

  sortAsc: boolean = true;
  currentSortColumn = '';
  @Input() sortBy: any[] = [];
  sortingImage: string = 'glyphicon-resize-vertical';

  @Input() smallDeviceHeader: string;
  @Input() noResultsFoundHeader = 'No items found for your search criteria';

  // this will be NgModel bound
  filterValue: string;
  // this user will define what props to use for filtering
  @Input() filterProps: Option[];
  // this will be NgModel bound
  filterProp: string;

  constructor(private utils: Utils, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.filteredRecords = this.records;
  }

  filterResults(event) {
    const filterValue = this.filterValue;
    const filterOption = this.filterProp;
    if (filterOption && filterValue) {
      this.filteredRecords = this.utils.filterOnContains(
        this.records,
        this.filterProp,
        this.filterValue
      );

      this.calculateNumOfPages();
      this.currentPage = 1;
      this.highLightPageTrigger(this.currentPage);
      this.goToPage(this.currentPage);
    }
  }

  clearFilter(event) {
    this.filterValue = null;
    this.filterProp = null;
    this.filteredRecords = this.utils.createDeepCopy(this.records);

    this.calculateNumOfPages();
    this.currentPage = 1;
    this.highLightPageTrigger(this.currentPage);
    this.goToPage(this.currentPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let recordsCurrentValue = changes['records'].currentValue;
    if (recordsCurrentValue) {
      if (this.sortBy.length > 0) {
        this.records = this.utils.sortBy(this.records, this.sortBy);
      }
      this.filteredRecords = this.records;
      this.calculateNumOfPages();
      this.highLightPageTrigger(this.currentPage);
    }
  }

  highLightPageTrigger(page: number) {
    $('.pageTrigger').removeClass('active');
    $('.' + page + 'Trigger').addClass('active');
    //$('.pageTrigger').addClass('active');
  }

  goToPage(goToPage: number) {
    this.highLightPageTrigger(goToPage);

    if (goToPage > this.numberOfPages) {
      return;
    }
    if (goToPage < 1) {
      return;
    }

    let isMoveForward: boolean = true;
    if (goToPage < this.currentPage) {
      isMoveForward = false;
    }

    this.currentPage = goToPage;
    this.end = String(this.pageSize * goToPage);
    this.start = String(parseInt(this.end) - this.pageSize);

    if (
      parseInt(this.pagingStart) + 1 < goToPage &&
      goToPage < parseInt(this.pagingEnd)
    ) {
      return;
    }

    // I am on the last page...
    if (goToPage === this.numberOfPages) {
      this.pagingEnd = String(this.numberOfPages);
      this.pagingStart = String(parseInt(this.pagingEnd) - 5);
    } else if (goToPage === 1) {
      this.pagingStart = '0';
      this.pagingEnd = String(parseInt(this.pagingStart) + 5);
    } else {
      if (isMoveForward) {
        this.pagingStart = String(parseInt(this.pagingStart) + 1);
        this.pagingEnd = String(parseInt(this.pagingEnd) + 1);
      } else {
        this.pagingStart = String(parseInt(this.pagingStart) - 1);
        this.pagingEnd = String(parseInt(this.pagingEnd) - 1);
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataColumnsArray = this.dataColumns.toArray();
    /**
     * Since the data columns array is getting updated after the digest/verification process, we need to explicitely call
     * the detect changes methos.
     */
    this.cd.detectChanges();
  }

  sortColumnClass(column) {
    return column.sort ? 'sortColumn' : '';
  }

  sortColumn(event, column: DataColumnComponent, sortAscFlag: boolean) {
    if (!column.sort) {
      return;
    }
    this.sortAsc = sortAscFlag;
    this.currentSortColumn = column.field;
    if (this.sortAsc) {
      this.sortingImage = 'glyphicon-chevron-up';
      this.filteredRecords = this.utils.sortBy(
        this.filteredRecords,
        column.field
      );
      this.sortAsc = false;
    } else {
      this.sortingImage = 'glyphicon-chevron-down';
      this.filteredRecords.reverse();
      this.sortAsc = true;
    }
    event.stopPropagation();
  }

  isAnyColumnSorted() {
    let isSorted = false;
    for (const dataColumn of this.dataColumnsArray) {
      if (dataColumn.sort) {
        isSorted = dataColumn.sort;
        break;
      }
    }
    return isSorted;
  }

  getColumnStyle(dataColumn: DataColumnComponent) {
    if (dataColumn) {
      return dataColumn.style;
    } else {
      return '';
    }
  }

  private calculateNumOfPages(): void {
    this.numberOfPagesArray = [];
    if (this.filteredRecords && this.filteredRecords.length > 0) {
      const len = this.filteredRecords.length;
      if (len > this.pageSize) {
        const remainder = len % this.pageSize;
        this.numberOfPages = Math.trunc(len / this.pageSize);
        if (remainder != 0) {
          this.numberOfPages += 1;
        }
      } else {
        this.numberOfPages = 1;
      }
    }

    for (let i = 1; i <= this.numberOfPages; i++) {
      this.numberOfPagesArray.push(i);
    }
    this.end = String(this.pageSize);
  }
}
