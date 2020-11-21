import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import 'rxjs/add/operator/toPromise';
import {SERVER_URL} from "../../config";
import {ActionResponse} from "../../app/model/response/action-response";
import 'rxjs/add/operator/map'
import {Storage} from "@ionic/storage";
import {LoadingController, ToastController} from "ionic-angular";
import {ActionResponseWithData} from "../../app/model/response/action-response-with-data";
import {LoginRequest} from "../../app/model/request/loginRequest";

/*declare let jquery: any;
declare let $: any;*/

@Injectable()
export class BaseService<T> {

  private tokenName = "Token";
  private url = 'api/mobile/';

  private loginHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private loadingCtrl: LoadingController,
              private storage: Storage,
              private toastCtrl: ToastController) {
  }

  login(value: any): Promise<any> {
    let username = value['username'];
    let password = value['password'];
    let loginRequest = new LoginRequest();
    loginRequest.username = username;
    loginRequest.password = password;

    let ref = this;
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
    return loading.present().then(() => {
        return this.http.post(`${SERVER_URL}` + this.url + `authorize`, loginRequest, {
          headers: this.loginHeaders,
          responseType: 'text'
        })
          .toPromise()
          .then(function (response) {
            loading.dismiss();
            const jsonResponse = JSON.parse(response);
            console.log(jsonResponse);
            let a: ActionResponseWithData<any> = new ActionResponseWithData;
            if (jsonResponse && jsonResponse.Authorization) {
              a.success = true;
              a.data = jsonResponse.Authorization;
              return a;
            } else {
              a.success = false;
              a.status = 401;
              return a;
            }
          })
          .catch(function (error) {
            loading.dismiss();
            ref.handleError(error);
          });
      }
    )
  }

  checkSession(): Promise<any> {
    let ref = this;
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
    return loading.present().then(() => {

      return this.storage.get(this.tokenName).then(function (token) {
        if (token == null) {
          token = "";
        }
        ref.headers.append(`Token`, token);
        return ref.http.get(SERVER_URL + `api/mobile/authorize`,  {headers: {'Authorization': token}})
          .toPromise()
          .then(function (response) {
            loading.dismiss();
            if (response && !response['success']) {
              ref.showToast(response['message']);
            }
            return response;
          })
          .catch(function (error) {
            loading.dismiss();
            ref.handleError(error);
          });
      });
    });
  }



  getAuthorizedTourist(): Promise<any> {

    let ref = this;
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
    return loading.present().then(() => {
      return this.storage.get(this.tokenName).then(function (token) {
        if (token == null) {
          token = '';
        }

        return ref.http.get(`${SERVER_URL}` + ref.url + `authorized-tourist`, {headers: {'Authorization': token}})
          .toPromise()
          .then(function (response) {
            loading.dismiss();
            console.log(`authorized-tourist` + response);
            return response;
          })
          .catch(function (error) {
            loading.dismiss();
            ref.handleError(error);
          });
      });
      }
    )
  }


  get(methodName): Promise<any> {
    let ref = this;
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
    console.log("Loading present");
    return loading.present().then(() => {
      return this.storage.get(this.tokenName).then(function (token) {
        if (token == null) {
          token = "";
        }

        return ref.http.get(SERVER_URL + methodName, {headers: {'Authorization': token}})
          .toPromise()
          .then(function (response) {
            loading.dismiss();
            if (response) {
              ref.showToast(response);
            }
            return response;
          })
          .catch(function (error) {
            loading.dismiss();
            ref.handleError(error);
          });
      });
    })
  }

  post(methodName, body): Promise<any> {
    let ref = this;
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
    return loading.present().then(() => {

      return this.storage.get(this.tokenName).then(function (token) {
        if (token == null) {
          token = "";
        }
        let header = new HttpHeaders({
          'Content-Type': 'application/json',
          'Token': token
        });
        return ref.http.post(SERVER_URL + methodName, body, {headers: header})
          .toPromise()
          .then(function (response) {
            loading.dismiss();
            if (response && !response['success']) {
              ref.showToast(response['message']);
            }
            return response;
          })
          .catch(function (error) {
            loading.dismiss();
            ref.handleError(error);
          });
      });
    });
  }

  showToast(message) {
    if (this == null) {
      return;
    }
    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  handleError(error: any): Promise<any> {
    let message: string;
    if (error.status && error.status === 401) {
      let a: ActionResponse = new ActionResponse;
      a.success = false;
      a.status = error.status;
      return Promise.resolve(a);
    } else {
      let a: ActionResponse = new ActionResponse;
      if (error.error.message) {
        message = `Unexpected error: ${error.error.message}`;
        a.success = false;
        a.status = error.status;
        a.message = error.error.message;
      } else {
        message = `Unexpected error: ${error.message}`;
        a.success = false;
        a.status = error.status;
        a.message = error.message;
      }
    }
    if (this != null) {
      const toast = this.toastCtrl.create({
        message,
        duration: 5000,
        position: 'bottom'
      });
      toast.present();
    }
    return null;
  }
}
