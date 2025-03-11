import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { TutoWalkThrough } from '../components/tuto-walkthrough/tuto-walkthrough.model';
import { TutoWalkThroughConfig } from '../components/tuto-walkthrough/tuto-walkthrough-config.model';
import { WalkthroughComponent } from 'angular-walkthrough';

@Injectable({
  providedIn: 'root'
}) export class TutoService {

  private walkthroughs = new Map<string, WalkthroughComponent>();
  private walkConfigSubject = new BehaviorSubject<TutoWalkThroughConfig>({
    walkthroughs: []
  });

  private tutorNavigateSubject = new BehaviorSubject<string>("");
  private startTutoSubject = new BehaviorSubject<string>("");

  walkConfig:TutoWalkThrough[] = [];

  constructor(private httpClient:HttpClient) {
    this.loadWalkthrough();
  }

  getWalkhroughData(): Observable<TutoWalkThroughConfig> {
    return this.httpClient.get<TutoWalkThroughConfig>('/assets/config/walkthrough.json');
  }

  loadWalkthrough(){
    this.getWalkhroughData().subscribe((data:TutoWalkThroughConfig) => {
      console.log(data);
      this.walkConfigSubject.next(data);
      if(data["walkthroughs"]){
        this.walkConfig = data["walkthroughs"].slice();

        data['walkthroughs'].forEach((walkData) => {
          // this.register(walkData.id, WalkthroughComponent);
        });

      }
      
    });
  }

  onFinishLoadWalkThru(){
    return this.walkConfigSubject.asObservable();
  }

  notifyTutoNavigation(nextId:string){
    this.tutorNavigateSubject.next(nextId);
  }

  onTutoNavigation(){
    return this.tutorNavigateSubject.asObservable();
  }

  startTuto(id:string){
    this.startTutoSubject.next(id);
  }

  onStartTuto(){
    return this.startTutoSubject.asObservable();
  }

  register(id:string, walkthrough:WalkthroughComponent){
    this.walkthroughs.set(id,walkthrough);
  }

  unregister(id:string){
    this.walkthroughs.delete(id);
  }

  getById(id: string): WalkthroughComponent | undefined {
    return this.walkthroughs.get(id);
  }

  openWalk(id:string){
    this.walkthroughs.get(id)?.open();
  }

  getWalkConfigLen(){
    return this.walkConfig.length
  }

  getWalkConfigById(id:string){
    let dWalk = null;
    
    for(const walkData of this.walkConfig){
      if(walkData.id === id){
        dWalk = JSON.parse(JSON.stringify(walkData));
        break;
      }
    }

    return dWalk;
  }

  scrollIntoView(elementId:string){
    const parentEl = document.getElementById(elementId);
      if(parentEl){
        parentEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
  }



  
}
