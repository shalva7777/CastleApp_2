import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {App} from "ionic-angular";
import {UserLogin} from "../../pages/user-login/user-login";

const MINUTES_UNITL_AUTO_LOGOUT = 1 // in Minutes
const CHECK_INTERVALL = 1000 // in ms

@Injectable()
export class AutoLogoutService {
  login = Date.now();
  nav;
  intervalId;
  intervalIds = [];

  constructor(
    private app: App,
    private storage: Storage,
  ) {
    // let ref = this;
    // ref.storage.get(`loginDate`).then(function (loginDate) {
    //   if (loginDate) {
    //     ref.login = loginDate;
    //   } else {
    //     ref.nav.setRoot(UserLogin);
    //     ref.nav.push(UserLogin)
    //   }
    // }).catch(function (error) {
    //   console.log(error);
    //   ref.nav.setRoot(UserLogin);
    //   ref.nav.push(UserLogin)
    // });
  }

//   startTimer() {
//     this.timer.add([
//       {
//         id: 'task-1',       // unique ID of the task
//         tickInterval: 5,    // run every 5 ticks (5 x interval = 5000 ms)
//         totalRuns: 10,      // run 10 times only. (set to 0 for unlimited times)
//         callback(task) {
//           this.check();
//           console.log(`${task.id} task has run ${task.currentRuns} times.`);
//         }
//       }
//     ]);
// // Start the timer
//     this.timer.start();
//   }


  startInterval() {
    let ref = this;
    ref.login = null;
    ref.nav = ref.app.getActiveNav();
    ref.storage.get(`loginDate`).then(function (loginDate) {
      if (loginDate) {
        ref.login = loginDate;
      } else {
        ref.nav.setRoot(UserLogin);
        ref.nav.push(UserLogin)
      }
    }).catch(function (error) {
      console.log(error);
      ref.nav.setRoot(UserLogin);
      ref.nav.push(UserLogin)
    });

    // this.check();
    this.initInterval();
  }

  initInterval() {
    this.intervalId = setInterval(() => {
      this.check();
    }, CHECK_INTERVALL);
  }

  check() {
    if (!this.login) {
      return;
    }
    let ref = this;
    const now = Date.now();
    const timeleft = ref.login + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout) {
      console.log(`Sie wurden automatisch nach ${MINUTES_UNITL_AUTO_LOGOUT} Minuten Inaktivität ausgeloggt.`);
      this.storage.clear()
      ref.nav.setRoot(UserLogin);
      ref.nav.push(UserLogin);
      clearInterval(this.intervalId)
    }
  }
}
