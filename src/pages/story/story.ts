import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { ApiService } from '../../services/api';
import { Story } from '../../app/interfaces';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage({
  name: 'story',
  segment: 'story'
})
@Component({
  selector: 'page-story',
  templateUrl: 'story.html'
})
export class StoryPage implements OnInit {
  story_id: number;
  story: Story;
  storyLoaded: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiService, public sanitizer: DomSanitizer) {
    this.story_id = navParams.get('story_id');
  }

  ngOnInit() {
    this.api.getStory(this.story_id).subscribe(story => {
        this.api.getVimeoEmbedHtml(story.video_id).subscribe(resp => {
          story.video = resp;
          story.video.safeHtml = this.sanitizer.bypassSecurityTrustHtml(story.video.html);
        });
        this.story = story;
        this.storyLoaded = true;
      }
    );
  }

}
