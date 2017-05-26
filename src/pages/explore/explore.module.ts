import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExplorePage } from './explore';

@NgModule({
  declarations: [
    ExplorePage
  ],
  imports: [
    IonicPageModule.forChild(ExplorePage)
  ],
  entryComponents: [
    ExplorePage
  ]
})
export class ExplorePageModule {}
