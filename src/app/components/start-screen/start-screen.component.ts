import { 
  Component
} from '@angular/core';

import { TutoService } from '../../services/tuto.service';
import { CyranoTutorialConfig } from '../../model/cyrano-walkthrough-cfg.model';
import { CyranoTutorial } from '../../model/cyrano-walkthrough.model';
import { WalkDescrMap } from '../../model/cyrano-walkthrough-screenmap.model';
@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  steps:WalkDescrMap = {};

  constructor(
    private walkService:TutoService
  ){
    this.walkService.loadWalkthrough();
  }

  ngOnInit(): void {
      this.walkService.onFinishLoadWalkThru().subscribe((data:CyranoTutorialConfig) => {
        if(data){
          this.steps = this.walkService.getAllDescr();
        }
      });
  }

}
