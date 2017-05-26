import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { StoryPage } from '../story/story';
import { Story } from '../../app/interfaces';
import * as _ from 'lodash';

@IonicPage({
  name: 'page-explore',
  segment: 'explore'
})
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html'
})
export class ExplorePage implements OnInit {
  page_number: number = 1;
  stories: Story[];
  endOfFeed: boolean = false;
  lastInfiniteEvent;
  loading: boolean = false;
  refreshing: boolean = false;

  constructor(public navCtrl: NavController, public api: ApiService) {}

  ngOnInit() {
    this.getCurrentPage();
  }

  nextPage(event) {
    if (this.endOfFeed) {
      event.complete();
      event.enable(false);
      this.lastInfiniteEvent = event;
      return;
    }
    this.page_number += 1;
    this.getCurrentPage(event);
  }

  reload(event?) {
    this.endOfFeed = false;
    this.page_number = 1;
    this.stories = undefined;
    if (this.lastInfiniteEvent !== undefined) {
      this.lastInfiniteEvent.enable(true);
    }
    this.getCurrentPage(event);
  }

  refresh(event) {
    this.refreshing = true;
    this.reload(event);
  }

  getCurrentPage(event?) {
    this.loading = true;

    this.api.getExplorePage(this.page_number).subscribe(resp => {
        this.loading = false;
        this.refreshing = false;

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
      }
    );
  }

  gotoStory(story_id) {
    this.navCtrl.push(StoryPage, {
      story_id: story_id
    });
  }

}
