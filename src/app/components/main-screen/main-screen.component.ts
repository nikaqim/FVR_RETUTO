import { 
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  SimpleChanges
} from '@angular/core';

import { Subscription } from 'rxjs';

import { ButtonGroup } from '../shared/btn-group/btn-group.model';
import { BtnGroupService } from '../../services/btn.service';
import { BtnGroupConfig } from '../shared/btn-group/btn-group-config.model';
import { TranslateService } from '@ngx-translate/core';

import { WsService } from '../../services/ws.service';

// import { CyranoTutorialService } from 'cyranoTutorial';
// import { CyranoTutorial } from 'cyranoTutorial';
// import { CyranoTutorialConfig } from 'cyranoTutorial';

import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkthroughConfigService } from '../../services/tuto.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit, OnDestroy {
  private subs = new Subscription();  

  buttonGroup :ButtonGroup[] = [];
  tutoData:CyranoTutorialConfig = {};

  panels:string[] = [];

  walkthroughActive:string = '';

  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];

  constructor(
    private wsService: WsService,
    private btnGroupService: BtnGroupService,
    private walkService: WalkthroughConfigService,
  ){
    // this.walkService.loadWalkthrough();
    this.btnGroupService.getButtonConfig().subscribe((data:BtnGroupConfig) => {
      this.buttonGroup = data['btngroup'];
    });
  }

  ngOnInit(): void {

    this.subs.add(
      this.wsService.listen('btnJsonUpdate').subscribe((msg:BtnGroupConfig) => {
        
        this.buttonGroup = typeof msg === 'string' ? JSON.parse(msg)['btngroup'] : msg['btngroup'];
      })
    );

    this.subs.add(
      this.walkService.onFinishLoadWalkThru().subscribe((data)=>{
        console.log('tuto data -> ',data)
        this.tutoData = this.walkService.getConfig();      
        this.panels = Object.keys(this.tutoData);
      })
    );
  }

  setBtnGroupReady(data: string){
    this.btnGroupService.notifyButtonGrpReady(data);
  }

  setActiveBtn(id: string){
    console.log("this.setActiveBtn:",id);
    if(id !== ''){
      this.walkthroughActive = id;
      this.btnGroupService.notifyButtonGrpReady(id);
    } else {
      this.walkthroughActive = '';
    }
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }


  
}
