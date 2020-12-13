import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Howl} from 'howler';

export interface Track {
  name: string;
  path: string;
}

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {
  player: Howl = null;
  playlist: Track[] = [
    {
      name: 'Eminem',
      path: '../../assets/audio/Eminem.mp3'
    },
    {
      name: 'Rammstein',
      path: '../../assets/audio/Rammstein.mp3'
    },
    {
      name: 'Bella',
      path: '../../assets/audio/Bella.mp3'
    }
  ];
  activeTrack: Track = null;
  isPlaying = false;
  progress: number = 0;
  constructor(public navCtrl: NavController) {
  }

  start(track: Track) {
    if (this.player) {
      this.player.stop();
    }
    this.player = new Howl({
      src: [track.path],
      onplay: () => {
        this.isPlaying = true;
        this.activeTrack = track;
        this.updateProgress();
      },
      onend: () => {

      }
    });
    this.player.play();
  }

  togglePlayer(pause) {

    this.isPlaying = !pause;
    if (pause) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  next() {
    let index = this.playlist.indexOf(this.activeTrack);
    if (index != this.playlist.length -1) {
      this.start(this.playlist[index + 1]);
    } else {
      this.start(this.playlist[0]);
    }
  }

  prev() {
    let index = this.playlist.indexOf(this.activeTrack);
    if (index > 0) {
      this.start(this.playlist[index - 1]);
    } else {
      this.start(this.playlist[this.playlist.length -1]);
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
