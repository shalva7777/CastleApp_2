import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {BaseService} from "./base.service";
import {ActionResponse} from "../../app/model/response/action-response";
import {Storage} from "@ionic/storage";
import {ToastController} from "ionic-angular";
import {ActionResponseWithData} from "../../app/model/response/action-response-with-data";
import {Tourist} from "../../app/model/tourist";

/*declare let jquery: any;
declare let $: any;*/

@Injectable()
export class AuthService {

  constructor(private baseService: BaseService<any>,
              private readonly storage: Storage,
              private toastCtrl: ToastController) {
  }

  private tokenName = 'Token';
  private clientId = 'ClientId';
  // private url = 'api/mobile/';

  loginUser(request): Promise<boolean> {
    let ref = this;
    return this.baseService.login(request).then(response => {
      if (response['success']) {
        return ref.storage.set(ref.tokenName, response['data']).then(() => {
          return true;
        });
      } else {
        ref.handleError(response);
        return false;
      }
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(this.tokenName).then(function (response) {
      return response;
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
    if (!a.success && a.status === 401) {
      message = 'Login failed';
    }
    else {
      message = `Unexpected error`;
    }

    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }
}
