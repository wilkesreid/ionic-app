import { Injectable } from "@angular/core";
import { IdbService } from './idb';
import { ApiService } from './api';
import { Push, PushToken } from "@ionic/cloud-angular";
import { ToastController } from 'ionic-angular'
import { AwsEndpointResponse, LocalChannel, Subscription } from '../app/interfaces';
import 'aws-sdk/dist/aws-sdk';

declare var window: any;

const AWS = window.AWS;

@Injectable()
export class AWSService {
  private access_key: string;
  private secret_key: string;
  private region: string = 'us-east-1';
  private sns: any;
  constructor(private idb: IdbService, private push: Push, private api: ApiService, private toast: ToastController) {

  }

  /*
  TODO: move this function to ChannelService
  */
  subscribeTo(channel: LocalChannel): void {
    this.idb.getAwsEndpoint(endpoint => {
      if (endpoint !== undefined && this.sns !== null) {

        this.sns.subscribe({
          Protocol: 'application',
          TopicArn: channel.arn,
          Endpoint: endpoint.endpointarn
        }, (err, data) => {
          if (err) console.log(err);
          else {
            this.idb.storeSubscription({
              subscriptionarn: data.SubscriptionArn,
              channel: channel.id
            });
          }
        });
      }
    });
  }

  /*
  TODO: move this function to ChannelService
  */
  unsubscribeFrom(channel: LocalChannel): void {
    this.idb.getSubscriptionByChannel(channel).then((subscription: Subscription) => {
      if (subscription !== undefined && this.sns !== null) {
        this.sns.unsubscribe({
          SubscriptionArn: subscription.subscriptionarn
        }, (err, data) => {
          if (err) console.log(err);
          else {
            this.idb.deleteSubscription(subscription);
          }
        });
      }
    });
  }

  awsUserExists(): Promise<boolean> {
    return this.idb.awsUserExists();
  }

  getAwsUser(): void {
    this.push.register().then((t: PushToken) => {
      this.awsUserExists().then(exists => {
        if (!exists) {
          console.log(this.api.authOptions);
          console.log(t);
          this.api.getAwsEndpoint(t).subscribe((response: AwsEndpointResponse) => {
            this.access_key = response.access_key;
            this.secret_key = response.secret_key;
            // Create SNS client object
            this.sns = new AWS.SNS({
              accessKeyId: response.access_key,
              secretAccessKey: response.secret_key,
              region: this.region
            });
            // Store data in indexed database
            this.idb.storeEndpoint(response.EndpointArn);
            this.idb.storeUser({
              username: response.username,
              access_key: response.access_key,
              secret_key: response.secret_key
            });
          });
        } else {
          this.idb.getAwsUser().then(user => {
            this.sns = new AWS.SNS({
              accessKeyId: user.access_key,
              secretAccessKey: user.secret_key,
              region: this.region
            });
          })
        }
      });

      this.push.rx.notification().subscribe((msg) => {
        let toast = this.toast.create({
          message: 'New story: '+msg.text,
          duration: 3000
        });

        toast.present();
      });
    });
  }
}
