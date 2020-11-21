import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {AuthService} from "../../providers/auth/auth.service";


@Component({
  selector: 'page-user-login',
  templateUrl: 'user-login.html',
})
export class UserLogin {


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private authService: AuthService,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserLogin');
  }

  dashboardPage() {
    this.navCtrl.push(TabsPage);
  }

  signupPage() {
    this.navCtrl.push(TabsPage);
  }

  forgotPasswordPage() {
    this.navCtrl.push(TabsPage);
  }


  login(value) {
    let ref = this;
    console.log("Login");
    this.authService.loginUser(value).then(response => {
      console.log("Login response: " + response);
      this.authService.checkSession().then(response => {
        if (response) {
          ref.authService.getAuthorizedTourist().then(function (response) {
            if (response) {
              ref.navCtrl.push(TabsPage);
            }
          });
        } else {
          const toast = this.toastCtrl.create({
            message : `Unexpected Error`,
            duration: 5000,
            position: 'bottom'
          });
          toast.present();
        }
      })

    });
  }

}
