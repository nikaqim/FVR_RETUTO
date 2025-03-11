import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoWalkthroughComponent } from './tuto-walkthrough.component';

describe('TutoWalkthroughComponent', () => {
  let component: TutoWalkthroughComponent;
  let fixture: ComponentFixture<TutoWalkthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutoWalkthroughComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TutoWalkthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
