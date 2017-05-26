import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { PushToken } from "@ionic/cloud-angular";
import { Story, RemoteChannel, AwsEndpointResponse, OEmbedVideo } from '../app/interfaces';
import { IdbService } from './idb';
import { AuthService } from './auth';

import { Observable, ObservableInput } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  apiversion: string = 'v1';
  apiurl: string = 'https://appapi.cgitoday.com/api/'+this.apiversion;
  authOptions: RequestOptions;
  constructor(private http: Http, private idb: IdbService, private auth: AuthService) {

  }

  async validateToken(): Promise<boolean> {
    return this.get('/validatetoken', response => {
      return response.json().valid;
    }, this.handleError).toPromise();
  }

  getAwsEndpoint(t: PushToken): Observable<AwsEndpointResponse> {
    return this.post('/endpoint', { token: t.token }, this.extractData, this.handleError);
  }

  getAwsDevEndpoint(t: PushToken): Observable<AwsEndpointResponse> {
    console.log("current token:");
    console.log(this.auth.token);
    return this.post('/endpoint/dev', { token: t.token }, this.extractData, this.handleError);
  }

  getExplorePage(page_num: number): Observable<any> {
    return this.get('/explore/page/'+page_num, response => {
      return {
        page_size: response.headers.get('Page-Size'),
        stories: response.json()
      };
    }, this.handleError);
  }

  getStory(story_id: number): Observable<Story> {
    return this.get('/post/'+story_id, this.extractData, this.handleError);
  }

  getChannels(): Observable<RemoteChannel[]> {
    return this.get('/categories', this.extractData, this.handleError);
  }

  getFeedPage(page_num: number, channels: number[]): Observable<any> {
    return this.get('/feed/page/'+page_num+'/'+channels.join(','), response => {
      return {
        page_size: response.headers.get('Page-Size'),
        stories: response.json()
      };
    }, this.handleError);
  }

  getVimeoEmbedHtml(video_id): Observable<OEmbedVideo> {
    return this.http.get('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/'+video_id)
              .map(this.extractData)
              .catch(this.handleError);
  }

  private get(endpoint: string, extractData, handleError): Observable<any> {
    //return Observable.fromPromise(this.checkForToken()).mergeMap(hasToken => {
      return this.http.get(this.apiurl+endpoint, this.authOptions)
      .map(extractData)
      .catch(handleError);
    //});
  }

  private post(endpoint: string, data: any, extractData, handleError): Observable<any> {
    //return Observable.fromPromise(this.checkForToken()).mergeMap(hasToken => {
      return this.http.post(this.apiurl+endpoint, data, this.authOptions)
      .map(extractData)
      .catch(handleError);
    //});
  }

  /*private async checkForToken(): Promise<boolean> {
    if (this.auth.token !== null) {
      this.authOptions = new RequestOptions({
        headers: new Headers({
          'Auth-Token': this.auth.token
        })
      });
    } else {
    let hasToken =  await this.idb.hasToken();
      if (hasToken) {
        console.log("setting auth headers for http requests");
        this.auth.token = await this.idb.getToken();
        this.authOptions = new RequestOptions({
          headers: new Headers({
            'Auth-Token': this.auth.token
          })
        });
        return true;
      } else {
        return false;
      }
    }
  }*/

  public setAuthHeaders(): void {
    console.log('setting auth headers using token '+this.auth.token);
    this.authOptions = new RequestOptions({
      headers: new Headers({
        'Auth-Token': this.auth.token
      })
    });
  }

  private extractData(response: Response) {
    return response.json();
  }

  private handleError(error: Response | any, caught: Observable<any>): ObservableInput<{}> {
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }

}
