import { Component, NgZone } from '@angular/core';

import { Platform, NavController, Events, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/services/auth.service';
import { AppService } from './services /app-service';
import { Router } from '@angular/router';
import { ParseService } from './services /parse.service';
import { LocalStorageConstants } from './model/local-storage.constants';
import { SharedService } from './services /shared.service';
import { BaseService } from './services /base-service';
import { Network } from '@ionic-native/network/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  networkAlertPresented: boolean = false;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'LogIn',
      url: '/login',
      icon: 'person'
    },
    {
      title: 'Signup',
      url: '/signup',
      icon: 'person'
    },

    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'AboutUs',
      url: '/aboutus',
      icon: 'information-circle-outline'
    },
      ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sharedService: SharedService,
    private navCtrl: NavController,
    private appService: AppService,
    private authService: AuthService,
    private router: Router,
    private events: Events,
    private zone: NgZone,
    private network: Network,
    private alertCtrl: AlertController,
    private parseService: ParseService,
    private baseService: BaseService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getConfigSetting();
  
    });
    let name = await this.sharedService.getLocalStorageItem(LocalStorageConstants.Name);
      if (name != null && name != undefined) {
        this.authService.setLoggedInUserName(name);
      }

      let loginStatus = await this.sharedService.getLocalStorageItem(LocalStorageConstants.Login_Status);
      if (loginStatus != null && loginStatus != undefined) {
        this.authService.setLoginSubject(loginStatus);
      }

      let auth = await this.sharedService.getLocalStorageItem(LocalStorageConstants.Auth);
      if (auth == undefined || auth == null) {
        await this.sharedService.setLocalStorageItem(LocalStorageConstants.Auth, null);
      }
  }
  networkObserver() {
    if (this.network.type !== 'none' && this.network.type !== 'unknown') {
      this.baseService.networkConnection = true;
      this.sharedService.networkConnection = true;
      this.appService.setNetworkStatus(true);
    }
    else {
      this.baseService.networkConnection = false;
      this.sharedService.networkConnection = false;
      this.appService.setNetworkStatus(false);
      this.showNetworkAlert();
    }

    // watch network for a disconnect
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.baseService.networkConnection = false;
      this.sharedService.networkConnection = false;
      this.appService.setNetworkStatus(false);
      this.showNetworkAlert();
    });

    // stop disconnect watch
    //disconnectSubscription.unsubscribe();


    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.baseService.networkConnection = true;
      this.sharedService.networkConnection = true;
      this.appService.setNetworkStatus(true);
      setTimeout(() => {

        this.alert.dismiss();

      }, 3000);
    });
  }

  /**
   * Method to show network connection alert
   */
  alert: any;
  async showNetworkAlert() {
    if (!this.networkAlertPresented) {
      this.networkAlertPresented = true;
      this.alert = await this.alertCtrl.create({
        header: "Network Error",
        subHeader: "Please connect to internet for better experience",
        buttons: [{
          text: "Ok",
          handler: () => {
            this.networkAlertPresented = false;
            this.alert.dismiss();
            return false;
          }
        }]
      });
      this.alert.present();
    }
  }


  

  private saveToken(token: any): Promise<any> {
    // Send the token to the server
    console.log('Sending token to the server...');
    return Promise.resolve(true);
  }

  
  /**
   * Get Configuration Settings for media.
   * @param profileMedia true if media settings are for profile, false if media settings are for module. 
   */
  getConfigSetting() {
    this.parseService.executeQueryFunction('Configurations').then((data) => {
      data.map((dataValue: any) => {
        this.sharedService.setLocalStorageItem(dataValue.attributes.key, dataValue.attributes.values);
      });
    }, error => {
      this.sharedService.setLocalStorageItem(LocalStorageConstants.ModuleMediaLibrary, false);
      this.sharedService.setLocalStorageItem(LocalStorageConstants.ModuleMediaTake, false);
      this.sharedService.setLocalStorageItem(LocalStorageConstants.ProfileMediaLibrary, false);
      this.sharedService.setLocalStorageItem(LocalStorageConstants.ProfileMediaTake, false);
    });
  }





}