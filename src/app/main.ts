import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import 'intl';
import 'intl/locale-data/jsonp/en';

import { AppModule } from './app.module';

declare var window: any;

if (window.cordova) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
