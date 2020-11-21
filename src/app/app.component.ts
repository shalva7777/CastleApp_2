import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {UserLogin} from "../pages/user-login/user-login";
import {AuthService} from "../providers/auth/auth.service";

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
    authService.checkSession().then(function (response) {
      ref.rootPage = response ? UserLogin : UserLogin;
    });
  }
}
