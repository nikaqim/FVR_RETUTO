import { 
  Component,
  Input,
  OnDestroy,
  OnInit,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  OnChanges,
  SimpleChanges,
  HostListener
} from '@angular/core';

import { Subscription } from 'rxjs';
import { CyranoTutorial } from './models/cyrano-tutorial.model';
import { CyranoTutorialConfig } from './models/cyrano-tutorial-config.model';

import { 
  WalkthroughComponent,
  WalkthroughNavigate,
} from 'angular-walkthrough';

import { CyranoTutorialService } from './services/cyrano-tutorial.service';

@Component({
  selector: 'lib-cyranoTutorial',
  templateUrl: './cyrano-tutorial.component.html',
  styleUrls: [`./cyrano-tutorial.component.scss`]
})
export class CyranoTutorialComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  private subs = new Subscription();  

  @ViewChild('tutorWrapper') tutorWrapper!: ElementRef<HTMLDivElement>;
  @ViewChildren(WalkthroughComponent) walkthroughComponents!: QueryList<WalkthroughComponent>;
  @ViewChildren('navigations') navElements!: QueryList<ElementRef>;

  // receive walkthrough config for each steps
  @Input() data:CyranoTutorialConfig = {};
  @Input() addSwiperNav:boolean = false;

  steps: CyranoTutorial[] = [];
  panels:string[] = [];
  activeScreenId:string = ""; 
  activeId: string = "";

  constructor( 
      private tutoService: CyranoTutorialService
  ){}

  ngOnInit(): void {      

    this.subs.add(
      WalkthroughComponent.onOpen.subscribe((comp: WalkthroughComponent)=>{
        console.log(`${comp.id} is open`);
      })
    );

    this.subs.add(
      WalkthroughComponent.onNavigate
      .subscribe((comt: WalkthroughNavigate) => {
        console.log(`${comt.previous.id} is navigating`);
        const current = this.tutoService.getById(comt.next.id);
        this.activeId = comt.next.id;
        if(current){
          this.tutoService.notifyTutoNavigation(current)
        }
      })
    );

    this.subs.add(
      this.tutoService.onSwiperChanged()
        .subscribe((screen:string) => {
        console.log(`setting ${screen} as active..`);
        this.activeScreenId = screen;
        // const targetEl = this.navElements.find(el => el.nativeElement.id === screen);
        // if(targetEl){
        //   targetEl.nativeElement.classList.
        // }

      })
    );

    this.subs.add(
      this.tutoService.onStartTuto().subscribe((id)=>{
        this.open(id);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['data']){
        this.steps = this.tutoService.tabulateStep(this.data);
        this.panels = this.tutoService.getScreens();
        console.log("this.panels ->",this.panels);
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
      console.log("screen on resize...");
      this.construct_walk();
  }

  ngAfterViewInit(): void {
    this.construct_walk();
  }

  /**
   * Assigning walkthrough attributes setting value
   */
  construct_walk(): void {

    setTimeout(()=> {
      console.log("this.walkthroughComponents:",this.walkthroughComponents);

      if(this.walkthroughComponents){

        this.walkthroughComponents.forEach((walkthru, idx, arr) => {  
          const step = this.steps.find(s=>s.id === walkthru.id);
          console.log("register walk");

          if(step?.id){
            this.tutoService.register(step.id, walkthru);
          }
        });
  
        this.steps.forEach(step => {
          const current = this.tutoService.getById(step.id);
    
          if(current){
            current.alignContent = step.contentAlign === "left" ? 'left' :
              step.contentAlign === "right" ? 'right':
              step.contentAlign === "content" ? 'content' : 'center';
            
            current.verticalAlignContent = step.contentVertAlign === "above" ? 'above' :
            step.contentVertAlign === "center" ? 'center' : step.contentVertAlign === "top" ? 'top':
            step.contentVertAlign === "bottom" ? 'bottom' : 'below';

            current.showArrow = step.showArrow ? step.showArrow : false;
            current.closeAnywhere = step.closeAnywhere ? step.closeAnywhere : false;
            current.finishButton = step.showFinishBtn ? step.showFinishBtn : false;
            current.contentSpacing = 0;
            current.verticalContentSpacing= 50;
            current.focusBackdrop = true;
            current.focusGlow = true;
            // current.rootElement = ".main-page";
            current.focusElementSelector = window.innerWidth < 551 ?
              step.focusElementId :
              ('#' + this.tutoService.getScreenById(step.id) + step.focusElementId.replace('#','')).toLowerCase();
            
            console.log(window.innerWidth, "|| current.focusElementSelector:",current.focusElementSelector);
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

        console.log("this.steps:",this.steps);
        if(this.steps.length > 0){
          this.open(this.steps[0].id);
          this.activeId = this.steps[0].id;
          this.tutoService.activateSwipeNav(this.steps[0].id);
        }
      }
    },100)    
  }

  navigateWalkThru(){    
    const current = this.tutoService.getById(this.activeId);

    if(current && current.nextStep.id){
      console.log("click on container", this.tutoService.getScreenById(current.nextStep.id));
      this.tutoService.scrollIntoView(this.tutoService.getScreenById(current.nextStep.id));
      WalkthroughComponent.walkthroughNext();  
    }
  }

  /**
   * Open walkthrough by stepId
   */
  open(stepId: string): void {
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
  close(){
    const container = document.querySelector('.wkt-finish-link');
    if (container) {
        (container as HTMLElement).click();

        // remove active class
        this.activeScreenId = '';
    }
  }

  ngOnDestroy(): void {
    this.steps.forEach(step => this.tutoService.unregister(step.id));
  }

}
