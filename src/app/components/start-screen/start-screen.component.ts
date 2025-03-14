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
import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { WalkDescrMap } from '../../model/cyrano-walkthrough-screenmap.model';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  steps:WalkDescrMap = {};
  @ViewChildren('inputDescr') inputElements!: QueryList<ElementRef>;

  constructor(
    private walkService:WalkthroughConfigService
  ){}

  ngOnInit(): void {
      
      this.walkService.onFinishLoadWalkThru().subscribe((data:CyranoTutorialConfig) => {
        console.log("nginit")
        if(data){
          this.steps = this.walkService.getAllDescr();
          console.log(this.steps);
        }
      });
  }

  ngAfterViewInit(): void {
      console.log('Afterview init');
  }

  onInputChange(key:string, event:Event){
    console.log("this.onInputChange",event);
    const inputElement = event.target as HTMLInputElement;
 
    const cursorPosition = inputElement.selectionStart; // ✅ Get cursor position
    const text = inputElement.value;

    this.walkService.updateText(key, text);

    // setTimeout(() => {
    //     inputElement.focus(); // ✅ Restore focus
    //     inputElement.setSelectionRange(cursorPosition, cursorPosition); // ✅ Restore cursor position
    // }, 0);

    console.log("onInputChnge:this.steps",this.steps)
  }

  ngOnDestroy(): void {
      console.log('Component destroyed');
  }

}
