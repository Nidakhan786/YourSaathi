/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
/**Close Common Dependencies Import*/

/** Service Import */
import { AuthService } from "../../auth/services/auth.service";
/** Close Service Import */

@Injectable()

export class AuthGuardService implements CanActivate {

    constructor(public router: Router,
        private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.authService.isLoggedIn().subscribe((user:any) => {

                if (user) {
                    // User is signed in.
                    resolve(true);
                } else {
                    // No user is signed in.
                    resolve(false);
                }
            });
        });
    }
}