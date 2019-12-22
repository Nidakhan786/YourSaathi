/** Common Dependencies Imports */
import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
/** Close Common Dependencies Imports */

/** Environment Imports */
import { environment } from '../../../src/environments/environment';
/** Close Environment Imports */

@Injectable()
export class CryptoService {
    constructor() { }

    async encyptRequest(params?: any): Promise<any> {
        try {
            if (environment.CRYPTO_ENABLE) {

                let cypher = AES.encrypt(JSON.stringify(params), environment.CRYPTO_KEY);
                let cypherObject = {
                    ciphertext: cypher.toString()
                }
                return cypherObject;
            }
            else {
                return params;
            }

        } catch (error) {
            throw new Error('ENCRYPTION_ERROR_OCCUERED');
        }
    }

    async decryptResponse(response?: any): Promise<any> {
        try {
            if (environment.CRYPTO_ENABLE) {
                let bytes = AES.decrypt(response.ciphertext, environment.CRYPTO_KEY);
                console.log(JSON.parse(bytes.toString(enc.Utf8)));
                return JSON.parse(bytes.toString(enc.Utf8), this.dateTimeReviver);
            }
            else {
                return response;
            }

        } catch (error) {
            throw new Error('DECRYPTION_ERROR_OCCUERED');
        }
    }


    dateTimeReviver = (key, value) => {
        let reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        let reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
        if (typeof value === 'string') {
            var a = reISO.exec(value);
            if (a)
                return new Date(value);
            a = reMsAjax.exec(value);
            if (a) {
                var b = a[1].split(/[-+,.]/);
                return new Date(b[0] ? +b[0] : 0 - +b[1]);
            }
        }
        return value;
    }
}
