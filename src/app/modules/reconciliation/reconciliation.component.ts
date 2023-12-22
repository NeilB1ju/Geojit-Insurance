import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { FindType } from 'shared'
import { FindOptions } from 'shared';
import * as  jsonxml from 'jsontoxml';
import { FormHandlerComponent } from 'shared';
import { AppConfig } from 'shared';
import { InputMasks } from 'shared';
import * as moment from 'moment';
import { ValidationService }  from 'shared';

export interface ReconciliationForm {
  insCompany: string;
  fromDate: Date;
  toDate: Date;
}

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.less']
})
export class ReconciliationComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;


	model:ReconciliationForm;
	reconProcessList: Array<any> = [];
	insCompList: Array<any> = [];
  currentUser: User;
  FormControlNames : {} = {};
  completedProcess;

  constructor(
  	private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private validServ: ValidationService,
    private notif: NzNotificationService) {
    this.model = <ReconciliationForm> {};
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    }

  ngOnInit() {
    
    this.reconProcessList = [];
    this.model.fromDate = null;
    this.model.toDate = null;
    this.getInsuranceCompany();
    
  }

  getInsuranceCompany() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 20
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.insCompList = this.utilServ.convertToObject(response[0]);
        this.model.insCompany = this.insCompList[1].Code;
      } else {

      }
    });
  }

  viewReconProcess() {
  	this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyId: this.model.insCompany,
        }],
      "requestId": "34"
    }).then((response) => {
      let res;
      if (response && response[0]) {
        this.reconProcessList = this.utilServ.convertToObject(response[0]);
      } else {

      }
    });
  }

  processRecon(form) {
    let isValid = this.validServ.validateForm(form,this.FormControlNames);
    if (!isValid)
      return;
    let val, el, isChecked = false;
    for (var i = 0; i < this.reconProcessList.length; i++) {
      el = this.reconProcessList[i];
      if (el.checked) {
        isChecked = true;
      }
    }
    if (!isChecked) {
      this.notif.warning("Please select atleast one record", '');
      return;
    }
    this.completedProcess = 0;
    this.processData(0);  	
  }

  processData(i) {
    if (!this.reconProcessList[i]) {
      return;
    }
    if (this.reconProcessList[i].checked) {
      this.reconProcessList[i].status = "Processing";
    }
    setTimeout(() => {
      this.updateData(this.reconProcessList[i], i).then((response) => {
      // this.notif.success("File uploaded successfully",'');
      this.processData(++this.completedProcess);
    }, () => {
      // this.isProcessingSave = false;
    });
    }, 5000);
    
  }

  private updateData(data, i) {
    if (data.checked) {
      
    return new Promise<void>((resolve, reject) => {
       this.dataServ.getResultArray({
          "batchStatus": "false",
          "detailArray":
            [{
              fromdate: moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment),
              todate: moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment),
              processId: data.ProcessId,
              EUser : this.currentUser.userCode,
              InscompanyId: this.model.insCompany
            }],
          "requestId": "133"
        }).then((response) => {
          let res;
          if (response && response.errorCode == 0) {
            this.reconProcessList[i].status = "Success"
          } else if(response.errorMsg) {
            this.reconProcessList[i].status = "Failed";
          }
          resolve();
        });
    });
  }else {
    this.processData(++this.completedProcess);
  }
  }

  ClearData() {
    this.ngOnInit();
  }





  
}
