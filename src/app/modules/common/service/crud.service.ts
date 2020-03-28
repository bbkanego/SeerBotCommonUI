import {Injector} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from './httpClient.helper';

export abstract class CrudService<T> {

  private httpClient: HttpClient;

  constructor(private injector: Injector) {
    this.httpClient = this.injector.get(HttpClient);
  }

  public abstract initModel(): Observable<T>;

  public abstract save(model: T): Observable<T>;

  public abstract delete(id: string): Observable<T>;

  public abstract update(model: T): Observable<T>;

  public abstract getById(id: string): Observable<T>;

  public abstract getAll(): Observable<T[]>;

  protected getRequest(url: string): Observable<T> {
    return this.httpClient.get(url)
      .map((res: Response) => res.json());
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected postRequest(url: string, model: T) {
    return this.httpClient.post(url, JSON.stringify(model))
      .map((res: Response) => res.json());
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected putRequest(url: string, model: T) {
    return this.httpClient.put(url, JSON.stringify(model))
      .map((res: Response) => res.json());
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected deleteRequest(url: string, id: string) {
    return this.httpClient.delete(url, id)
      .map((res: Response) => res.json());
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  protected postMultiPartRequest(url: string, model: FormData) {
    return this.httpClient.postMultipart(url, model)
      .map((res: Response) => res.json());
      // .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
