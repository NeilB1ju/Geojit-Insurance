import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTransferLogComponent } from './client-transfer-log.component';

describe('ClientTransferLogComponent', () => {
  let component: ClientTransferLogComponent;
  let fixture: ComponentFixture<ClientTransferLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientTransferLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTransferLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
