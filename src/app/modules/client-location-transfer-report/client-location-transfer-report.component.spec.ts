import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientLocationTransferReportComponent } from './client-location-transfer-report.component';

describe('ClientLocationTransferReportComponent', () => {
  let component: ClientLocationTransferReportComponent;
  let fixture: ComponentFixture<ClientLocationTransferReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientLocationTransferReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLocationTransferReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
