import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  IRestService,
  IRestQueryParam,
  IRestResponse,
} from '@jacquesparis/objects-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpRestService implements IRestService {
  constructor(protected httpClient: HttpClient) {}
  public async get<T>(
    uri: string,
    queryParams?: IRestQueryParam
  ): Promise<IRestResponse<T>> {
    const response: IRestResponse<T> = { result: null, status: null };
    const options: any = { responseType: 'json', observe: 'response' };
    if (queryParams && 0 < Object.keys(queryParams).length) {
      options.params = {};
      Object.keys(queryParams).forEach((key) => {
        if (Array.isArray(queryParams[key])) {
          options.params[key] = [];
          queryParams[key].array.forEach((element) => {
            options.params[key].push(JSON.stringify(element));
          });
        } else {
          options.params[key] = JSON.stringify(queryParams[key]);
        }
      });
    }
    try {
      const httpResponse: HttpResponse<T> = (await ((this.httpClient.get(
        uri,
        options
      ) as unknown) as Observable<
        HttpResponse<T>
      >).toPromise()) as HttpResponse<T>;
      response.result = httpResponse.body;
      response.status = httpResponse.status;
    } catch (error) {
      throw error;
    }
    return response;
  }
}
