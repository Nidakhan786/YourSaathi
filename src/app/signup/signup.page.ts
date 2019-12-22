/** Common Dependencies Import*/
import { Component, OnInit } from '@angular/core';
import { NavController, Platform, ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
/**Close Common Dependencies Import*/

/** Enviornment Import */
import { emailRegex, passRegex } from 'src/environments/environment';
/** Close Enviorment Import */

/** Model Import */
import { SignUp } from "../signup/model/signup";
import { LocalStorageConstants } from '../model/local-storage.constants';
import { SharedService } from '../services /shared.service';
import { SignupService } from './service/signup.service';
/** Close Model Import*/

/** Service Import */
/** Close Service Import */


/**import language translation */
/**language translation loader function */

const avatar = 'assets/images/buddy.png';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  isTextFieldType:boolean=true;
  passType: string= 'password';
  image: any = avatar;
  public signUpForm: FormGroup;
  NotMatched: boolean = false;
  generatedPassword:string;
  passwordvalue:string;
  confirmpassword:string;

  signupValue: SignUp = {
    profileImage: "",
    birthDate: "",
    email: "",
    gender: "",
    name: "",
    password: "",
    mobileNumber: ""
  }
   passwordOptions = {
    length: 8,
    letters: true,
    numbers: true,
    symbols: true,
    strict: true
  };

  HTMLData:any=[];

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private platform: Platform,
    private router: Router,
    private modalController: ModalController,
    private signupService: SignupService,
    
  ) {

  }

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required, Validators.minLength(3), Validators.maxLength(30)
      ])),
      gender: new FormControl(''),
      birthday: new FormControl(''),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(emailRegex)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.pattern(passRegex),
        Validators.required
      ])),
      confirm_password: new FormControl('', Validators.compose([
        Validators.pattern(passRegex),
        Validators.required
      ])),
      phone: new FormControl(''),
      agree: new FormControl(false, Validators.compose([
        Validators.required
      ]))
    });

    // back button handler
    this.platform.backButton.subscribe(() => {
      if (this.router.url == '/signup') {
        this.goBack();
      }
    });

  }

  /** Match Password with comfirm Password */

  passwordMatchValidator() {
    if (this.signUpForm.value.confirm_password) {
      if (this.signUpForm.value.password != this.signUpForm.value.confirm_password) {
        this.NotMatched = true;
      } else {
        this.NotMatched = false;
      }
    }
  }
  togglePasswordFieldType() {
    this.isTextFieldType = !this.isTextFieldType;
    if(this.isTextFieldType){
      this.passType = 'password';
    }else{
      this.passType = 'text';
    }
    }

  /**
   * Method to call the create method in the service
   * @param signup values by signup form
   */

  async createAccount(signup: FormGroup) {
    try {
      await this.sharedService.showLoader();
      this.signupValue.name = signup.value.name.trim();
      if (signup.value.birthday) {
        signup.value.birthday = new Date(signup.value.birthday);
      }
      this.signupValue.birthDate = signup.value.birthday;
      this.signupValue.email = signup.value.email;
      this.signupValue.password = signup.value.password;
      this.signupValue.mobileNumber = signup.value.phone;

      if (this.image.includes('base64')) {
        this.signupValue.profileImage = this.image;
      }

      if (signup.value.gender != undefined && signup.value.gender != null) {
        this.signupValue.gender = signup.value.gender;
      }
     
      await this.signupService.registration(this.signupValue);
      this.signUpForm.reset();
      this.sharedService.hideLoader();
      await this.sharedService.setLocalStorageItem(LocalStorageConstants.RegEmail, JSON.stringify(this.signupValue.email));
      setTimeout(async () => {
        this.sharedService.presentAlert('verify_email').then((data: any) => {
          if (data.data === true) {
            this.navCtrl.navigateBack("/login");
          }
        });
      }, 1000);
    } catch (error) {
      await this.sharedService.hideLoader();
      this.sharedService.showToast(error.message, 'top');
    }
  }

  /** Method to back to login */
  goBack() {
    this.navCtrl.navigateBack("/login");
  }

  /** Method to choose photo or take photo*/
  async choosePhoto() {
    if (this.platform.is('cordova')) {
      await this.sharedService.choosePhoto(true).then((data: any) => {
        this.image = data;
      }, (error) => {
        this.sharedService.showToast(error, 'top');
      });
    } else {
      this.sharedService.showToast('noPlatformMsg', 'top');
    }
  }

  

  public generatePassword(mylength?: number): string {
    const uppercaseletters = 'ABCDEFGHIJKLMNOPQRSTUVXXYZ';
    const lowercaseletters='abcdefghijklmnopqrstuvwxyz'
    const symbols = '!@#$%^&*()-+<>';
    const numbers = '1234567890';
    let chars = '';
    if (this.passwordOptions.letters) {
      chars += uppercaseletters;
    }
    if (this.passwordOptions.letters) {
      chars += lowercaseletters;
    }
    if (this.passwordOptions.numbers) {
      chars += numbers;
    }
    if (this.passwordOptions.symbols) {
      chars += symbols;
    }

    let length = this.passwordOptions.length;


    let pass = '';

    if (this.passwordOptions.strict) {
      if (this.passwordOptions.letters) {
        pass += uppercaseletters.charAt(Math.floor(Math.random() * uppercaseletters.length));
        length = length - 1;
      }
      if (this.passwordOptions.letters) {
        pass += lowercaseletters.charAt(Math.floor(Math.random() * lowercaseletters.length));
        length = length - 1;
      }
      if (this.passwordOptions.symbols) {
        pass += symbols.charAt(Math.floor(Math.random() * symbols.length));
        length = length - 1;
      }
      if (this.passwordOptions.numbers) {
        pass += numbers.charAt(Math.floor(Math.random() * numbers.length));
        length = length - 1;
      }
    }

    for (let x = 0; x < length; x++) {
      const i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }

    console.log(pass)
    this.generatedPassword=pass;
    return pass
      .split('')
      .sort(() => {
        return 0.5 - Math.random();
      })
      .join('');
    
  }
  setInput(){
  
    this.passwordvalue=this.generatedPassword;
    this.confirmpassword=this.passwordvalue;
    console.log(this.passwordvalue)
  }

  showContent(contentType:string){   
    let convertedData;
    
     if(contentType  == 'dataProtection' ){
       convertedData = this.HTMLData.settings[1].dataProtection;
     }else if(contentType  == 'termsAndConditions'){
       convertedData = this.HTMLData.settings[3].TermsAndConditions;
     }
     let navigationExtras: NavigationExtras = {
      queryParams: {
        contentType: contentType,
      }
    };
    this.navCtrl.navigateForward( '/content-viewer', navigationExtras);
     }
  
}