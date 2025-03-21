import { 
  Component, 
  EventEmitter, 
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs';
import { WsService } from '../../../services/ws.service';

import { BtnGroupService } from '../../../services/btn.service';
import { ButtonGroup } from './btn-group.model';
import { BtnGroupConfig } from './btn-group-config.model';
import { Button } from '../button/button.model';
import { WalkthroughConfigService } from '../../../services/tuto.service';

@Component({
  selector: 'app-btn-group',
  templateUrl: './btn-group.component.html',
  styleUrl: './btn-group.component.scss'
})

export class BtnGroupComponent implements OnChanges, AfterViewInit, OnInit, OnDestroy {

  @Input() id:string = '';
  @Input() type:string = 'vert';
  @Input() buttons:Button[] = [];
  @Input() screenId:string = '';
  @Input() activeId:string = '';

  private subs = new Subscription();  

  buttonIds:string[] = [];
  // parentScreenContainer;

  @Output() ButtonGroupReady = new EventEmitter<string>();
  //  @Input() buttonGroup :ButtonGroup[] = [];

 isTypeVertical = false;

 constructor(
    private wsService: WsService,
    private btnService: BtnGroupService,
    private walkService: WalkthroughConfigService
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
  this.subs.add(
      this.wsService.listen('btnJsonUpdate').subscribe((msg:ButtonGroup) => {
        // console.log("btnGroup-screen - websocket msg@btnJsonUpdate ->", msg);
      })
  );
 }

 ngOnChanges(changes: SimpleChanges): void {
     if(changes['id']){
      // console.log('this.activeId',this.activeId, 'screenId', this.screenId);
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

  getButtonPosition(index: number, total: number) {
    const radius = 50 + (total * 7); // Dynamically increase arc size
    const startAngle = Math.PI / 2; // Start at 180 degrees (semi-circle)
    const endAngle = (3 * Math.PI)/2; // End at 360 degrees

    // 🔄 Reverse the order by inverting the index
    const reversedIndex = total - 1 - index;

    const angle = startAngle + ((endAngle - startAngle) / (total - 1)) * reversedIndex; // Distribute buttons evenly

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return {
      transform: `translate(${x}px, ${y}px)`
    };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe(); // ✅ Unsubscribe from all subscriptions
  }

  
}
