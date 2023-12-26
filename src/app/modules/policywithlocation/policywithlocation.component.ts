
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { UtilService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";

import { HtmlPreviewComponent } from 'shared';

export interface policywithlocationComponent {



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
  selector: 'app-policywithlocation',
  templateUrl: './policywithlocation.component.html',
  styleUrls: ['./policywithlocation.component.less']
})

export class policywithlocationComponent implements OnInit {

  @ViewChild('reportView', { static: false }) reportView: HtmlPreviewComponent;
  @Input() location: string;
  @Input() Euser: string;
  @Input() year: string;
  @Input() month: string;
  @Input() ReportType:any;
  @Input() InsCompanyID:any;
  @Input() State:any;
  @Input() Region:any;
  @Input() Location:any;
  @Input() Fromdate:any;
  @Input() Todate:any;
  @Input() PolicyNo:any;
  @Input() Product:any;
  @Input() Employee:any;
  @Input() SPCode:any;
  @Input() ProductCategory:any;
  @Input() ViewType:any;
  @Input() From:any;
  @Input() Year:any;
  @Input() Month :any;
  @Input() Pan:any;
  @Input() Type:any;
  model: policywithlocationComponent;
  htmlData: string;
  paymentHistory: Array<any> = [];
  paymentHistory2: Array<any> = [];
  otherInfo:any= [];
  Commissiondata:any=[];
  isSpinning=false;  
  riderdatatype: any;
  riderdata: any =[];
  riderheader: string[];
  columnArray: any;
  policyreportdata: any= [];
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
    // this.previewBranchDetails();
    // this.getPaymentHistory();
    // this.getOtherInfo();
    if(this.From =='policyreport')
    {
      this.getpolicylocationinpolicystatus()
    }
    else
    {
    this.getpoliywithlocation();
  }
  }
 
 

  getpoliywithlocation() {
    this.isSpinning=true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          SorD:'D',
          InsCompanyID: this.InsCompanyID,
          State: this.State ? this.State : '',
          Region: this.Region ? this.Region : '',
          Location: this.Location ? this.Location : '',
          Year: this.Year,
          Month: this.Month,
          PolicyNo: this.PolicyNo? this.PolicyNo : '',
          Pan:  '',
          Euser: this.Euser || '',
          ProductCategory: this.ProductCategory ? this.ProductCategory : '',
          Type: this.Type
         
        }],
      "requestId": "57",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning=false;
      if (response && response[0] && response[0].rows.length > 0) {
        let policyreportdata = this.utilServ.convertToObject(response[0])
        this. Commissiondata =policyreportdata
        
      }
      else {
        this.isSpinning=false;  
        this.notification.error('No data found', '')
      }
    })
      .catch(function (error) {
      });

  }


  getpolicylocationinpolicystatus() {
    this.isSpinning=true;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          ReportType: this.ReportType,
          InsCompanyID: this.InsCompanyID,
          State: this.State? this.State : '',
          Region: this.Region ? this.Region : '',
          Location: this.Location ? this.Location : '',
          Fromdate: this.Fromdate ?this.Fromdate: '',
          Todate: this.Todate? this.Todate : '',
          PolicyNo: this.PolicyNo ? this.PolicyNo : '',
          Product: this.Product ? this.Product : '',
          Employee: this.Employee? this.Employee : '',
          Euser: this.Euser || '',
          SPCode: this.SPCode? this.SPCode : '',
          ProductCategory: this.ProductCategory ? this.ProductCategory: '',
          ViewType: 'D'
         
        }],
      "requestId": "62",
      "outTblCount": "0"
    }).then((response) => {debugger
      this.isSpinning=false;
      if (response && response[0] && response[0].rows.length > 0) {
        let policyreportdata = this.utilServ.convertToObject(response[0])
       this. policyreportdata =policyreportdata

        
      }
      else {
        this.isSpinning=false;  
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
