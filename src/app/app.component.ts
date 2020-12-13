import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserLogin} from "../pages/user-login/user-login";
import {AuthService} from "../providers/auth/auth.service";
import {HomePage} from "../pages/home/home";
import {root} from "rxjs/util/root";
import {User} from "./model/user";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  templateUrl: 'app.html'
})
export class CastleApp {
  rootPage: any = null;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              authService: AuthService) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
    let ref = this;
    // ref.rootPage = UserLogin;
    authService.checkSession().then(function (response) {
      if (response && response.status && response.status == 401) {
        ref.rootPage = UserLogin
      } else {
        ref.rootPage = response ? HomePage : UserLogin;
      }
    });
  }
}
