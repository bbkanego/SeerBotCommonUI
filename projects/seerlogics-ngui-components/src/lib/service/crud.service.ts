import {Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClientHelper} from './httpClient.helper';
import {HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';

export abstract class CrudService<T> {

  private httpClientHelper: HttpClientHelper;

  constructor(private injector: Injector) {
    this.httpClientHelper = this.injector.get(HttpClientHelper);
  }

  public abstract initModel(): Observable<T>;

  public abstract save(model: T): Observable<T>;

  public abstract delete(id: string): Observable<T>;

  public abstract update(model: T): Observable<T>;

  public abstract getById(id: string): Observable<T>;

  public abstract getAll(): Observable<T[]>;

  protected getRequest(url: string): Observable<T> {
    return this.httpClientHelper.get(url).pipe(
      map((res: HttpResponse<any>) => res.body));
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected postRequest(url: string, model: T): Observable<T> {
    return this.httpClientHelper.post(url, JSON.stringify(model)).pipe(
      map((res: HttpResponse<any>) => res.body));
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected putRequest(url: string, model: T): Observable<T> {
    return this.httpClientHelper.put(url, JSON.stringify(model)).pipe(
      map((res: HttpResponse<any>) => res.body));
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected deleteRequest(url: string, id: string): Observable<T> {
    return this.httpClientHelper.delete(url, id).pipe(
      map((res: HttpResponse<any>) => res.body));
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected postMultiPartRequest(url: string, model: FormData): Observable<T> {
    return this.httpClientHelper.postMultipart(url, model).pipe(
      map((res: HttpResponse<any>) => res.body));
    // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
