/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
/**Close Common Dependencies Import*/

/**  Model Import */
import { ResponseModel } from '../../model/response.model'
import { ServerConstants } from '../../model/server.constants';
import { SignUp } from '../model/signup';
/** Close Model Import */

/** Service Import */
import { ParseService } from "../../services /parse.service";
/** Close Service Import */

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private parseService : ParseService) { }

  /**
     * Method to fetch signup details from server
     * @param userValue userValue from signup form 
     * @returns User Signup Status
     */
    async registration ( userValue : SignUp ) : Promise<SignUp> {

      let params =  userValue;
      let result : ResponseModel<SignUp> = await this.parseService.excuteFunction( 'register' , params )

      if ( result.statuscode == ServerConstants.SUCCESS ){
          return result.data;
      } else {
          throw new Error(result.message);
      }

  }


}
