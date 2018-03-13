import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteFeedbackComponent } from './write-feedback.component';

describe('WriteFeedbackComponent', () => {
  let component: WriteFeedbackComponent;
  let fixture: ComponentFixture<WriteFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
