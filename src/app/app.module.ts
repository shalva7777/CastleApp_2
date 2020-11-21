import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {CastleApp} from './app.component';

import {AboutPage} from '../pages/about/about';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserLogin} from "../pages/user-login/user-login";
import {BaseService} from "../providers/auth/base.service";
import {AuthService} from "../providers/auth/auth.service";
import {HttpClientModule} from "@angular/common/http";
import {IonicStorageModule} from "@ionic/storage";
import {LocationService} from "../providers/service/locationService";
import {JwtInterceptor} from "../providers/auth/JwtInterceptor";

@NgModule({
  declarations: [
    CastleApp,
    AboutPage,
    HomePage,
    TabsPage,
    UserLogin,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CastleApp),
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CastleApp,
    AboutPage,
    HomePage,
    TabsPage,
    UserLogin,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BaseService,
    AuthService,
    LocationService,
    JwtInterceptor
  ]
})
export class AppModule {}
