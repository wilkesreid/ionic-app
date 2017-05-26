import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from '../../services/auth';
import { ChannelService } from '../../services/channel';
import { AWSService } from '../../services/aws';
import { ApiService } from '../../services/api';
import { StatusService } from '../../services/status';

declare var window: any;

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  attempting_login: boolean = false;
  username: string = "";
  password: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private aws: AWSService, private channelService: ChannelService, private api: ApiService, private status: StatusService) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.attempting_login = true;
    this.auth.authenticate(this.username, this.password).then(authenticated => {
      if (authenticated) {
        this.api.setAuthHeaders();

        this.channelService.updateLocalChannels();
        if (window.cordova) {
          this.aws.getAwsUser();
        }
        this.navCtrl.setRoot(TabsPage);
        this.status.status('auth', 'successful');
      } else {
        console.log('failed to authenticate with given username and password');
        this.status.status('auth', 'failed');
      }
      this.attempting_login = false;
    });
  }

}
