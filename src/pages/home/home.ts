import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocationService} from "../../providers/service/locationService";
import {LightWeightLocation} from "../../app/model/lightWeightLocation";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  locations: LightWeightLocation[];
  audio: any;

  constructor(public navCtrl: NavController, public locationService: LocationService) {
    let ref = this;
    locationService.getLocations().then(function (response) {
      ref.locations = response;
    });
  }

  /*showVideo(url) {
    let mainVideo = document.getElementById('mainVideo');
    mainVideo.play();
  }*/
  playVideo(url, id) {
  }

  playAudio(audioUrl) {
    if (this.audio) {
      console.log(`audionStatus:` + this.audio.status);
      this.stopAudio();
      console.log(`audionStatus:` + this.audio.status);
    }
    if (audioUrl) {
      if (this.audio && this.audio.src === audioUrl) {
        this.audio = null;
      } else {
        this.audio = new Audio();
        console.log(`audionStatus:` + this.audio.status);
        this.audio.src = audioUrl;
        this.audio.load();
        this.audio.play();
        this.audio.loop = true;
        console.log(`audionStatus:` + this.audio.status);
      }
    }
  }

  stopAudio() {
    this.audio.pause();
  }

}
