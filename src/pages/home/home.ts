import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocationService} from "../../providers/service/locationService";
import {LightWeightLocation} from "../../app/model/lightWeightLocation";
import {DetailPage} from "../detail/detail";
import {AutoLogoutService} from "../../providers/service/AutoLogoutService";
import {RESOURCE_URL} from "../../config";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  locations: LightWeightLocation[];
  serverURL = RESOURCE_URL;

  constructor(public navCtrl: NavController,
              public locationService: LocationService,
              private autoLogout: AutoLogoutService) {
    console.log('Home page contructor');
    let ref = this;
    locationService.getLocations().then(function (response) {
      ref.locations = response;
      autoLogout.startInterval();
    });

  }

  detailPage(activeLocation) {
    if (this.navCtrl.getActive().index != 0) {
      this.navCtrl.remove(this.navCtrl.getActive().index - 1);
    }
    this.navCtrl.push(DetailPage, {inActiveLocation: activeLocation, inLocations: this.locations})
  }


}
