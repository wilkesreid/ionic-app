import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedPage } from './feed';

@NgModule({
  declarations: [
    FeedPage
  ],
  imports: [
    IonicPageModule.forChild(FeedPage)
  ],
  entryComponents: [
    FeedPage
  ]
})
export class FeedPageModule {}
