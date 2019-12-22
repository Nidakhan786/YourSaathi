/** Common Dependencies Import*/
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedService } from './services /shared.service';
import { AppService } from './services /app-service';
import { ParseService } from './services /parse.service';
import { CryptoService } from './services /crypto.service';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
/**Close Common Dependencies Import*/
/** Module Import */
import{BaseService} from './services /base-service'
/** Close Module Import*/




@NgModule({
  declarations: [],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
 
    SharedService,
    AppService,
    ParseService,
    CryptoService,
    BaseService,
  ],
  exports:[]
})
export class SharedModule { }
