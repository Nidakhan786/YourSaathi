/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
/**Close Common Dependencies Import*/

/** Model Import */
import { LocalStorageConstants } from '../../model/local-storage.constants';
import { User, loginResponse, ProfileResponse } from '../model/user';
import { ResponseModel } from '../../model/response.model';
import { ServerConstants } from '../../model/server.constants';
/** Close Model Import */

/** Service Import */
import { SharedService } from "../../services /shared.service";
import { ParseService } from "../../services /parse.service";
/** Close Service Import */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private sharedService: SharedService,
    private parseService: ParseService,) {

  }

  user = 'guestUser';
  isLoginSubject = new BehaviorSubject<boolean>(false);
  loggedInUserNameSubject = new BehaviorSubject<string>(this.user);

  /**
  * Method to signIn from parse server
  * @param userValue credential of user
  * @returns status
  */

  async loginUser(userValue: User): Promise<loginResponse> {
    let params = userValue;
    let result: ResponseModel<loginResponse> = await this.parseService.excuteFunction('login', params)
    if (result.statuscode == ServerConstants.SUCCESS) {
      return result.data
    } else {
      throw new Error(result.message)
    }
  }

  /** Method to get profile data from server
   @returns user profile data 
   **/

  async loginUserProfile(userId: string): Promise<ProfileResponse> {
    let params = { userId: userId, token: "" };
    let result: ResponseModel<ProfileResponse> = await this.parseService.excuteFunction('getUserProfile', params)
    if (result.statuscode == ServerConstants.SUCCESS) {
      return result.data
    } else {
      throw new Error(result.message)
    }
  }


  /**
   * Method to logOut from parse server
   * @returns status
   */

  async logoutUser() {
    let params = { token: "" };
    let result: ResponseModel<any> = await this.parseService.excuteFunction('logout', params)
    if (result.statuscode == ServerConstants.SUCCESS) {
      this.cleanAuthInfo();
      return result.data;
    } else {
      throw new Error(result.message)
    }
  }

  /** clean all auth local storage info*/

  cleanAuthInfo() {
    this.setLoggedInUserName(this.user);
    this.setLoginSubject(false);
    this.sharedService.setLocalStorageItem(LocalStorageConstants.Name, JSON.stringify(this.user));
    this.sharedService.setLocalStorageItem(LocalStorageConstants.Login_Status, false);
    this.sharedService.setLocalStorageItem(LocalStorageConstants.Auth, JSON.stringify({}));
    this.sharedService.setLocalStorageItem(LocalStorageConstants.RegEmail, null);
  }


  /**
  * get login status
  * @returns {Observable<T>}
  */
  isLoggedIn(): Observable<boolean> {
    return this.isLoginSubject.asObservable();
  }


  /**
   * Set login status
   */
  setLoginSubject(val: boolean) {
    this.isLoginSubject.next(val);
  }


  /**
    * get username
    * @returns {Observable<T>}
    */
  getLoggedInUserName(): Observable<string> {
    return this.loggedInUserNameSubject.asObservable();
  }


  /**
   * Set username
   * @param val 
   */
  setLoggedInUserName(val: string) {
    console.log("setLoggedInUserName", val);
    this.loggedInUserNameSubject.next(val);
  }

  /**
   * Resend Verification Email 
   * @param email email address at which the link needs to be sent.
   * @return result
   */
  async resendVerificationMail(email: string): Promise<any> {
    let params = {
      "email": email
    }

    let result: ResponseModel<any> = await this.parseService.excuteFunction('resendVerificationMail', params);
    if (result.statuscode == ServerConstants.SUCCESS) {
      return result.data
    } else {
      throw new Error(result.message)
    }
  }
}
