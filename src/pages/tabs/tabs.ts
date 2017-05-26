import { Component } from '@angular/core';

//import { AboutPage } from '../about/about';
//import { ContactPage } from '../contact/contact';
import { FeedPage } from '../feed/feed';
import { ExplorePage } from '../explore/explore';
import { SubscribePage } from '../subscribe/subscribe';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = FeedPage;
  tab2Root = SubscribePage;
  tab3Root = ExplorePage;

  constructor() {

  }
}
