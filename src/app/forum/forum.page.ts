import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {

  constructor( private navCtrl: NavController,) { }

  ngOnInit() {
  }
back(){
  this.navCtrl.navigateForward(['/home'])
}
}
