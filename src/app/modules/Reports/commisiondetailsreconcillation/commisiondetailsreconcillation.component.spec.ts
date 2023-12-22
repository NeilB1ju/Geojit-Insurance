import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommisiondetailsreconcillationComponent } from './commisiondetailsreconcillation.component';

describe('CommisiondetailsreconcillationComponent', () => {
  let component: CommisiondetailsreconcillationComponent;
  let fixture: ComponentFixture<CommisiondetailsreconcillationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommisiondetailsreconcillationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommisiondetailsreconcillationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
