import { 
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';

import { WalkthroughConfigService } from '../../services/tuto.service';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { WalkDescrMap } from '../../model/cyrano-walkthrough-screenmap.model';

import { WsService } from '../../services/ws.service';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  steps:WalkDescrMap = {};
  @ViewChildren('inputDescr') inputElements!: QueryList<ElementRef>;

  constructor(
    private wsService: WsService,
    private walkService:WalkthroughConfigService
  ){}

  ngOnInit(): void {

      this.wsService.listen('btnJsonUpdate').subscribe((msg:string) => {
        // console.log("start-screen - websocket msg@btnJsonUpdate ->", msg);
      });
      
      this.walkService.onFinishLoadWalkThru().subscribe((data:CyranoTutorialConfig) => {
        // console.log("nginit")
        if(data){
          this.steps = this.walkService.getAllDescr();
          // console.log(this.steps);
        }
      });
  }

  ngAfterViewInit(): void {
      // console.log('Afterview init');
  }

  onInputChange(key:string, event:Event){
    // console.log("this.onInputChange",event);
    const inputElement = event.target as HTMLInputElement;
 
    const cursorPosition = inputElement.selectionStart; // ✅ Get cursor position
    const text = inputElement.value;

    this.walkService.updateText(key, text);

    // console.log("onInputChnge:this.steps",this.steps)
  }

  ngOnDestroy(): void {
      // console.log('Component destroyed');
  }

}
