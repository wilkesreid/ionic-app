import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalChannel } from '../../app/interfaces';
import { ChannelService } from '../../services/channel';
import { AWSService } from '../../services/aws';

declare var window: any;

@Component({
  selector: 'page-subscribe',
  templateUrl: 'subscribe.html'
})
export class SubscribePage {
  channels: LocalChannel[];
  constructor(public navCtrl: NavController, private channelService: ChannelService, private aws: AWSService) {
    this.channelService.getLocalChannels().then(channels => {
      this.channels = channels;
    });
  }

  updateSubscriptionStatus(channel: LocalChannel): void {
    this.channelService.updateChannel(channel);
    if (window.cordova) {
    if (channel.subscribed) {
        this.aws.subscribeTo(channel);
      } else {
        this.aws.unsubscribeFrom(channel);
      }
    }
  }

}
