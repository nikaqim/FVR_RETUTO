import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

// import { WsService } from './ws.service';

import { LocalStorageService } from './local-storage.service';
import { StorageId } from '../enums/localstorageData.enum';

import { CyranoTutorial } from '../model/cyrano-walkthrough.model';
import { CyranoTutorialConfig } from '../model/cyrano-walkthrough-cfg.model';
import { WalkStepMap, WalkDescrMap } from '../model/cyrano-walkthrough-screenmap.model';

import { WalkthroughComponent } from 'angular-walkthrough';

@Injectable({
  providedIn: 'root'
}) export class WalkthroughConfigService {

  private walkthroughs = new Map<string, WalkthroughComponent>();
  private tutorNavigateSubject = new BehaviorSubject<string>("");
  private startTutoSubject = new BehaviorSubject<string>("");
  private swiperNavSubject = new BehaviorSubject<string>("");
  private closeTutoSubject = new BehaviorSubject<boolean>(false);

  private walkConfigSubject = new BehaviorSubject<CyranoTutorialConfig>({});
  // private walkConfigSubject = new Subject<CyranoTutorialConfig>();

  private walkthroughTextSubject = new BehaviorSubject<CyranoTutorialConfig>({
  });

  steps:CyranoTutorial[] = [];
  descrList: WalkDescrMap = {};
  step2screen: WalkStepMap = {};
  restartTabulatedIds: boolean = false;
  
  walkconfig: CyranoTutorialConfig = {};
  tabulatedId:string[] = [];
  activeId:string = '';

  constructor(
    private httpClient:HttpClient,
    private localStorage:LocalStorageService) {
      console.log("in tuto construct")
      this.loadWalkthrough();
  }

  register(id:string, walkthrough:WalkthroughComponent){
    this.walkthroughs.set(id,walkthrough);
  }

  unregister(id:string){
    this.walkthroughs.delete(id);
  }

  getParentPosition(child: HTMLElement, targetClass:string){
    let parent = child.parentElement;

    while (parent && !parent.classList.contains(targetClass)) {
      parent = parent.parentElement;
    }
  
    if (parent) {
      // 1. CSS position (e.g., relative, absolute)
      const computedStyle = window.getComputedStyle(parent);
      const cssPosition = computedStyle.position;
  
      // 2. Offset position (x, y)
      const rect = parent.getBoundingClientRect();
      const x = rect.left + window.scrollX;
      const y = rect.top + window.scrollY;
  
      console.log('CSS Position:', cssPosition);
      console.log('Offset X:', x, 'Y:', y);
  
      return {
        cssPosition,
        x,
        y,
        element: parent
      };
    }
  
    return null;
  }

  getWalkhroughData(): Observable<CyranoTutorialConfig> {
    return this.httpClient.get<CyranoTutorialConfig>('/assets/config/walkthrough.json');
  }

  /**
   * Loading Walkthrough Configuration Object
   */
  loadWalkthrough(){
    // console.log("loading walkthru")
    let walkthruInStorage = this.localStorage.getData(StorageId.WalkConfig);

    // console.log(walkthruInStorage, typeof walkthruInStorage);

    let isInStorage = (typeof walkthruInStorage === 'string' && walkthruInStorage !== '') || 
      (typeof walkthruInStorage === 'object' && Object.keys(JSON.parse(walkthruInStorage)).length > 0);

    // console.log(walkthruInStorage, typeof walkthruInStorage, isInStorage);

    if(!isInStorage){
      console.log("not isinstorage");
      
      this.getWalkhroughData().subscribe((data:CyranoTutorialConfig) => {
        this.steps = this.tabulateStep(data);
        this.descrList = this.tabulateDescr(this.steps);
        this.walkconfig = data;
        this.walkConfigSubject.next(data);
      });
    } else {
      console.log("isinstorage");

      this.steps = this.tabulateStep(JSON.parse(walkthruInStorage))
      this.descrList = this.tabulateDescr(this.steps);
      this.walkconfig = JSON.parse(walkthruInStorage);
      this.walkConfigSubject.next(JSON.parse(walkthruInStorage));
    }
  }

  getConfig(){
    return this.walkconfig;
  }

  implementMarkUp(descr:string){
    return descr.replace(/##\s*(.*?)\s*##/g, '<b>$1</b>');
  }

  reverseMarkUp(descr:string){
    return descr.replace(/<b>\s*(.*?)\s*<\/b>/g, '## $1 ##');
  }

  resetWalkthrough(){
    this.localStorage.setData(StorageId.WalkConfig, '');
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

  closeTuto(){
    console.log("this.startTuto");
    this.closeTutoSubject.next(true);
  }

  onTutoClose(){
    return this.closeTutoSubject.asObservable();
  }

  onSwiperChanged(){
    return this.swiperNavSubject.asObservable();
  }

  startTuto(id:string){
    console.log("this.startTuto->", id);
    this.startTutoSubject.next(id);
  }

  onStartTuto(){
    return this.startTutoSubject.asObservable();
  }

  setActiveId(id:string){
    this.activeId = id;
  }

  getActiveId():string {
    return this.activeId;
  }

  getById(id: string): WalkthroughComponent | undefined {
    return this.walkthroughs.get(id);
  }

  openWalk(id:string){
    this.walkthroughs.get(id)?.open();
  }

  getSteps(){
    return this.steps;
  }

  resetTabulatedId(){
    this.restartTabulatedIds = true;
  }


  tabulateStep(confData:CyranoTutorialConfig){
    // console.log('tabulating steps')
    if(this.restartTabulatedIds){
      this.tabulatedId = [];
      this.steps = [];
      this.restartTabulatedIds = false;
    }

    // create duplicate of data
    this.walkconfig = typeof confData === 'string' ? JSON.parse(confData) : 
    JSON.parse(JSON.stringify(confData));

    // save to local storage for testing
    this.localStorage.setData(
      StorageId.WalkConfig, JSON.stringify(this.walkconfig)
    );

    // tabulate different tutorial screen into 1
    Object.keys(this.walkconfig).forEach(screen => {

      if(this.walkconfig[screen].length){
        this.walkconfig[screen].forEach(step => {
          if(!this.tabulatedId.includes(step.id)){

            step.textDescr = this.implementMarkUp(step.textDescr);
            // store all step info
            this.steps.push(step);

            // to ensure no duplication
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

  tabulateDescr(steps:CyranoTutorial[]){
    let alldescr:WalkDescrMap = {}; 
    for(let step of steps){
      if(!alldescr[step.id]){
        alldescr[step.id] = step.textDescr; 
      }
    }

    return alldescr;
  }

  getAllDescr(){
    // console.log("description list");
    return this.descrList;
  }

  updateText(id:string, text:string){
    // get walkthrough id screen
    let screen = this.getScreenById(id);

    if(id && screen){
      for(let [index, el] of this.walkconfig[screen].entries()){
        if(el.id === id){
          // update text
          el.textDescr = text;
          this.restartTabulatedIds = true;
          
          this.steps = this.tabulateStep(this.walkconfig);
          this.notifyTextChange(this.walkconfig);

          break;
        }
      }; 
    }

  }

  notifyTextChange(updatedData: CyranoTutorialConfig){
    this.descrList = this.tabulateDescr(this.steps);

    this.walkthroughTextSubject.next(updatedData);
  }

  onNotifyTextChange(){
    return this.walkthroughTextSubject.asObservable();
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
      if(parentEl){
        // console.log("Scroll to el ->", parentEl);
        parentEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
  }



  
}
