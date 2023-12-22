import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FTMReportComponent } from './ftm-report.component';

describe('FTMReportComponent', () => {
  let component: FTMReportComponent;
  let fixture: ComponentFixture<FTMReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FTMReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FTMReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
