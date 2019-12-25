/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
/**Close Common Dependencies Import*/


@Injectable()
export class AppService {


  constructor() {

  }

  notificationValue = new BehaviorSubject<number>(0);
  networkValue = new BehaviorSubject<boolean>(true);



  /**
* get notification value
* @returns {Observable<T>}
*/
  getNotificationValue(): Observable<number> {
    return this.notificationValue.asObservable();
  }

  /**
   * Set notification value
   */
  setNotificationValue(val: number) {
    this.notificationValue.next(val);
  }

  /**
* get network status
* @returns {Observable<T>}
*/
  getNetworkStatus(): Observable<boolean> {
    return this.networkValue.asObservable();
  }

  /**
   * Set network status
   */
  setNetworkStatus(val: boolean) {
    this.networkValue.next(val);
  }



  


}