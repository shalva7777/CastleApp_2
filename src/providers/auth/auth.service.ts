import {Injectable, ViewChild} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {BaseService} from "./base.service";
import {ActionResponse} from "../../app/model/response/action-response";
import {Storage} from "@ionic/storage";
import {Nav, ToastController} from "ionic-angular";
import {ActionResponseWithData} from "../../app/model/response/action-response-with-data";
import {Tourist} from "../../app/model/tourist";
import {UserLogin} from "../../pages/user-login/user-login";

/*declare let jquery: any;
declare let $: any;*/

@Injectable()
export class AuthService {


  constructor(private baseService: BaseService<any>,
              private storage: Storage,
              private toastCtrl: ToastController) {
  }

  @ViewChild(Nav) nav: Nav;

  private tokenName = 'Token';
  private clientId = 'ClientId';

  // private url = 'api/mobile/';

  loginUser(request): Promise<boolean> {
    let ref = this;
    return this.baseService.login(request).then(response => {
      ref.storage.clear();
      if (response) {
        ref.storage.set(ref.tokenName, response['data'])
        ref.storage.set('loginDate', Date.now());
        return true;
      } else {
        ref.handleError(response);
        return false;
      }
    });
  }



  checkSession(): Promise<ActionResponse> {
    console.log(`checkSession`);
    return this.baseService.checkSession();
  }

  getAuthorizedTourist(): Promise<ActionResponseWithData<Tourist>> {
    let ref = this;
    return this.baseService.getAuthorizedTourist().then(response => {
      if (response) {
        return ref.storage.set(ref.clientId, response).then(() => {
          console.log(ref.storage.get(ref.clientId));
          return response;
        });
      } else {
        ref.handleError(response);
        return response;
      }
    });
  }

  /*register(request: ClientRegistrationRequest): Promise<ActionResponse> {
    return this.baseService.post(this.url + 'register-client', request);
  }*/

  handleError(a: ActionResponseWithData<any>) {
    let message: string;
    if (a && !a.success && a.status === 401) {
      message = 'Login failed';
    } else {
      message = `Unexpected error`;
    }

    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });
    // toast.present();
  }
}
