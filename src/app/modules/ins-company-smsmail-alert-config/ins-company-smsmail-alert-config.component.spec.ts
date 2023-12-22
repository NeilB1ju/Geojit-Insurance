import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsCompanySMSMailAlertConfigComponent } from './ins-company-smsmail-alert-config.component';

describe('InsCompanySMSMailAlertConfigComponent', () => {
  let component: InsCompanySMSMailAlertConfigComponent;
  let fixture: ComponentFixture<InsCompanySMSMailAlertConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsCompanySMSMailAlertConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsCompanySMSMailAlertConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
