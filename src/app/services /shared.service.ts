/** Common Dependencies Import*/
import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController, Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
/**Close Common Dependencies Import*/

import { HttpClient } from '@angular/common/http';
import { LocalStorageConstants } from '../model/local-storage.constants';

@Injectable()

export class SharedService {

  public globaLoader: any[] = [];
  networkConnection: boolean = false;
  target: string = "_system"; // _blank //_self

  //compress file var
  bigImg = null;
  bigSize: any = '0';

  smallImg: any = null;
  smallSize = '0';

  // compress file var closed
  options: InAppBrowserOptions = {
    location: 'no',//Or 'yes' 
    hidden: 'no',
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'no',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    closebuttoncaption: 'Close', //iOS only
    toolbar: 'yes', //iOS only 
  };

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private camera: Camera,
    private events: Events,
    private storage: Storage,
    private theInAppBrowser: InAppBrowser,
    private http: HttpClient
  ) { }

  /**
   * Fetch Configuration settings for the application.
   * @param configUrl 
   * @return configSettings
   */
  getConfig(configUrl: string) {
    return this.http.get(configUrl);
  }

  /**
     * Method to call a toast
     * @param title title of the toast
     * @param position position of the toast
     */

  async showToast(title, position) {
    if (title.trim() != "") {
      let toast = await this.toastCtrl.create({
        message: title,
        duration: 5000,
        position: position,
      });

      await toast.present();
    }
  }

  /**
   * Method to call a loader
   * @param message message of the loader
   */

  async showLoader(message?: string) {
    let content = message != null && message != '' && message != 'undefined' ? message : 'pleaseWait';
    let loader = await this.loadingCtrl.create({
      message: content
    });
    await loader.present().catch(error => { console.log(error) });
    await this.globaLoader.push(loader);
  }

  /**
    * Method to hide all the loader
    */

  async hideLoader() {
    try {
      await this.globaLoader.forEach(async (loaderItem: any) => {
        await loaderItem.dismiss().catch(error => { console.log(error) });
      });
      this.globaLoader = [];
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Function to handle Api Error
   * @param error error object 
   */
  async apiErrorhandler(status: any) {
    if (status !== undefined && status !== null) {
      switch (status) {
        case 403:
          let alert = await this.alertCtrl.create({
            header: 'unAuthorised',
            subHeader: 'unAuthorisedAction',
            buttons: [{
              text:'ok',
              handler: () => {
                let navTransition = alert.dismiss();

                navTransition.then(() => {
                  this.events.publish("un-authorised");
                });


                return false;
              }
            }]
          });
          await alert.present();
          break;
        default:
          var message: any = 'errorMsg';
          await this.errorAlert(message);
      }
    } else {
      var message: any = 'errorMsg';
      await this.errorAlert(message);
    }

  }

  /**
    * Method to call a confirm alert
    * @param message message of the alert
    */
  async presentConfirm(msg: string) {
    let choice;
    let alert = await this.alertCtrl.create({
      header: 'confirm',
      message: msg,
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'ok',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      choice = data;
    })
    return choice;
  }

  /**
   * A dialog to display error in case of UNVERIFIED_EMAIL_ADDRESS.
   * @param msg meesage of alert
   * @returns choice
   */
  async resendVerificationAlert(msg: string) {
    let choice;
    let alert = await this.alertCtrl.create({
      subHeader: msg,
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'Resend Verification Email',
          cssClass: 'resendVerificationAlert',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ],
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      choice = data;
    });
    return choice;
  }

  /**
   * Method to call a alert
   * @param message message of the alert
   */

  async presentAlert(msg: string) {
    let choice;
    let alert = await this.alertCtrl.create({
      // header: this.translate.instant('alert'),
      subHeader: msg,
      buttons: [
        {
          text: 'ok',
          handler: () => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      choice = data;
    })
    return choice;
  }

  /**
   * Method to call a error alert
   * @param message message of the alert
   */
  async errorAlert(msg: string) {
    let alert = await this.alertCtrl.create({
      header: 'error',
      subHeader: msg,
      buttons: [{
        text: 'ok',
        handler: () => {
          alert.dismiss();
          return false;
        }
      }]
    });
    await alert.present();
  }

  /** Clear all item of local storage
   * @key key name 
   */
  clearLocalStorageItem(key) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        resolve(true);
      } catch (e) {
        reject('errorMsg');
      }
    });
  }


  /** set key,value using local storage
   * @key params key name 
   * @value params value of the key
   */
  setLocalStorageItem(key, value) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(key, value);
        resolve(true);
      } catch (e) {
        reject('errorMsg');
      }
    });
  }

  /** get value according the key from local storage
   * @key params key name 
   */
  getLocalStorageItem(key): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let resJson = JSON.parse(localStorage.getItem(key));
        resolve(resJson);
      } catch (e) {
        reject('errorMsg');
      }
    });
  }

  setIonicStrorageValue(key, value) {
    return new Promise((resolve, reject) => {
      try {
        this.storage.set(key, value).then((data) => {
          resolve(true);
        }, (error) => {
          reject('errorMsg');
        });
      } catch (e) {
        reject('errorMsg');
      }
    });
  }

  getIonicStrorageValue(key) {
    return new Promise((resolve, reject) => {
      try {
        this.storage.get(key).then((data) => {
          resolve(data);
        }, (error) => {
          reject('errorMsg');
        });
      } catch (e) {
        reject('errorMsg');
      }
    });
  }

  removeIonicStrorageKeyValue(key) {
    return new Promise((resolve, reject) => {
      try {
        this.storage.remove(key).then((data) => {
          resolve(true);
        }, (error) => {
          reject('errorMsg');
        });
      } catch (e) {
        reject('errorMsg');
      }
    });
  }

  clearIonicStrorageKeyValue() {
    return new Promise((resolve, reject) => {
      try {
        this.storage.clear().then((data) => {
          resolve(true);
        }, (error) => {
          reject('errorMsg');
        });
      } catch (e) {
        reject('errorMsg');
      }
    });
  }

  /**
  * Method to use InAppBrowser Plugin
  * @param url parameters needed to be passed
  */

  async openWithInAppBrowser(url: string) {

    // this.showLoader();
    let ref = await this.theInAppBrowser.create(url, this.target, this.options);

    ref.on("loadstart").subscribe(async (event) => {
      await this.loadstartCallback(event);
      this.hideLoader();
    }, (err) => {
      console.log("InAppBrowser Loadstop Event Error: " + err);
      this.hideLoader();
    });

    ref.on("loadstop").subscribe(async (event) => {
      await this.loadstopCallback(event);
      this.hideLoader();
    }, (err) => {
      console.log("InAppBrowser loadstop Event Error: " + err);
      this.hideLoader();
    });

    ref.on("loaderror").subscribe(async (event) => {
      await this.loaderrorCallback(event, ref);
      this.hideLoader();
    }, (err) => {
      console.log("InAppBrowser loaderror Event Error: " + err);
      this.hideLoader();
    });

    ref.on("exit").subscribe(async () => {
      await this.exitCallback();
      this.hideLoader();
    }, (err) => {
      console.log("InAppBrowser exit Event Error: " + err);
      this.hideLoader();
    });
  }

  loadstartCallback(event) {
    console.log('Loading started: ', event)
  }

  loadstopCallback(event) {
    console.log('Loading finished: ', event)
  }

  loaderrorCallback(error, ref) {
    console.log('Loading error: ', error)
    ref.insertCSS({ code: "body{color: red;" });
  }

  exitCallback() {
    console.log('Browser is closed...');
  }

  /** Method to choose photo or take photo*/
  choosePhoto(profileMedia: boolean) {
    // Ask if the user wants to take a photo or choose from photo gallery.
    let localStorageTake = '';
    let localStorageLibrary = '';
    if (profileMedia) {
      localStorageTake = LocalStorageConstants.ProfileMediaTake;
      localStorageLibrary = LocalStorageConstants.ProfileMediaLibrary;
    } else {
      localStorageTake = LocalStorageConstants.ModuleMediaTake;
      localStorageLibrary = LocalStorageConstants.ModuleMediaTake;
    }
    return new Promise(async (resolve, reject) => {
      try {
        let image: any;
        const options: CameraOptions = {
          allowEdit : true,
          quality: 100,
          targetWidth: 1000,
          targetHeight: 1000,
          destinationType: this.camera.DestinationType.DATA_URL,
          encodingType: this.camera.EncodingType.JPEG,
          correctOrientation: true,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }
        let alert = await this.alertCtrl.create({
          header:'profilePicHeader',
          message: 'profilePicOptions',
          buttons: [
            {
              text: 'cancel',
              handler: data => { }
            },
            {
              text: 'galleryOption',
              handler: () => {
                this.getLocalStorageItem(localStorageLibrary).then((data) => {
                  if (data) {
                    this.camera.getPicture(options).then(async (imageData) => {
                      image = 'data:image/jpeg;base64,' + imageData;
                      this.bigImg = image;
                      this.bigSize = this.getImageSize(this.bigImg);
                      console.log("gal img big", image, this.bigSize);
                      if (this.bigSize >= 300) {
                        let smallImgData = this.createThumbnail();
                        resolve(smallImgData);
                      } else {
                        resolve(image);
                      }
                    });
                  } else {
                    this.showToast('mediaConfigLibraryError', "top");
                  }
                });
              }
            },
            {
              text: 'takePhotoOption',
              handler: () => {
                this.getLocalStorageItem(localStorageTake).then((data) => {
                  if (data) {
                    options.sourceType = this.camera.PictureSourceType.CAMERA;
                    this.camera.getPicture(options).then(async (imageData) => {
                      image = 'data:image/jpeg;base64,' + imageData;
                      this.bigImg = image;
                      this.bigSize = this.getImageSize(this.bigImg);
                      console.log("gal img big", image, this.bigSize);
                      if (this.bigSize >= 300) {
                        let smallImgData = this.createThumbnail();
                        resolve(smallImgData);
                      } else {
                        resolve(image);
                      }
                    });
                  } else {
                    this.showToast('mediaConfigTakeError', "top");
                  }
                });
              }
            }
          ]
        });
        await alert.present();
      } catch (e) {
        reject('errorMsg');
      }
    });
  }


  /** Method to check image size*/
  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return ((data_url.length - head.length) * 3 / 4 / (1024)).toFixed(4);
  }

  /** Method to compress image size*/
  createThumbnail() {
    return new Promise(async (resolve, reject) => {
      this.generateFromImage(this.bigImg, 700, 700, 1, data => {
        debugger;
        this.smallImg = data;
        let smallSize = this.getImageSize(this.smallImg);
        console.log("big img size", this.bigSize);
        console.log("createThumbnail small size", smallSize);
        resolve(this.smallImg);
      });
    });
  }

  /** Method to compress image size*/
  generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();

    image.onload = () => {
      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);

      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl)
    }
    image.src = img;
  }
}