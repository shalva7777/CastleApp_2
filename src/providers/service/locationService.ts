import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';
import {BaseService} from "../auth/base.service";
import {Storage} from "@ionic/storage";
import {NavController, ToastController} from "ionic-angular";
import {ActionResponseWithData} from "../../app/model/response/action-response-with-data";
import {LightWeightLocation} from "../../app/model/lightWeightLocation";
import {UserLogin} from "../../pages/user-login/user-login";

/*declare let jquery: any;
declare let $: any;*/

@Injectable()
export class LocationService {

  constructor(private baseService: BaseService<any>,
              private readonly storage: Storage,
              private toastCtrl: ToastController) {

  }

  private clientId = 'ClientId';
  private url = 'api/mobile/';

  getLocations(): Promise<LightWeightLocation[]> {
    let ref = this;
    return this.storage.get(this.clientId).then(function (tourist) {
      return ref.baseService.get(ref.url + `locations/${tourist.id}`).then(response => {
        if (response) {
          return response;
        } else {
          ref.handleError(response);
        }
      });
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
    toast.present();
  }
}
