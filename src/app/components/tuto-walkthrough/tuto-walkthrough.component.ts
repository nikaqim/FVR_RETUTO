import { 
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  TemplateRef,
  SimpleChanges
} from '@angular/core';

import { map, Subscription } from 'rxjs';
import { TutoWalkThrough } from './tuto-walkthrough.model';

import { 
  WalkthroughComponent,
  WalkthroughContainerComponent,
  WalkthroughEvent,
  WalkthroughNavigate,
  WalkthroughTextI
} from 'angular-walkthrough';

import { BtnGroupService } from '../../services/btn.service';
import { TutoService } from '../../services/tuto.service';

@Component({
  selector: 'app-tuto-walkthrough',
  templateUrl: './tuto-walkthrough.component.html',
  styleUrl: './tuto-walkthrough.component.scss'
})
export class TutoWalkthroughComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('walk1') walk1!: WalkthroughComponent;
    @ViewChild('tutorWrapper') tutorWrapper!: ElementRef<HTMLDivElement>;

    steps: TutoWalkThrough[] = [];

    @ViewChildren(WalkthroughComponent) walkthroughComponents!: QueryList<WalkthroughComponent>;

    private subs = new Subscription();


    constructor( 
        private btnGroupService: BtnGroupService,
        private tutoService: TutoService
    ){}

  ngOnInit(): void {
      this.subs.add(
        this.btnGroupService.onNotifyButtonReady()
        .subscribe((btnIds:string) => {
        })
      );

      this.subs.add(
        this.tutoService.onFinishLoadWalkThru()
        .subscribe((data) => {
            this.steps = data['walkthroughs'].slice();
            this.construct_walk();
        })
      );

      this.subs.add(
        WalkthroughComponent.onNavigate
        .subscribe((comt: WalkthroughNavigate) => {
          const current = this.tutoService.getById(comt.next.id);

          if(current){
            this.tutoService.notifyTutoNavigation(current.focusElementSelector)
          }
        })
      );

      this.subs.add(
        this.tutoService.onStartTuto().subscribe((id)=>{
          this.openStep(id);
        })
      );
  }

  ngAfterViewInit(): void {}

  /**
   * Assigning walkthrough attributes setting value
   */
  construct_walk(): void {

    setTimeout(()=> {
      if(this.walkthroughComponents){

        this.walkthroughComponents.forEach((walkthru, idx, arr) => {  
          const step = this.steps.find(s=>s.id === walkthru.id);

          if(step?.id){
            this.tutoService.register(step.id, walkthru);
          }
        });
  
        this.steps.forEach(step => {
          const current = this.tutoService.getById(step.id);
    
          if(current){
            // current.alignContent = "center";
            current.verticalAlignContent = "below";
            current.showArrow = step.showArrow ? step.showArrow : true;
            current.closeAnywhere = step.closeAnywhere ? step.closeAnywhere : false;
            current.finishButton = step.showFinishBtn ? step.showFinishBtn : false;
            current.contentSpacing = 0;
            current.verticalContentSpacing= 50;
            current.focusBackdrop = true;
            current.focusGlow = true;
            // current.focusHighlightAnimation = true
          }
          
          if (step.nextStepId) {
              const next = this.tutoService.getById(step.nextStepId);
              if (current && next) {
                  current.nextStep = next;
              }
          }
    
          if(step.prevStepId){
              const prev = this.tutoService.getById(step.prevStepId);
              if(current && prev){
                current.previousStep = prev;
              }
          }
        });

      this.openStep(this.steps[0].id);
      }
    },100)    
  }

  onFinishWalk(data:string){
    console.log("on finish walk ->", data);
  }

  /**
   * Open walkthrough by stepId
   */
  openStep(stepId: string): void {
    const targetWalkthrough = this.walkthroughComponents.find(wt => wt.id === stepId);
    
    if (targetWalkthrough) {
        targetWalkthrough.open();
    } else {
        console.warn(`Walkthrough with id '${stepId}' not found`);
    }  
  }

  /**
   * Close walkthrough
   */
  closeWalk1(){
    const container = document.querySelector('.wkt-finish-link');
    if (container) {
        (container as HTMLElement).click();
    }
  }


  ngOnDestroy(): void {
    this.steps.forEach(step => this.tutoService.unregister(step.id));
  }
}
