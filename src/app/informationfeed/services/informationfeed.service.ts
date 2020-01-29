import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../services /base-service';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InformationfeedService {
 newfeedListShow: boolean = false;
  constructor( private baseService: BaseService,
    private platform: Platform,
    private http:HttpClient) { }


  getNewsFeed() {
    return new Promise(async (resolve, reject) => {
   
    
          this.http.get("../../../assets/infofeed/info.json").subscribe(
            data => {
            
              let completeArray: any;
              completeArray = data;  // FILL THE ARRAY WITH DATA.
              resolve(completeArray);
          })
    });
    }
    
}
