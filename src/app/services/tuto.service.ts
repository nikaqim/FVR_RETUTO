import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { CyranoTutorial } from '../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../model/cyrano-walkthrough-cfg.model';
import { WalkStepMap } from '../model/cyrano-walkthrough-screenmap.model';

import { WalkthroughComponent } from 'angular-walkthrough';

@Injectable({
  providedIn: 'root'
}) export class TutoService {

  private walkthroughs = new Map<string, WalkthroughComponent>();
  private tutorNavigateSubject = new BehaviorSubject<string>("");
  private startTutoSubject = new BehaviorSubject<string>("");
  private swiperNavSubject = new BehaviorSubject<string>("");

  private walkConfigSubject = new BehaviorSubject<CyranoTutorialConfig>({
    walkthroughs: []
  });

  steps:CyranoTutorial[] = [];
  step2screen: WalkStepMap = {};
  walkconfig: CyranoTutorialConfig = {};
  tabulatedId:string[] = [];

  constructor(private httpClient:HttpClient) {
    this.loadWalkthrough();
  }

  register(id:string, walkthrough:WalkthroughComponent){
    this.walkthroughs.set(id,walkthrough);
  }

  unregister(id:string){
    this.walkthroughs.delete(id);
  }

  getWalkhroughData(): Observable<CyranoTutorialConfig> {
    return this.httpClient.get<CyranoTutorialConfig>('/assets/config/walkthrough.json');
  }

  /**
   * Loading Walkthrough Configuration Object
   */
  loadWalkthrough(){
    this.getWalkhroughData().subscribe((data:CyranoTutorialConfig) => {
      this.walkConfigSubject.next(data);
    });
  }

  onFinishLoadWalkThru(){
    return this.walkConfigSubject.asObservable();
  }

  notifyTutoNavigation(nextId:WalkthroughComponent){

    this.tutorNavigateSubject.next(nextId.focusElementSelector);
    this.swiperNavSubject.next(this.getScreenById(nextId.id));
  }

  activateSwipeNav(id:string){
    this.swiperNavSubject.next(this.getScreenById(id));
  }

  onTutoNavigation(){
    return this.tutorNavigateSubject.asObservable();
  }

  onSwiperChanged(){
    return this.swiperNavSubject.asObservable();
  }

  startTuto(id:string){
    this.startTutoSubject.next(id);
  }

  onStartTuto(){
    return this.startTutoSubject.asObservable();
  }

  getById(id: string): WalkthroughComponent | undefined {
    return this.walkthroughs.get(id);
  }

  openWalk(id:string){
    this.walkthroughs.get(id)?.open();
  }

  tabulateStep(confData:CyranoTutorialConfig){
    // create duplicate of data
    this.walkconfig = JSON.parse(JSON.stringify(confData));

    // tabulate different tutorial screen into 1
    Object.keys(confData).forEach(screen => {
      if(confData[screen].length){
        confData[screen].forEach(step => {
          if(!this.tabulatedId.includes(step.id)){

            this.steps.push(step);
            this.tabulatedId.push(step.id);

            // screen screen id for each step
            if(!this.step2screen[step.id]){
              this.step2screen[step.id] = screen;
            }
          }
        });
      }
    });

    return this.steps; 
  }

  getStepLen(){
    return this.steps.length
  }

  getStepById(id:string){
    let dWalk = null;
    
    for(const stepData of this.steps){
      if(stepData.id === id){
        dWalk = JSON.parse(JSON.stringify(stepData));
        break;
      }
    }

    return dWalk;
  }

  getScreens(){
    return Object.keys(this.walkconfig);
  }

  getScreenById(id:string){
    return this.step2screen[id];
  }

  scrollIntoView(elementId:string){
    const parentEl = document.getElementById(elementId);
    console.log("Scroll to el ->", parentEl);
      if(parentEl){
        parentEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
  }



  
}
