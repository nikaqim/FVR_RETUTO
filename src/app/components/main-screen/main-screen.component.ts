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

// import { CyranoTutorialService } from 'cyranoTutorial';
// import { CyranoTutorial } from 'cyranoTutorial';
// import { CyranoTutorialConfig } from 'cyranoTutorial';

import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { TutoService } from '../../services/tuto.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})
export class MainScreenComponent implements OnInit, OnChanges {
  buttonGroup :ButtonGroup[] = [];
  tutoData:CyranoTutorialConfig = {};

  panels:string[] = [];

  availableLanguages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];

  constructor(
    private btnGroupService: BtnGroupService,
    private walkService: TutoService,
  ){
    this.btnGroupService.getButtonConfig().subscribe((data:BtnGroupConfig) => {
      this.buttonGroup = data['btngroup'];
    });

    this.walkService.onFinishLoadWalkThru().subscribe((data)=>{
      console.log('tuto data -> ',data)
      this.tutoData = data;      
      this.panels = Object.keys(data);
    });

    this.walkService.loadWalkthrough();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {   
  }

  ngAfterViewInit(){
  }

  setBtnGroupReady(data: string){
    this.btnGroupService.notifyButtonGrpReady(data);
  }


  
}
