import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthService} from "../../providers/auth/auth.service";
import {HomePage} from "../home/home";
import {User} from "../../app/model/user";
import {Storage} from "@ionic/storage";


@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLogin {


  constructor(public navCtrl: NavController,
              private storage: Storage,
              private authService: AuthService,
              private toastCtrl: ToastController) {
  }



  login(value) {
    let ref = this;
    console.log("Login");
    this.authService.loginUser(value).then(response => {
      if (response) {
        console.log("Login response: " + response);
        this.authService.checkSession().then(response => {
          if (response) {
            ref.authService.getAuthorizedTourist().then(function (response) {
              if (response) {
                ref.navCtrl.push(HomePage);
              }
            });
          } else {
            const toast = this.toastCtrl.create({
              message: `Unexpected Error`,
              duration: 5000,
              position: 'bottom'
            });
            toast.present();
          }
        })
      }
    });
  }

  logout() {
    let ref = this;
    ref.storage.clear();
    ref.navCtrl.setRoot(UserLogin);
    ref.navCtrl.push(UserLogin)
  }

}
