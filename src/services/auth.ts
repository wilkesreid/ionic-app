import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { IdbService } from './idb'

@Injectable()
export class AuthService {
  token: string = null;
  wpurl: string = "https://cgitoday.com/wp-json/bgapp/v1";
  constructor(private http: Http, private idb: IdbService) {

  }

  authenticate(username: string, password: string): Promise<boolean> {
    return this.askForToken(username, password).then(response => {
      if (response.authenticated) {
        this.token = response.token;
        this.idb.setToken(this.token);
        return true;
      } else {
        return false;
      }
    }, function(err) {
      let error = err.error;
      console.error(error);
    });
  }

  async askForToken(username: string, password: string): Promise<any> {
    var response = await this.http.post(this.wpurl+'/authenticate', {
      username: username,
      password: password
    }).toPromise();
    return response.json();
  }

}
