import { Directive, OnInit, Input, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';

@Directive({
  selector: 'bkInlcudePartial'
})
export class IncludePartialDirective implements OnInit {
  @Input() private src: string;

  @Input() private type: string;

  constructor(private element: ElementRef, private http: Http) {}

  private parseTemplate(res: Response) {
    if (this.type !== 'template') {
      // this.element.nativeElement.innerHTML = res.text();
      this.setInnerHtml(this.element.nativeElement, res.text());
    } else if (this.type === 'template') {
        const head = document.head || document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(res.text()));
        head.appendChild(style);
    }
  }

  private setInnerHtml(element: HTMLBaseElement, html) {
    element.innerHTML = html;
    Array.from(element.querySelectorAll('script')).forEach(function(currentEl) {
      const newEl = document.createElement('script');
      Array.from(currentEl.attributes).forEach(function(attr) {
        newEl.setAttribute(attr.name, attr.value);
      })
      newEl.appendChild(document.createTextNode(currentEl.innerHTML));
      currentEl.parentNode.replaceChild(newEl, currentEl);
    })
  }

  updatePartial(newSrc: string) {
      this.src = newSrc;
      this.ngOnInit();
  }

  ngOnInit() {
      this.http.get(this.src)
      .map(res => this.parseTemplate(res))
      .catch(this.handleTemplateError.bind(this)).subscribe(res => {
          console.log(res);
      })
  }

  private handleTemplateError(err) {

  }
}
