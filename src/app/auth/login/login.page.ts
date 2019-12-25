/** Common Dependencies Import*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Platform, NavController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
/**Close Common Dependencies Import*/



/** Environment Import */
import { emailRegex, passRegex } from 'src/environments/environment';
import { SharedService } from '../../services /shared.service';
import { AuthService } from '../services/auth.service';
import { ParseService } from '../../services /parse.service';
import { LocalStorageConstants } from '../../model/local-storage.constants';
import { User, completeAuth } from '../model/user';
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';
/** Close Environment Import */





@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passType:string='password';
  isTextFieldType: boolean = true;
  public loginForm: FormGroup;
  redirectPage: "home";
  auth: completeAuth = {
    email: "",
    token: "",
    userId: "",
    name: "",
    userType: 0,
    birthDate: "",
    gender: "",
    mobileNumber: "",
    password: "",
    profileImage: "",
    username: ""
  };
  testtime = 'Thu Dec 31 2018 00:00:00 GMT+0530 (India Standard Time)';
  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private parseService: ParseService
  ) {

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(emailRegex),
      ])),
      password: new FormControl('', Validators.compose([
        Validators.pattern(passRegex),
        Validators.required
        
      ])),
   
 
    });

    
    // if(userConfig.)

    // back button handler
    this.platform.backButton.subscribe(() => {
      if (this.router.url == '/login') {
        this.navCtrl.navigateRoot('/home');
      }
    });

    this.route.queryParams.subscribe(params => {
      this.redirectPage = params["redirectTo"];
    });

  }

  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
    if(this.isTextFieldType){
      this.passType = 'password';
    }else{
      this.passType = 'text';
    }
    }

  async ionViewWillEnter() {
    await this.loginForm.reset();
    this.sharedService.getLocalStorageItem(LocalStorageConstants.RegEmail).then((data: any) => {
      if (data) {
        this.loginForm.controls['email'].setValue(data);
      }
    });
  }

  /**
   * Method to logIn the User and also get profile info
   * @param value credential of the user
   */

  async loginUser(value: User) {
    //await this.sharedService.showLoader();
    
      this.authService.loginUser(value).then((res: any) => {
        if (res != null && res != undefined && res.emailVerified === true) {
          this.auth.userId = res.userId,
            this.auth.token = res.token,
            this.auth.email = res.email,
          this.sharedService.setLocalStorageItem(LocalStorageConstants.Auth, JSON.stringify(this.auth));
         // this.authService.loginUserProfile(res.userId).then((value: any) => {
            // if (value != null && value != undefined) {
            //   this.auth.name = value.name;
            //   this.auth.gender = value.gender;}
             // this.loginForm.reset();
            //  this.sharedService.hideLoader();
             // if (this.redirectPage == "home") {
                this.navCtrl.navigateForward('/home');
    
      //  } else {
      //    this.sharedService.hideLoader();
       // }
    //  })
  }})}
  resendVerificationMail(email: any) {
    throw new Error("Method not implemented.");
  }
  /**
  * Method to create account.
  */
  createAccount() {
    this.navCtrl.navigateForward('/signup');
  }

  // /**
  //  * A pop-up for resetting password appears if user clicks on 'Forgot Password' link.
  //  * @param ev 
  //  */
  // async forgotPassword() {
  //   const forgotPasswordPopUp = await this.popoverController.create({
  //     component: ResetVerificationPopUpComponent,
  //     componentProps: {
  //       "link": "forgotPassword"
  //     },
  //     translucent: true,
  //     cssClass: 'reset-password-popover'
  //   });
  //   await forgotPasswordPopUp.present();
  //   forgotPasswordPopUp.onDidDismiss().then((res) => {
  //     if (res.data === 'success') {
  //       this.sharedService.showToast(this.translate.instant('RESET_PASSWORD_MESSAGE'), 'top');
  //     } else if (res.data === 'cancel') {
  //       //do nothing
  //     } else {
  //       // this.sharedService.showToast(this.translate.instant('Something went wrong!'), 'top');
  //     }
  //   });
  // }

  /**
   * A pop-up to resend verification link appears if user clicks on 'Resend Verification Mail' link.
   * @param ev 
   */
  // async resendVerificationMail(email: string) {
  //   const resendVerificationMail = await this.popoverController.create({
  //     component: ResetVerificationPopUpComponent,
  //     componentProps: {
  //       "link": "resendVerificationMail",
  //       "email": email
  //     },
  //     translucent: true,
  //   });
  //   await resendVerificationMail.present();
  //   await resendVerificationMail.onDidDismiss().then((res) => {
  //     if (res.data === 'success') {
  //       this.sharedService.showToast(this.translate.instant('RESEND_VERIFICATION_MESSAGE'), 'top');
  //     } else if (res.data === 'cancel') {
  //       //do nothing
  //     }
  //   });
  //}
}



