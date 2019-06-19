import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  Injector,
  OnDestroy,
  HostListener
} from '@angular/core';
import { Calendar, DomHandler } from 'primeng/primeng';
import { BaseCustomComponent } from '../../../common/component/BaseCustomComponent.component';
import { Option } from '../../../common/model/models';
import * as _moment from 'moment';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { SUBSCRIBER_TYPES } from '../../../common/model/constants';
import { Subscription } from 'rxjs/Subscription';

const m = _moment;

export interface LocaleSettings {
  firstDayOfWeek?: number;
  dayNames: string[];
  dayNamesShort: string[];
  dayNamesMin: string[];
  monthNames: string[];
  monthNamesShort: string[];
}

@Component({
  selector: 'bk-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateXY(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateXY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateXY(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateXY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
/**
 * Source of Calendar: /Users/bkane/svn/code/angular/primeng-master/components/calendar/calendar.ts
 */
export class DatePickerComponent extends BaseCustomComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private nativeElem: any;
  @ViewChild('bkCalendarInput') bkCalendarInput: ElementRef;
  showDateContainer = false;
  dateSelected = false;
  showOtherMonths = false;
  years: Option[] = [];
  months: Option[] = [];
  days = [];
  dates: any[] = [];
  currentMonth: number;
  currentMonthText: string;
  currentYear: number;

  weekDays: string[];
  private dateInput: HTMLInputElement;

  @Input() dataType = 'date';

  @Input() disabledDates: Array<Date>;

  @Input() disabledDays: Array<number>;

  @Input() disabled: any;

  _minDate: Date;

  _maxDate: Date;

  _isValid = true;

  value: Date;

  focus: boolean;

  filled: boolean;

  inputFieldValue: string = null;

  ticksTo1970: number;

  @Input()
  get minDate(): Date {
    return this._minDate;
  }

  set minDate(date: Date) {
    this._minDate = date;
    this.createMonth(this.currentMonth, this.currentYear);
  }

  @Input()
  get maxDate(): Date {
    return this._maxDate;
  }

  set maxDate(date: Date) {
    this._maxDate = date;
    this.createMonth(this.currentMonth, this.currentYear);
  }

  _locale: LocaleSettings = {
    firstDayOfWeek: 0,
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    monthNamesShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
  };

  constructor(private el: ElementRef, private renderer: Renderer2, injector: Injector) {
    super(injector);
    const tenYearsBack: Date = new Date();
    tenYearsBack.setFullYear(new Date().getFullYear() - 10);
    this.nativeElem = el.nativeElement;
    for (let i = 1; i < 21; i++) {
      const year: string = tenYearsBack.getFullYear() + i + '';
      this.years.push(new Option(year, year));
    }

    for (let i = 0; i < 12; i++) {
      this.months.push(new Option(i + '', this.locale.monthNames[i]));
    }
  }

  get locale() {
    return this._locale;
  }

  /**
   * todo remove this
   */
  getDaysInMonth(month, year) {
    // Since no month has fewer than 28 days
    const date: Date = new Date(year, month, 1);
    console.log('month', month, 'date.getMonth()', date.getMonth());
    while (date.getMonth() === month) {
      this.days.push(date.getDay() + '-' + date.getDate());
      date.setDate(date.getDate() + 1);
    }
  }

  ngOnInit(): void {
    const currentDate: Date = new Date();
    this.currentMonth = currentDate.getMonth();
    this.currentYear = currentDate.getFullYear();
    this.createWeekDays();
    this.createMonth(this.currentMonth, this.currentYear);

    this.initFormGroup();
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.dateInput = <HTMLInputElement>this.bkCalendarInput.nativeElement;

    $(this.dateInput).attr('errorContainerId', this.controlId);
  }

  onInputClick(inputfield, event) {
    if (!this.dateSelected) {
      this.showDateContainer = true;
    } else {
      this.dateSelected = false;
      $(this.dateInput).blur();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    if (!this.nativeElem.contains(event.target)) {
      this.showDateContainer = false;
    }
  }

  createWeekDays() {
    this.weekDays = [];
    let dayIndex = this.locale.firstDayOfWeek;
    for (let i = 0; i < 7; i++) {
      this.weekDays.push(this.locale.dayNamesMin[dayIndex]);
      dayIndex = dayIndex === 6 ? 0 : ++dayIndex;
    }
  }

  onYearSelect(event) {
    this.currentYear = event.target.value;
    this.createMonth(this.currentMonth, this.currentYear);
  }

  onMonthSelect(event) {
    this.currentMonth = event.target.value;
    this.createMonth(this.currentMonth, this.currentYear);
  }

  createMonth(month: number, year: number) {
    this.dates = [];
    this.currentMonth = month;
    this.currentYear = year;
    this.currentMonthText = this.locale.monthNames[month];
    const firstDay = this.getFirstDayOfMonthIndex(month, year);
    const daysLength = this.getDaysCountInMonth(month, year);
    const prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
    const sundayIndex = this.getSundayIndex();
    let dayNo = 1;
    const today = new Date();

    for (let i = 0; i < 6; i++) {
      const week = [];

      if (i === 0) {
        for (
          let j = prevMonthDaysLength - firstDay + 1;
          j <= prevMonthDaysLength;
          j++
        ) {
          const prev = this.getPreviousMonthAndYear(month, year);
          week.push({
            day: j,
            month: prev.month,
            year: prev.year,
            otherMonth: true,
            today: this.isToday(today, j, prev.month, prev.year),
            selectable: this.isSelectable(j, prev.month, prev.year)
          });
        }

        const remainingDaysLength = 7 - week.length;
        for (let j = 0; j < remainingDaysLength; j++) {
          week.push({
            day: dayNo,
            month: month,
            year: year,
            today: this.isToday(today, dayNo, month, year),
            selectable: this.isSelectable(dayNo, month, year)
          });
          dayNo++;
        }
      } else {
        for (let j = 0; j < 7; j++) {
          if (dayNo > daysLength) {
            const next = this.getNextMonthAndYear(month, year);
            week.push({
              day: dayNo - daysLength,
              month: next.month,
              year: next.year,
              otherMonth: true,
              today: this.isToday(
                today,
                dayNo - daysLength,
                next.month,
                next.year
              ),
              selectable: this.isSelectable(
                dayNo - daysLength,
                next.month,
                next.year
              )
            });
          } else {
            week.push({
              day: dayNo,
              month: month,
              year: year,
              today: this.isToday(today, dayNo, month, year),
              selectable: this.isSelectable(dayNo, month, year)
            });
          }

          dayNo++;
        }
      }

      this.dates.push(week);
    }
  }

  getFirstDayOfMonthIndex(month: number, year: number) {
    const day = new Date();
    day.setDate(1);
    day.setMonth(month);
    day.setFullYear(year);

    const dayIndex = day.getDay() + this.getSundayIndex();
    return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
  }

  getDaysCountInMonth(month: number, year: number) {
    return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
  }

  getDaysCountInPrevMonth(month: number, year: number) {
    const prev = this.getPreviousMonthAndYear(month, year);
    return this.getDaysCountInMonth(prev.month, prev.year);
  }

  prevMonth(event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }

    this.createMonth(this.currentMonth, this.currentYear);
    event.preventDefault();
  }

  nextMonth(event) {
    if (this.disabled) {
      event.preventDefault();
      return;
    }

    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }

    this.createMonth(this.currentMonth, this.currentYear);
    event.preventDefault();
  }

  getPreviousMonthAndYear(month: number, year: number) {
    let m, y;

    if (month === 0) {
      m = 11;
      y = year - 1;
    } else {
      m = month - 1;
      y = year;
    }

    return { month: m, year: y };
  }

  getNextMonthAndYear(month: number, year: number) {
    let m, y;

    if (month === 11) {
      m = 0;
      y = year + 1;
    } else {
      m = month + 1;
      y = year;
    }

    return { month: m, year: y };
  }

  getSundayIndex() {
    return this.locale.firstDayOfWeek > 0 ? 7 - this.locale.firstDayOfWeek : 0;
  }

  isSelected(dateMeta): boolean {
    if (this.value) {
      return (
        this.value.getDate() === dateMeta.day &&
        this.value.getMonth() === dateMeta.month &&
        this.value.getFullYear() === dateMeta.year
      );
    } else { return false; }
  }

  isToday(today, day, month, year): boolean {
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  }

  isSelectable(day, month, year): boolean {
    let validMin = true;
    let validMax = true;
    let validDate = true;
    let validDay = true;

    if (this.minDate) {
      if (this.minDate.getFullYear() > year) {
        validMin = false;
      } else if (this.minDate.getFullYear() === year) {
        if (this.minDate.getMonth() > month) {
          validMin = false;
        } else if (this.minDate.getMonth() === month) {
          if (this.minDate.getDate() > day) {
            validMin = false;
          }
        }
      }
    }

    if (this.maxDate) {
      if (this.maxDate.getFullYear() < year) {
        validMax = false;
      } else if (this.maxDate.getFullYear() === year) {
        if (this.maxDate.getMonth() < month) {
          validMax = false;
        } else if (this.maxDate.getMonth() === month) {
          if (this.maxDate.getDate() < day) {
            validMax = false;
          }
        }
      }
    }

    if (this.disabledDates) {
      validDate = !this.isDateDisabled(day, month, year);
    }

    if (this.disabledDays) {
      validDay = !this.isDayDisabled(day, month, year);
    }

    return validMin && validMax && validDate && validDay;
  }

  isDateDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDates) {
      for (const disabledDate of this.disabledDates) {
        if (
          disabledDate.getFullYear() === year &&
          disabledDate.getMonth() === month &&
          disabledDate.getDate() === day
        ) {
          return true;
        }
      }
    }

    return false;
  }

  isDayDisabled(day: number, month: number, year: number): boolean {
    if (this.disabledDays) {
      const weekday = new Date(year, month, day);
      const weekdayNumber = weekday.getDay();
      return this.disabledDays.indexOf(weekdayNumber) !== -1;
    }
    return false;
  }

  daylightSavingAdjust(date) {
    if (!date) {
      return null;
    }
    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
    return date;
  }

  updateFilledState() {
    this.filled = this.inputFieldValue && this.inputFieldValue !== '';
  }

  onDateSelect(event) {
    const day = new Date();
    day.setDate(event.target.innerText);
    day.setMonth(this.currentMonth);
    day.setFullYear(this.currentYear);
    this.inputFieldValue = m(day).format('L');

    if (this.currentFormGroup) {
      this.currentFormGroup.controls[this.currentFormControlName].patchValue(
        this.inputFieldValue
      );
    }

    this.showDateContainer = false;
    this.dateSelected = true;
    // this.nativeElem.blur();

    this.onSelect.emit(this.inputFieldValue);
  }

  // Ported from jquery-ui datepicker formatDate
  formatDate(date, format) {
    if (!date) {
      return '';
    }

    let iFormat,
      lookAhead = match => {
        const matches =
          iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
        if (matches) {
          iFormat++;
        }
        return matches;
      },
      formatNumber = (match, value, len) => {
        let num = '' + value;
        if (lookAhead(match)) {
          while (num.length < len) {
            num = '0' + num;
          }
        }
        return num;
      },
      formatName = (match, value, shortNames, longNames) => {
        return lookAhead(match) ? longNames[value] : shortNames[value];
      },
      output = '',
      literal = false;

    if (date) {
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === '\'' && !lookAhead('\'')) {
            literal = false;
          } else { output += format.charAt(iFormat); }
        } else {
          switch (format.charAt(iFormat)) {
            case 'd':
              output += formatNumber('d', date.getDate(), 2);
              break;
            case 'D':
              output += formatName(
                'D',
                date.getDay(),
                this.locale.dayNamesShort,
                this.locale.dayNames
              );
              break;
            case 'o':
              output += formatNumber(
                'o',
                Math.round(
                  (new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                  ).getTime() -
                    new Date(date.getFullYear(), 0, 0).getTime()) /
                    86400000
                ),
                3
              );
              break;
            case 'm':
              output += formatNumber('m', date.getMonth() + 1, 2);
              break;
            case 'M':
              output += formatName(
                'M',
                date.getMonth(),
                this.locale.monthNamesShort,
                this.locale.monthNames
              );
              break;
            case 'y':
              output += lookAhead('y')
                ? date.getFullYear()
                : (date.getFullYear() % 100 < 10 ? '0' : '') +
                  date.getFullYear() % 100;
              break;
            case '@':
              output += date.getTime();
              break;
            case '!':
              output += date.getTime() * 10000 + this.ticksTo1970;
              break;
            case '\'':
              if (lookAhead('\'')) { output += '\''; } else { literal = true; }

              break;
            default:
              output += format.charAt(iFormat);
          }
        }
      }
    }
    return output;
  }

  onBlurEvent($event) {
    this.elementBlurred = true;
    const widgetObj = $(this.bkCalendarInput.nativeElement);
    const id = widgetObj.parent().attr('id');
    $('#' + id + 'ErrorMsg').hide();
    this.onBlur.emit($event);
  }

  isInvalid() {
    if (this.showDateContainer) {
      return false;
    } else {
      return super.isInvalid();
    }
  }
}
