import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { SharedService } from '../services /shared.service';
import { AppService } from '../services /app-service';
import { InformationfeedService } from '../informationfeed/services/informationfeed.service';
import{InformationFeed} from '../informationfeed/model/informationfeed.model'
import { from } from 'rxjs';
import { NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  completeArray: InformationFeed[] = [];
  constructor(private platform: Platform,
    private sharedService: SharedService,
    private appService: AppService,
    private informationFeedService: InformationfeedService,
    private navCtrl: NavController,) {}
  aboutUs(){
    this.navCtrl.navigateBack("/aboutus");
  }
  ionViewWillEnter(){
    
    this.completeArray = [];
    this.informationFeedService.getNewsFeed().then((data: any) => {
      this.completeArray = data;
      console.log("hello",this.completeArray)
      this.appService.setfeedData(this.completeArray);
    }, (error) => {
      this.sharedService.showToast(error, "top");
    });   

  }
  openNewsFeedList() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        newsData: JSON.stringify(this.completeArray)
      }
    };
    this.informationFeedService.newfeedListShow = true;
    this.navCtrl.navigateForward(['/aboutus']);
  }
  openNewsFeed(index) {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        selectedNewsIndex: JSON.stringify(index)
      }
    };
    this.informationFeedService.newfeedListShow = false;
    this.navCtrl.navigateForward(['/news-feed/selected-news'], navigationExtras);

  }
  anonycounsel(){
    this.navCtrl.navigateForward(['/anonycounsel'])
  }
  forum(){
    this.navCtrl.navigateForward(['/forum'])
  }
}
