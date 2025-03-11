import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyranoTutorialComponent } from './cyrano-tutorial.component';

describe('CyranoTutorialComponent', () => {
  let component: CyranoTutorialComponent;
  let fixture: ComponentFixture<CyranoTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CyranoTutorialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CyranoTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
