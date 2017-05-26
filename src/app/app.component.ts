import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { TabsPage } from '../pages/tabs/tabs';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ChannelService } from '../services/channel';
import { IdbService } from '../services/idb';
import { ApiService } from '../services/api';
import { AWSService } from '../services/aws';
import { AuthService } from '../services/auth';
import { StatusService } from '../services/status';

declare var window: any;

@Component({
  templateUrl: 'app.html',
  providers: [IdbService, ChannelService, ApiService, AWSService, AuthService, StatusService]
})
export class MyApp implements OnInit {
  rootPage:any = TabsPage;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private idb: IdbService,
    private channelService: ChannelService,
    private aws: AWSService,
    private auth: AuthService,
    private api: ApiService,
    private status: StatusService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    /* initialize the channels database table, if it
      hasn't already been created (e.g. opening app
      for the first time) */

    this.status.status('auth', 'started');

    this.idb.hasToken().then(hasToken => {
      if (hasToken) {
        console.log('found auth token in database');
        this.api.validateToken().then(isValid => {
          if (isValid) {
            console.log('server reports that the auth token is valid');
            this.idb.getToken().then(token => {
              console.log('auth token is:');
              console.log(token);
              this.auth.token = token;
              this.api.setAuthHeaders();

              this.updateLocalChannels();

              if (window.cordova) {
                this.aws.getAwsUser();
              }

              this.status.status('auth', 'successful');
            });
          } else {
            this.status.status('auth', 'failed');
            this.idb.deleteToken().then(() => {
              this.rootPage = LoginPage;
            });
          }
        })
      } else {
        this.status.status('auth', 'trying');
        console.log('did not find auth token in database');
        this.rootPage = LoginPage;
      }
    });
  }

  async authenticate(username: string, password: string): Promise<boolean> {
    return await this.auth.askForToken(username, password);
  }

  updateLocalChannels() {
    this.channelService.updateLocalChannels();
  }
}
