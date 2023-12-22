import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrdaSpFileUploadInSpiceApplicationComponent } from './irda-sp-file-upload-in-spice-application.component';

describe('IrdaSpFileUploadInSpiceApplicationComponent', () => {
  let component: IrdaSpFileUploadInSpiceApplicationComponent;
  let fixture: ComponentFixture<IrdaSpFileUploadInSpiceApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrdaSpFileUploadInSpiceApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrdaSpFileUploadInSpiceApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
