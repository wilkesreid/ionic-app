import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';

import { SubscribePage } from '../pages/subscribe/subscribe';
import { TabsPage } from '../pages/tabs/tabs';

import { ExplorePageModule } from '../pages/explore/explore.module';
import { FeedPageModule } from '../pages/feed/feed.module';
import { StoryPageModule } from '../pages/story/story.module';
import { LoginPageModule } from '../pages/login/login.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

const cloudSettings: CloudSettings = {
  "core": {
    "app_id": "18180946"
  },
  "push": {
    "sender_id": "SENDER_ID",
    "pluginConfig": {
      "ios": {
        "badge": true,
        "sound": true,
        "alert": true
      },
      "android": {
        "iconColor": "#343434"
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SubscribePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FeedPageModule,
    ExplorePageModule,
    StoryPageModule,
    LoginPageModule,
    CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SubscribePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
