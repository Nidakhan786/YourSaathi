/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
import * as Parse from 'parse';
import { Platform } from '@ionic/angular';
/** Close Common Dependencies Import */

/** Model Import */
import { ResponseModel } from '../model/response.model';
import { LocalStorageConstants } from '../model/local-storage.constants';
/** Close Modeol Import */

/** Environment Import */
import { environment } from 'src/environments/environment';
import { completeAuth } from '../auth/model/user';
/** Close Environment Import */

/** Service Import */
import { CryptoService } from './crypto.service';

import { timeout, TimeoutError } from 'promise-timeout';
/** Close Service Import */

/** import language translation */
import { SharedService } from './shared.service';
import { AppService } from './app-service';
/** language translation loader function */

@Injectable()
export class ParseService {

    defaultTimeout: number = 20000;

    constructor(private cryptoService: CryptoService,
        private sharedService: SharedService,
        private appService: AppService,
        private platform: Platform
    ) {
        if (environment.IS_BACK4APP) {
            Parse.initialize(environment.parseAppID, environment.javaScriptKey);
        } else {
            Parse.initialize(environment.parseAppID);
        }

        Parse.serverURL = environment.parseServerUrl;
    }

    createNewInstallation = async (deviceRegToken, userId) => {
        try {
            let install = new Parse.Installation();
            install.set("deviceType", this.platform.platforms().toString());
            install.set("deviceToken", deviceRegToken);
            install.set("userId", userId);

            install.save(null, {
                success: async (install) => {
                    // Execute any logic that should take place after the object is saved.
                    console.log('New object created with objectId: ' + install.id);
                },
                error: async (install, error) => {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    console.log('Failed to create new object, with error code:' + error.message.toString());
                }
            });
            await this.sharedService.setLocalStorageItem(LocalStorageConstants.PushNotificationInstallation, false);
        } catch (error) {
            await this.sharedService.setLocalStorageItem(LocalStorageConstants.PushNotificationInstallation, true);
        }
    }

    /**
     * Method to call a cloud function in Parse
     * @param fucntionName name of the function to be called
     * @param params parameters needed to be passed to the function if any
     */
    excuteFunction(fucntionName: string, params: any, timeOutValue: boolean = false): Promise<ResponseModel<any>> {
        if (timeOutValue) {
            this.defaultTimeout = 60000;
        } else {
            this.defaultTimeout = 15000;
        }
    

        var status = false;
        this.appService.getNetworkStatus().subscribe((data: boolean) => {
            if (data) {
                status = data;
            }
        });
        var errorValue: ResponseModel<any> = { 'statuscode': 0, message: 'internetConnectionMsg', data: [] };
        return new Promise(async (resolve, reject) => {
            if (status) {
                try {
                    this.sharedService.getLocalStorageItem(LocalStorageConstants.Auth).then((data: completeAuth) => {
                        if (fucntionName === 'login' || fucntionName === 'register') { } else {
                            params.token = data.token;
                        }
                    });
                    const cypheredRequest = await this.cryptoService.encyptRequest(params);
                    const result = Parse.Cloud.run(fucntionName, cypheredRequest);

                    timeout(result, this.defaultTimeout)
                        .then(async (data) => {
                            const response = await this.cryptoService.decryptResponse(data);
                            if (response.message == 'INVALID_SESSION') {
                                setTimeout(() => {
                                    this.sharedService.apiErrorhandler(403);
                                }, 500);
                                response.message = 'EMPTY';
                            }
                            resolve(response);
                        }).catch((err) => {
                            if (err instanceof TimeoutError) {
                                console.error('Timeout :-(', err.message);
                                reject(new Error("TIMEOUT"));
                            } else {
                                reject(new Error("SERVER_CONNECT_ERROR"))
                            }
                        });

                } catch (error) {
                    errorValue.message = 'SERVER_CONNECT_ERROR';
                    reject(errorValue);
                }
            } else {
                errorValue.message = 'internetConnectionMsg';
                reject(errorValue);
            }
        });
    }

    /**
     * Method to query a class in Parse
     * @param queryName name of the class.
     * @returns result
     */
    async executeQueryFunction(queryName: string) {
        try {
            const result = await new Parse.Query(queryName).find();
            return result;
        } catch (error) {
            throw new Error('SERVER_CONNECT_ERROR');
        }
    }

}