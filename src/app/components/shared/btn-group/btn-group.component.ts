import { 
  Component, 
  EventEmitter, 
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  AfterViewInit,
  OnInit
} from '@angular/core';

import { BtnGroupService } from '../../../services/btn.service';
import { ButtonGroup } from './btn-group.model';
import { BtnGroupConfig } from './btn-group-config.model';
import { Button } from '../button/button.model';
import { TutoService } from '../../../services/tuto.service';
import { CyranoTutorialService } from 'cyranoTutorial';

// import { CyranoTutorialService } from '../../../../../projects/cyrano-tutorial/src/public-api';

@Component({
  selector: 'app-btn-group',
  templateUrl: './btn-group.component.html',
  styleUrl: './btn-group.component.scss'
})

export class BtnGroupComponent implements OnChanges, AfterViewInit, OnInit {

  @Input() id:string = '';
  @Input() type:string = 'vert';
  @Input() buttons:Button[] = [];
  @Input() screenId:string = '';

  buttonIds:string[] = [];
  // parentScreenContainer;

  @Output() ButtonGroupReady = new EventEmitter<string>();
  //  @Input() buttonGroup :ButtonGroup[] = [];

 isTypeVertical = false;

 constructor(
    private btnService: BtnGroupService,
    private walkService: CyranoTutorialService
  ){

  // on walkthru navigate next focus nextElement/btn 
  this.walkService.onTutoNavigation().subscribe((btnId)=>{
    if(btnId){
      // console.log("BtnClick:",btnId, this.btnService.getScreenContainerId(btnId));
      const parentId = this.btnService.getScreenContainerId(btnId)
      this.walkService.scrollIntoView(parentId)
      
    }
  });


 }

 ngOnInit():void {
 }

 ngOnChanges(changes: SimpleChanges): void {
     if(changes['id']){
      this.isTypeVertical = this.type === 'vert';
      
      this.buttons.forEach(btn => {
        this.buttonIds.push(btn.id);
      });
     }
 }

 ngAfterViewInit(){
  // BtnGroupService.notifyButtonGrpReady(0)
  this.ButtonGroupReady.emit(this.buttonIds.join())

 }
}
