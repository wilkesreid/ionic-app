import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryPage } from './story';

@NgModule({
  declarations: [
    StoryPage
  ],
  imports: [
    IonicPageModule.forChild(StoryPage)
  ],
  entryComponents: [
    StoryPage
  ]
})
export class StoryPageModule {}
