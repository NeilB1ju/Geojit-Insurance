import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IRDARegisterComponent } from './irda-register.component';

describe('IRDARegisterComponent', () => {
  let component: IRDARegisterComponent;
  let fixture: ComponentFixture<IRDARegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IRDARegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IRDARegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
