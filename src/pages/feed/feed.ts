import { Component, NgZone } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Story } from '../../app/interfaces';
import { StoryPage } from '../story/story';
import { ChannelService } from '../../services/channel';
import { ApiService } from '../../services/api';
import { StatusService } from '../../services/status';
import * as _ from 'lodash';

@IonicPage({
  name: 'page-feed',
  segment: 'feed',
  priority: 'high'
})
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {
  page_number: number = 1;
  stories: Story[];
  endOfFeed: boolean;
  lastInfiniteEvent;
  channels: number[];
  loading: boolean = true;
  refreshing: boolean = false;
  subscribed_to_anything: boolean = true;
  no_results: boolean = false;
  constructor(public navCtrl: NavController, private channelService: ChannelService, private api: ApiService, private status: StatusService, private zone: NgZone) {

  }

  ionViewDidEnter() {
    this.status.when('auth', 'successful', (() => {
      this.channelService.getSubscribedList().then(channels => {
        this.zone.run(() => {
          this.channels = channels;

          // Check to see if we are subscribed to anything
          if (channels.length == 0) {
            this.subscribed_to_anything = false;
          } else {
            this.subscribed_to_anything = true;
          }

          this.reload();
        }); // this.zone.run
      }); // this.channelService.getSubscribedList
    }).bind(this)); // this.status.when
  } // ionViewDidEnter

  refresh(event) {
    this.refreshing = true;
    this.reload(event);
  }

  reload(event?) {
    console.log('reloading');
    this.endOfFeed = false;
    this.page_number = 1;
    this.stories = undefined;
    if (this.lastInfiniteEvent !== undefined) {
      this.lastInfiniteEvent.enable(true);
    }

    if (this.subscribed_to_anything) {
      console.log('getting current page');
      this.getCurrentPage(event);
    } else {
      if (event !== undefined) {
        event.complete();
      }
      this.loading = false;
    }
  }

  nextPage(event) {
    if (this.endOfFeed || !this.subscribed_to_anything) {
      event.complete();
      event.enable(false);
      this.lastInfiniteEvent = event;
      return;
    }
    this.page_number += 1;
    this.getCurrentPage(event);
  }

  getCurrentPage(event?) {
    this.loading = true;

    this.api.getFeedPage(this.page_number, this.channels).subscribe(resp => {
      console.log(resp);
      this.loading = false;
      this.refreshing = false;

      console.log(this.loading ? "loading" : "not loading");

      var stories = resp.stories;
      var page_size = resp.page_size;

      if (stories === null) {
        this.endOfFeed = true;
      } else {
        if (this.stories === undefined) {
          this.stories = _.map(stories, story => {
            story.date = new Date(story.date.replace(" ","T"));
            return story;
          });
        } else {
          Array.prototype.push.apply(this.stories, _.map(stories, story => {
            story.date = new Date(story.date.replace(" ","T"));
            return story;
          }));
        }

        if (stories.length < page_size) {
          this.endOfFeed = true;
        }
      }

      if (event !== undefined) {
        event.complete();
      }
    });
  }

  gotoStory(story_id: number): void {
    this.navCtrl.push(StoryPage, {
      story_id: story_id
    });
  }
}
