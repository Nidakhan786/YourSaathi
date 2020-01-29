/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { InformationfeedService } from '../informationfeed/services/informationfeed.service';
import{InformationFeed} from'../informationfeed/model/informationfeed.model';
/**Close Common Dependencies Import*/


@Injectable()
export class AppService {


  constructor() {

  }

  notificationValue = new BehaviorSubject<number>(0);
  networkValue = new BehaviorSubject<boolean>(true);
  feedData = new BehaviorSubject<InformationFeed[]>([]);


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
  setfeedData(val: InformationFeed[]) {
    this.feedData.next(val);
  }
  /**
   * Set network status
   */
  setNetworkStatus(val: boolean) {
    this.networkValue.next(val);
  }

  getfeedData(): Observable<InformationFeed[]> {
    return this.feedData.asObservable();
  }

  


}