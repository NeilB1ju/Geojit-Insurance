import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';

import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';

import { UtilService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { AppConfig } from 'shared';
import * as FileSaver from 'file-saver';
// import { PolicyDetailsComponent } from "../policy-details/policy-details.component";
import { User } from 'shared/lib/models/user';
import { InputMasks } from 'shared';
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";

export interface franchieeprocessForm {
  tranDate: Date;
  insCompany: string;
  state: any;
  Region: any;
  Location: any;
  Employee: any;
  Product: any;
  Policy: string;
  fd: Date;
  sORd:any;
  td: Date;
  year:any;
  month:any;

  PAN:any;
  insurancecompany: string;
  ReportType: string;
  spCode: any;
  pdtCategory: any;
  category: any;
  type:any


}

export interface TreeNodeInterface {
  key: number;
  Id: number;
  Name: string;
  Premium_Collected: number;
  No_Of_Policies: number;
  Commission: number;
  Annualised_Premium: number;
  expand: boolean;
  children?: TreeNodeInterface[];
}

@Pipe({
  name: 'tableFilter',
})
export class TableFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter(item => {
      let flag = false;

      if (item[filter.key] && item[filter.key] == filter.value)
        flag = true;
      return flag;
    })
  }
}

@Component({
  templateUrl: './franchieeprocess.component.html',
  styleUrls: ['./franchieeprocess.component.less']
})

export class franchieeprocessComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  insCompList: Array<any> = [];
  model: franchieeprocessForm;
  isProcessing;
  currentUser: User;
  inputMasks = InputMasks;
  isSpinning: boolean =false;
  data: any=[];
  mnth: any[];
  year: any[];
  processbutton: boolean =false;
  savebutton: boolean =false;
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService

  ) {
    this.model = <franchieeprocessForm>{
      tranDate: new Date()

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );
  
  }

  ngOnInit() {
    this.getInsCompany();
  this.getyearmnth()
    

  }
  
  getyearmnth() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 44
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.mnth = this.utilServ.convertToObject(response[0]);
        this.year = this.utilServ.convertToObject(response[1]);
        
      } else {

      }
    });
  }

  getInsCompany() {
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
        this.model.insurancecompany = this.insCompList[1].Code;
      } else {

      }
    });
  }
  
  proessandsave(data) {
  
    if(this.model.year == '' || this.model.year == null || this.model.year == undefined)
    {
      this.notification.error('Select Valid Year', '');
      this.isSpinning = false;
      return;
    }
    if(this.model.month == '' || this.model.month == null || this.model.month == undefined)
    {
      this.notification.error('Select Valid month', '');
      this.isSpinning = false;
      return;
    }
    debugger
    if(this.model.insurancecompany == '' || this.model.insurancecompany == null || this.model.insurancecompany == undefined || this.model.insurancecompany == 'A'  )
    {
      this.notification.error('Select Any One Company', '');
      this.isSpinning = false;
      return;
    }
    if(data == 'P')
    {
      this.processbutton =true
    }
    if(data == 'S')
    {
      this.savebutton =true
    }
    
   
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
        
          InsCompanyID: this.model.insurancecompany,
          CalcYear: this.model.year,
          CalcMonth: this.model.month,
          ActionType:data,
          Euser:this.currentUser.userCode

        }],
      "requestId": "58"
    }).then((response) => { debugger
      this.processbutton =false
      this.savebutton =false
      if (response.errorCode == 0) {
        this.notification.success('success', '');
      }
      else{
        this.notification.error('Error', '');
    }
  });
}



}
