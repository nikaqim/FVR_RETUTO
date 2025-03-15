import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

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

  private walkConfigSubject = new BehaviorSubject<CyranoTutorialConfig>({
  });

  private walkthroughTextSubject = new BehaviorSubject<CyranoTutorialConfig>({
  });

  steps:CyranoTutorial[] = [];
  descrList: WalkDescrMap = {};
  step2screen: WalkStepMap = {};
  restartTabulatedIds: boolean = false;
  
  walkconfig: CyranoTutorialConfig = {};
  tabulatedId:string[] = [];

  constructor(
    private httpClient:HttpClient,
    private localStorage:LocalStorageService) {
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
    console.log("loading walkthru")
    let walkthruInStorage = this.localStorage.getData(StorageId.WalkConfig);
    let isInStorage =  Object.keys(JSON.parse(walkthruInStorage)).length > 0;

    console.log(walkthruInStorage, typeof walkthruInStorage, isInStorage);

    if(!isInStorage){
      this.getWalkhroughData().subscribe((data:CyranoTutorialConfig) => {
        this.steps = this.tabulateStep(data);
        this.descrList = this.tabulateDescr(this.steps);
        this.walkConfigSubject.next(data);
      });
    } else {
      this.steps = this.tabulateStep(JSON.parse(walkthruInStorage))
      this.descrList = this.tabulateDescr(this.steps);
      this.walkConfigSubject.next(JSON.parse(walkthruInStorage));
    }
  }

  resetWalkthrough(){
    this.localStorage.setData(StorageId.WalkConfig, '');
  }

  // // Listen for messages from the server
  // listen2Sock(): Observable<any> {
  //     return this.socket.asObservable();
  // }

  // // Send data to the server
  // sendSockMessage(event: string, message: any) {
  //   this.socket.next(message);
  // }

  // // Disconnect from the server
  // disconnect() {
  //     if (this.socket) {
  //         this.socket.complete();
  //     }
  // }

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

  onJsonUpdate(){
    
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

  getSteps(){
    return this.steps;
  }

  resetTabulatedId(){
    this.restartTabulatedIds = true;
  }


  tabulateStep(confData:CyranoTutorialConfig){
    console.log('tabulating steps')
    if(this.restartTabulatedIds){
      this.tabulatedId = [];
      this.steps = [];
      this.restartTabulatedIds = false;
    }

    console.log(typeof confData);
    // create duplicate of data
    this.walkconfig = typeof confData === 'string' ? JSON.parse(confData) : 
    JSON.parse(JSON.stringify(confData));

    console.log("this.walkconfig", this.walkconfig);

    // save to local storage for testing
    this.localStorage.setData(
      StorageId.WalkConfig, JSON.stringify(this.walkconfig)
    );

    // tabulate different tutorial screen into 1
    Object.keys(this.walkconfig).forEach(screen => {

      if(this.walkconfig[screen].length){
        this.walkconfig[screen].forEach(step => {
          if(!this.tabulatedId.includes(step.id)){
            console.log("update value in here")

            // store all step info
            this.steps.push(step);

            // take descr of each step
            // this.descrList[step.id] = step.textDescr; 

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

    // this.walkConfigSubject.next(this.walkconfig);
    console.log("this.steps:",this.steps);
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
    console.log("description list");
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
          console.log('updating text', JSON.stringify(this.walkconfig));
          
          this.steps = this.tabulateStep(this.walkconfig);
          this.notifyTextChange(this.walkconfig);

          break;
        }
      }; 
    }

    console.log("finish updatetxt")
  }

  notifyTextChange(updatedData: CyranoTutorialConfig){
    console.log("notifyTextChange: this.steps =>",this.steps.length, JSON.stringify(this.steps));
    this.descrList = this.tabulateDescr(this.steps);
    console.log("notifyTextChange: this.descrList =>",JSON.stringify(this.descrList));

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
