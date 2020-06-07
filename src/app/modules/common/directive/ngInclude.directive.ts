import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {HttpClientHelper} from '../service/httpClient.helper';
import {HttpResponse} from '@angular/common/http';

@Directive({
  selector: 'bkInlcudePartial'
})
export class IncludePartialDirective implements OnInit {
  @Input() private src: string;

  @Input() private type: string;

  constructor(private element: ElementRef, private httpClientHelper: HttpClientHelper) {
  }

  updatePartial(newSrc: string) {
    this.src = newSrc;
    this.ngOnInit();
  }

  ngOnInit() {
    this.httpClientHelper.get(this.src).subscribe((res: HttpResponse<any>) => {
      this.parseTemplate(res);
    });
  }

  private parseTemplate(res: HttpResponse<any>) {
    if (this.type !== 'template') {
      // this.element.nativeElement.innerHTML = res.text();
      this.setInnerHtml(this.element.nativeElement, res.body());
    } else if (this.type === 'template') {
      const head = document.head || document.getElementsByTagName('head')[0];
      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(res.body()));
      head.appendChild(style);
    }
  }

  private setInnerHtml(element: HTMLBaseElement, html) {
    element.innerHTML = html;
    Array.from(element.querySelectorAll('script')).forEach(function (currentEl) {
      const newEl = document.createElement('script');
      Array.from(currentEl.attributes).forEach(function (attr) {
        newEl.setAttribute(attr.name, attr.value);
      });
      newEl.appendChild(document.createTextNode(currentEl.innerHTML));
      currentEl.parentNode.replaceChild(newEl, currentEl);
    });
  }

  private handleTemplateError(err) {

  }
}
