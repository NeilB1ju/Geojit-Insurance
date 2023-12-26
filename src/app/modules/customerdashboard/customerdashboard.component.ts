import { Component, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { NzNotificationService, NzModalService } from "ng-zorro-antd";
import { LookUpDialogComponent } from "shared";
import { AppConfig } from "shared";
import { User } from "shared/lib/models/user";
import { AuthService } from "shared";
import { DataService } from "shared";
import { UtilService } from "shared";
import { debounce } from "rxjs/operators";
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";

declare var Tiff: any;
export interface customerdashboard {
  filter: string;
  filterValue: string;
  customerName: string;
  mobileNo: string;
  emailId: string;
  address: string;
  PAN: string;
  location: string;
  applicationNo: string;
  Branch: string;
  PolicyNumber: string;
  PolicyCompany: string;
  state: string;
  city: string;
  pinCode: number;
  clientId: string;
  tradeCode: string;
  dpID: string;
  mfIssId: string;
  // policyNo: string;
  // productCode: string;
  // productName: string;
  // loginDate: Date;
  // sumAssured: number;
  // netPremium: number;
  // netCommission: number;
}

@Component({
  templateUrl: "./customerdashboard.component.html",
  styleUrls: ["./customerdashboard.component.less"],
  selector: "nz-demo-table-basic",

  // animations: [bounceInOutAnimation]
})
export class customerdashboard implements OnInit {
  filters: Array<any> = [];
  customer: Array<any> = [];
  policyDetails: Array<any> = [];
  custdetails: Array<any> = [];
  policyData: Array<any> = [];
  inwardData: Array<any> = [];

  model: customerdashboard;
  @ViewChild(LookUpDialogComponent, { static: false })
  lookupsearch: LookUpDialogComponent;
  // @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;

  currentUser: User;
  isProcessing: boolean;
  isVisible: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  dateFormat = "dd/MM/yyyy";

  // photoPreview: SafeUrl;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private notification: NzNotificationService,
    private _DomSanitizationService: DomSanitizer,
    private modalService: NzModalService
  ) {
    this.model = <customerdashboard>{};
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getFilter();
  }

  getFilter() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 33,
          },
        ],
        requestId: "4",
      })
      .then((response) => {
        let res;
        if (response && response[0]) {
          this.filters = this.utilServ.convertToObject(response[0]);
          this.model.filter = this.filters[0].Code;
        } else {
        }
      });
  }
  // view() {
  //   if (!this.model.filterValue) {
  //     this.notification.error('please enter customer name', '')
  //   }
  //   else {

  //   if (this.model.filter == 'CN') {
  //     this.dataServ.getResultArray({
  //       "batchStatus": "false",
  //       "detailArray":
  //         [{
  //           CustomerName: this.model.filter == 'CN' ? this.model.filterValue : '',
  //           Euser:this.currentUser.userCode
  //         }],
  //       "requestId": "40",
  //     }).then((response) => {

  //       let reslt = response.results[0]

  //       if (response.results) {
  //         if (response.results[0].length > 1 || response.results[0].length == 1) {
  //           let result1 = response.results[0];
  //           this.customer = response.results[0];

  //           this.showModal();
  //         }
  //         else {
  //           if (reslt.length == 1) {
  //             this.viewCustomerData()
  //           }
  //           else {
  //             if (reslt.length == 0) {
  //               this.notification.error('No data found', '')
  //               // this.reset();
  //             }
  //           }
  //         }

  //       }
  //     })
  //       .catch(function (error) {
  //       });
  //   }
  //   else {
  //     this.viewCustomerData()
  //   }
  // }
  // }

  onChangeFilter(data) {
    if (data) {
      if (this.model.filterValue) this.model.filterValue = "";
      if (this.model.customerName) this.model.customerName = "";
      if (this.model.mobileNo) this.model.mobileNo = "";
      if (this.model.emailId) this.model.emailId = "";
      if (this.model.address) this.model.address = "";
      if (this.model.PAN) this.model.PAN = "";
      if (this.model.location) this.model.location = "";
      if (this.model.applicationNo) this.model.applicationNo = "";
      if (this.policyData) this.policyData = [];
      if (this.model.state) this.model.state = "";
      if (this.model.city) this.model.city = "";
      if (this.model.pinCode) this.model.pinCode = null;
    }
  }
  viewCustomerData(data) {
    debugger;

    this.dataServ
      .getResultArray({
        batchStatus: "false",
        detailArray: [
          {
            PAN: data.PANNumber || "",
            CLIENTID: data.CLIENTID || "",
          },
        ],
        requestId: "39",
      })
      .then((response) => {
        let result1 = response.results[0];

        let custdetails = result1[0];
        this.policyData = response.results[1];
        this.inwardData = response.results[2];
        this.model.address = custdetails.Address;
        this.model.customerName = custdetails.ClientFirstname;
        this.model.emailId = custdetails.Email;
        this.model.mobileNo = custdetails.MobileNo;
        this.model.PAN = custdetails.PANNumber;
        this.model.state = custdetails.PermenantState;
        this.model.city = custdetails.PermenantCity;
        this.model.pinCode = custdetails.PermenantPINCode;
        this.model.clientId = custdetails.ClientID;
        this.model.dpID = custdetails.DPID;
        this.model.mfIssId = custdetails.MfAccount;
        this.model.tradeCode = custdetails.TradeCode;
        if (response && response.length > 0) {
          let res;
        }
      })
      .catch(function (error) {});
    this.isVisible = false;
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  createComponentModal(data): void {
    const modal = this.modalService.create({
      nzTitle: "Policy Details",
      nzContent: PolicyDetailsComponent,
      nzWidth: "80%",
      nzComponentParams: {
        policyNo: data.ContractNumber,
        Euser: this.currentUser.userCode,
      },
      nzFooter: null,
    });
  }
  // viewCustomerDatatbl(data) {

  //   this.dataServ.getResultArray({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         PolicyNo: '',
  //         CustomerName: data.AdwCustDFullName || '',
  //         PAN: data.PANNumber || '',
  //         ApplicationNo: '',
  //         VehicleNo: '',
  //       }],
  //     "requestId": "39",
  //   }).then((response) => {

  //     let result1 = response.results[0];

  //     let custdetails = result1[0];
  //     this.policyData = response.results[1];
  //     this.model.address = custdetails.Address;
  //     this.model.customerName = custdetails.AdwCustDFullName;
  //     this.model.emailId = custdetails.AdwCustDEmail;
  //     this.model.mobileNo = custdetails.AdwCustDMobileNo;
  //     this.model.PAN = custdetails.PANNumber;
  //     this.model.state = custdetails.AdwCustDResState;
  //     this.model.city = custdetails.AdwCustDResCity;
  //     this.model.pinCode = custdetails.AdWCustDResPINCode;
  //     if (response && response.length > 0) {
  //       let res;
  //     }
  //   })
  //     .catch(function (error) {
  //     });
  //   this.isVisible = false
  // }
  reset() {
    this.model.address = "";
    this.model.customerName = "";
    this.model.emailId = "";
    this.model.mobileNo = "";
    this.model.PAN = "";
    this.policyData = [];
    this.model.filterValue = "";
    this.getFilter();
    this.model.state = "";
    this.model.city = "";
    this.model.pinCode = null;
    this.model.clientId = "";
    this.model.tradeCode = "";
    this.model.mfIssId = "";
    this.model.dpID = "";
  }
  View() {
    if (!this.model.filterValue) {
      this.notification.error("please enter customer name", "");
    }
    this.dataServ
      .getResultArray({
        batchStatus: "false",
        detailArray: [
          {
            PolicyNo: this.model.filter == "PN" ? this.model.filterValue : "",
            CustomerName:
              this.model.filter == "CN" ? this.model.filterValue : "",
            PAN: this.model.filter == "P" ? this.model.filterValue : "",
            ApplicationNo:
              this.model.filter == "AN" ? this.model.filterValue : "",
            MobileNumber:
              this.model.filter == "MN" ? this.model.filterValue : "",
            VehicleNo: this.model.filter == "VN" ? this.model.filterValue : "",
            CinNO: this.model.filter == "CIN" ? this.model.filterValue : "",
            Euser: this.currentUser.userCode,
          },
        ],
        requestId: "40",
      })
      .then((response) => {
        debugger;

        // if (response && response[0] && response[0].rows.length > 0)
        // {
        // let result1 = response.results[0];
        this.customer = response.results[0];
        if (this.customer.length < 1) {
          this.notification.error("No data found", "");
          return;
        } else {
          this.showModal();
        }

        // }
        // else{
        //   this.notification.error('','')
        // }
      });
  }
}
