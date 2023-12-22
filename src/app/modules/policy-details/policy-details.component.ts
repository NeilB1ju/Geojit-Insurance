
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { UtilService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { NzModalService } from 'ng-zorro-antd';
import { HtmlPreviewComponent } from 'shared';

export interface PolicyDetailsComponent {



  employeeLocation: any;
  Address1: any;
  Address2: any;
  custCity: any;
  custState: any;
  pinCode: any;
  branchCode: any;
  branchName: any;
  compCity: any;
  CompState: any;
  compRegion: any;
  employeeName: any;
  empolyeeCode: any;
  spCode: any;
  spName: any;
  

}
@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.less']
})

export class PolicyDetailsComponent implements OnInit {

  @ViewChild('reportView') reportView: HtmlPreviewComponent;
  @Input() policyNo: string;
  @Input() Euser: string;
  model: PolicyDetailsComponent;
  htmlData: string;
  otherInfohtml:string;
  paymentHistory: Array<any> = [];
  paymentHistory2: Array<any> = [];
  otherInfo:any= [];
  isSpinning=false;  
  riderdatatype: any;
  riderdata: any =[];
  riderheader: string[];
  columnArray: any;
  
  // AdwCustDAddress1: string;
  // AdwCustDAddress2: string;
  // AdwCustDResCity: string;
  // AdwCustDResState: string;
  // AdwCustDResPINCode: string;
  // Name: string;
  // Location: string;
  // Employeeid: string;
  // SPCode: string;
  // SPName: string;
  // BranchCode: string;
  // LocationCode: string;
  // State: string;
  // CABRRegion: string;
  // City: string;


  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService) { }

  ngOnInit() {
    this.isSpinning=true; 
    this.previewBranchDetails();
    this.getPaymentHistory();
    this.getOtherInfo();
    this.getRiderInfo();
  }

  previewBranchDetails() {
    this.isSpinning=true;
    let val;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "policyNo": this.policyNo,
          "Euser": this.Euser

        }],
      "requestId": "24",
      "outTblCount": "0"
    }).then((response) => {
      let res;

      if (response && response[0] && response[0].rows.length > 0) {
        this.isSpinning=false;  

        res = this.utilServ.convertToObject(response[0]);
        this.htmlData = res[0].HTML_Details

      }
      else {
        this.isSpinning=false;  
        this.notification.error("No data found", '');

        return;
      }
    })

  }
  getPaymentHistory() {
    this.isSpinning=true;
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "policyNo": this.policyNo,
          "Euser": this.Euser

        }],
      "requestId": "44",
    }).then((response) => {
      if (response.results && response.results.length) {
        this.isSpinning=false;  
        let result1 = response.results[0];
        let result2 = response.results[1];
        this.paymentHistory = response.results[0];
        this.paymentHistory2 = response.results[1];

      }
      else {
        this.isSpinning=false;  
        this.notification.error("No data found", "")
      }
    }).catch(function (error) {
    });
  }
  getOtherInfo() {
    this.isSpinning=true;

    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          "policyNo": this.policyNo,
          "Euser": this.Euser
        }],
      "requestId": "45"/* 45*/,
    }).then((response) => {debugger

      if (response.results && response.results.length) {
        this.isSpinning=false; 
        let result1=response.results[0]
    
        this.otherInfohtml = result1[0].HTML_Details
        // let result1 = response.results[0];
        // this.otherInfo = result1[0];
        // console.log(this.otherInfo )
      }
      else {
        this.isSpinning=false;  
        this.notification.error('No data found', '')
      }
    })
      .catch(function (error) {
      });

  }


  getRiderInfo() {
    this.isSpinning=true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "policyNo": this.policyNo,
          "Euser": this.Euser,
          "ApplicationNo":''
        }],
      "requestId": "54",
      "outTblCount": "0"
    }).then((response) => {
        this.isSpinning=false;  

      if (response && response[0] && response[0].rows.length > 0) {
        this.columnArray=[];
        this.riderdatatype = response[0].metadata.columnsTypes;
        this.riderdata = this.utilServ.convertToObject(response[0]);
        this.riderheader = Object.keys(this.riderdata[0]);
        for (var i = 0; i < this.riderdatatype.length; i++) {
          if (this.riderdatatype[i] == "numeric") {
            this.columnArray.push(this.riderheader[i]);
          }
        }
        
      }
      else {
      
        this.notification.error('No data found', '')
      }
    })
      .catch(function (error) {
      });

  }




  setStyle(head) {
    if (this.columnArray.indexOf(head) >= 0) {
      return true;

    }
    else {
      return false;
    }

  }



}
