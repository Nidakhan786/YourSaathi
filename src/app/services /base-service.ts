/** Common Dependencies Import*/
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
/**Close Common Dependencies Import*/

/** Service Import */
import { SharedService } from "../services /shared.service";
/** Close Service Import */


@Injectable()
export class BaseService {

    networkConnection: boolean = false;
    
    constructor(
        private httpClient: Http,
        private sharedService: SharedService) {

    }

    public getRequestHeader(): RequestOptions {
        let authToken: string = "";
        let auth = localStorage.getItem('auth');
        if (auth != undefined || auth != null) {

            //start comment section to avoid error becuse we don't have token in response....
            var authModel = JSON.parse(auth);
            authToken = authModel.token;
            //end comment section to avoid error becuse we don't have token in response....
        }


        let headers = new Headers();
        headers.append('Authorization', `Bearer ${authToken}`);
        return new RequestOptions({ headers: headers });
    }

    /**
    * Method to use get type of http service
    * @param apiUrl parameters needed to be passed
    */

    getCall<T>(apiUrl: string) {
        return new Promise((resolve, reject) => {
            if (this.checkNetworkConnection()) {
                try {
                    let options = this.getRequestHeader();
                    this.httpClient.get(apiUrl, options).subscribe((data: any) => {
                        if (data != null && data != undefined) {
                            resolve(data);
                        } else {
                            reject();
                        }
                    }, (error) => {
                        reject(error);
                    })
                } catch (error) {
                    reject(error);
                }
            } else {
                reject("internetConnectionMsg");
            }
        });
    }

    /**
   * Method to use delete type of http service
   * @param apiUrl parameters needed to be passed
   */

    public deleteCall<T>(apiUrl: string, body?: Object) {
        return new Promise((resolve, reject) => {
            if (this.checkNetworkConnection()) {
                try {
                    let options = this.getRequestHeader();
                    options.body = body;
                    this.httpClient.delete(apiUrl, options).subscribe((data: any) => {
                        if (data != null && data != undefined) {
                            resolve(data);
                        } else {
                            reject();
                        }
                    }, (error) => {
                        reject(error);
                    })

                } catch (error) {
                    reject(error);
                }
            } else {
                reject("internetConnectionMsg");
            }
        });

    }

    /**
  * Method to use post type of http service
  * @param apiUrl parameters needed to be passed
  */

    public postCall<T>(apiUrl: string, body: Object) {
        return new Promise((resolve, reject) => {
            if (this.checkNetworkConnection()) {
                try {
                    let options = this.getRequestHeader();
                    this.httpClient.post(apiUrl, body, options).subscribe((data: any) => {
                        if (data != null && data != undefined) {
                            resolve(data);
                        } else {
                            reject();
                        }
                    }, (error) => {
                        reject(error);
                    })
                } catch (error) {
                    reject(error);
                }
            } else {
                reject("internetConnectionMsg");
            }
        });
    }

    /**
 * Method to use put type of http service
 * @param apiUrl parameters needed to be passed
 */

    public putCall<T>(apiUrl: string, body: Object) {
        return new Promise((resolve, reject) => {
            if (this.checkNetworkConnection()) {
                try {
                    let options = this.getRequestHeader();
                    this.httpClient.put(apiUrl, body, options).subscribe((data: any) => {
                        if (data != null && data != undefined) {
                            resolve(data);
                        } else {
                            reject();
                        }
                    }, (error) => {
                        reject(error);
                    })
                } catch (error) {
                    reject(error);
                }
            } else {
                reject("internetConnectionMsg");
            }
        });

    }

    //Function to check network connection
    public checkNetworkConnection(): boolean {

        return this.networkConnection;

    }

}