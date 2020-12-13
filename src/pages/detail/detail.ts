import {Component, OnDestroy, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {LightWeightLocation} from "../../app/model/lightWeightLocation";
import {Howl} from 'howler';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage implements  OnDestroy{


  locations: LightWeightLocation[];
  player: Howl = null;

  activeLocation: LightWeightLocation = null;
  isPlaying = false;
  progress: number = 0;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navParams: NavParams,
              private navController: NavController,
              private toastCtrl: ToastController,
              private platform: Platform) {
    let ref = this;
    this.activeLocation = navParams.get('inActiveLocation');
    this.locations = navParams.get('inLocations');

    this.platform.backButton.subscribe(function () {
      if (ref.player)
        ref.player.stop();
    });
    this.platform.pause.subscribe(function () {
      if (ref.player)
        ref.player.stop();
    });
  }


  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      if (this.player)
        this.player.stop();
      this.navController.pop();
    }
  }

  start(location: LightWeightLocation) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: ['http://192.168.100.5:8080/' + location.audioUrl],
      onplay: () => {
        this.isPlaying = true;
        this.activeLocation = location;
        this.updateProgress();
      },
      onend: () => {

      }
    });
    this.player.play();
  }
  ngOnDestroy() {
    if (this.player)
      this.player.stop();
  }

  togglePlayer(pause) {
    if (this.player) {
      this.isPlaying = !pause;
      if (pause) {
        this.player.pause();
      } else {
        this.player.play();
      }
    } else {
      this.start(this.activeLocation)
    }
  }

  next() {
    let index = this.locations.indexOf(this.activeLocation);
    if (index != this.locations.length - 1) {
      this.start(this.locations[index + 1]);
    } else {
      this.start(this.locations[0]);
    }
  }

  prev() {
    let index = this.locations.indexOf(this.activeLocation);
    if (index > 0) {
      this.start(this.locations[index - 1]);
    } else {
      this.start(this.locations[this.locations.length - 1]);
    }
  }

  seek(range) {
    let newValue = +range.value;
    let duration = this.player.duration();
    this.player.seek(duration * (newValue / 100));

  }

  updateProgress() {
    let seek = this.player.seek();
    this.progress = (seek / this.player.duration()) * 100 || 0;
    setTimeout(() => {
      this.updateProgress()
    }, 1000)
  }

}
