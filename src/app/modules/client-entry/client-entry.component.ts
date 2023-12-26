import { Component, OnInit, ViewChild } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import { LookUpDialogComponent } from "shared";
import { UtilService } from "shared";
import { AuthService } from "shared";
import { DataService } from "shared";
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from "shared";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { clientMaster } from "./clientmaster";
import * as moment from "moment";
import { AppConfig } from "shared";
import { InputMasks } from "shared";
import { InputPatterns } from "shared";
import { ValidationService } from "shared";

import { User } from "shared/lib/models/user";
@Component({
  selector: "app-client-entry",
  templateUrl: "./client-entry.component.html",
  styleUrls: ["./client-entry.component.less"],
})
export class ClientEntryComponent implements OnInit {
  @ViewChild(FormHandlerComponent, { static: false })
  formHandler: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent, { static: false })
  lookupsearch: LookUpDialogComponent;
  currentUser: User;
  dateFormat = "dd/MM/yyyy";
  Relationlist: Array<any> = [];
  RiskAptitudelist: Array<any> = [];
  Genderlist: Array<any> = [];
  MaritalStatuslist: Array<any> = [];
  Educationlist: Array<any> = [];
  Networthlist: Array<any> = [];
  Occupationlist: Array<any> = [];
  rpttype: Array<any> = [];
  incomelist: Array<any> = [];
  model: clientMaster = new clientMaster();
  statelist: Array<any> = [];
  locationFindopt: FindOptions;
  comcountyFindopt: FindOptions;
  clientFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  ProductFindopt: FindOptions;
  location: any;
  isVisible: any;
  branchcode: any;
  date = new Date();
  todaydate: any = new Date();
  isModifyState: boolean;
  formHandlerRight: boolean = false;
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;
  FormControlNames: {} = {};
  modifybtn: boolean;
  isSpinning: boolean = false;

  modifyform: boolean = true;
  isPanValid: boolean = false;
  PanDetails: any;
  isholder1Pan: boolean;
  hold1VarifiedPanDetails: any;
  checked: boolean;
  clientid: any;
  country: any[];
  frlocation: any[];
  franch: boolean = false;
  upperstring: string;
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private validServ: ValidationService
  ) {
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });

    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      requestId: 2,
    };
    this.clientFindopt = {
      findType: 1012,
      codeColumn: "TRADECODE",
      codeLabel: "TRADECODE",
      descColumn: "NAME",
      descLabel: "NAME",
      requestId: 2,
    };
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: "Code",
      codeLabel: "EmployeeCode",
      descColumn: "Name",
      descLabel: "Employee",
      requestId: 2,
    };
    this.ProductFindopt = {
      findType: FindType.Product,
      codeColumn: "ProductCode",
      codeLabel: "ProductCode",
      descColumn: "ProductName",
      descLabel: "Product",
      requestId: 2,
    };

    this.comcountyFindopt = {
      findType: 1014,
      codeColumn: "CountryName",
      codeLabel: "CountryName",
      descColumn: "CountryName",
      descLabel: "CountryName",
      hasDescInput: false,
      requestId: 2,
    };
  }

  ngOnInit() {
    // this.formHandlerRight =  this.dataServ.modifyright;
    let res = this.currentUser.userCode.substring(0, 2);
    this.upperstring = res.toUpperCase();
    if (this.upperstring == "FR") {
      this.franch = true;
      this.model.type = "F";
      this.getfranch();
    } else {
      this.franch = false;
    }

    this.getgenderList();
    this.getstateList();
    this.getcountryList();
    this.clientid = 0;
    this.isModifyState = false;
    // this.formHdlr.setFormType('default');
    this.formHandler.config.isModifyState = false;
    this.formHandler.setFormType("default");
    this.formHandlerRight = true;
    this.formHandler.config.showModifyBtn = false;
    this.formHandler.config.showDeleteBtn = false;
    // this.getmartialStatusList();
  }

  onSelectClient(data) {
    if (data) {
      this.model.TradeCode = data.TRADECODE;
      this.model.PAN = data.PanNumber;
      this.model.dpid = data.DPACNO;
      this.model.MFAccount = data.MfaccountNo;
      this.model.CINNo = data.CINNo;
      // this.model.client=data.CLIENTID;

      this.clientid = 1;
      this.getclientdata();
    }
  }
  getclientdata() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            clientid: this.model.client ? this.model.client.CLIENTID : "",
          },
        ],
        requestId: "31",
        outTblCount: "0",
      })
      .then((response) => {
        let res1;
        res1 = this.utilServ.convertToObject(response[0]);
        this.model.FirstName = res1[0].ClientFirstName;
        this.model.MiddleName = res1[0].ClientMiddleName;
        this.model.LastName = res1[0].ClientLastName;
        this.model.perAddress1 = res1[0].RESADD1;
        this.model.perPIN = res1[0].RESPIN;
        this.model.Mobile = res1[0].MobilePhone;
        this.model.DOB = res1[0].dob;
        this.model.Gender = res1[0].sex;
        // this.model.MaritalStatus=res1[0].;
        // this.model.Natinality = res1[0].;
        this.model.Email = res1[0].RESEMAIL.toLowerCase();
        this.model.SecondaryEmail = "";
        // this.model.dpid = '';
        // this.model.MFAccount = '';
        if (this.upperstring == "FR") {
          debugger;
          this.franch = true;
          this.getfranch();
          this.model.type = "F";
        } else {
          this.model.type = "E";
        }

        this.model.Employee = "";
        this.model.perCity = res1[0].ResCity;
        this.model.perAddress2 = res1[0].RESADD2;
        this.model.perState = res1[0].ResState;
        this.model.comState = res1[0].ResState;
        this.model.perCountry = res1[0].ResCountry;
        // { COUNTRYNAME: res1[0].ResCountry, Name: res1[0].ResCountry} ;
        this.model.comAddress1 = "";
        //  res1[0].RESADD1;
        this.model.comAddress2 = "";
        // res1[0].RESADD2;
        this.model.comCity = "";
        // res1[0].ResCity ;
        this.model.comCountry = "";
        //  res1[0].ResCountry
        // { COUNTRYNAME: res1[0].ResCountry, Name: res1[0].ResCountry} ;
        this.model.comState = "";
        // res1[0].ResState;
      });
  }

  updateaddress() {
    this.model.comAddress1 = this.model.perAddress1;
    this.model.comAddress2 = this.model.perAddress2;
    this.model.comCity = this.model.perCity;
    // this.model.perCountry=this.model.perState;
    this.model.comState = this.model.perState;
    this.model.comPIN = this.model.perPIN;
    this.model.comCountry = this.model.perCountry;
  }

  // getmartialStatusList() {
  //   this.dataServ.getResponse({
  //     "batchStatus": "false",
  //     "detailArray":
  //       [{
  //         "Code": 26,
  //         "WhereClause": '',
  //         "ShowAll": 'N',
  //         "TableName": ""
  //       }],
  //     "requestId": "4",
  //     "outTblCount": "0"
  //   })
  //     .then((response) => {debugger
  //       if (response && response[0].rows.length > 0) {
  //         this.MaritalStatuslist = this.utilServ.convertToObject(response[0]);
  //         this.MaritalStatuslist = [...this.MaritalStatuslist];
  //       } else if (response.errorMsg) {

  //       }
  //     });

  // }

  getgenderList() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 27,
            WhereClause: "",
            ShowAll: "N",
            TableName: "",
          },
        ],
        requestId: "4",
        outTblCount: "0",
      })
      .then((response) => {
        if (response && response[0].rows.length > 0) {
          this.Genderlist = this.utilServ.convertToObject(response[0]);
          this.Genderlist = [...this.Genderlist];
        } else if (response.errorMsg) {
        }
      });
  }

  getstateList() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 21,
            WhereClause: "",
            ShowAll: "N",
            TableName: "",
          },
        ],
        requestId: "4",
        outTblCount: "0",
      })
      .then((response) => {
        if (response && response[0].rows.length > 0) {
          this.statelist = this.utilServ.convertToObject(response[0]);
          this.statelist = [...this.statelist];
        } else if (response.errorMsg) {
        }
      });
  }

  // checkPan(pan) {
  //
  //   this.isPanValid = false

  //   if (pan.length == 10) {
  //
  //     this.dataServ.varifyPan(pan).
  //       then(result => {
  //
  //         if (this.isPanValid) {
  //           return
  //         }
  //         this.PanDetails = result
  //         if (this.PanDetails.length > 0) {
  //
  //           // this.isholder1Pan = true
  //           //  this.hold1VarifiedPanDetails=this.PanDetails[0]
  //           this.isPanValid = true

  //           this.notification.success("Valid Pan", '')

  //         }
  //         else {
  //           this.notification.error("Invalid Pan", '')
  //           this.isPanValid = false

  //         }
  //       })

  //   }
  // }
  Save(e, form) {
    if (
      this.model.Gender == "" ||
      this.model.Gender == null ||
      this.model.Gender == undefined
    ) {
      this.notification.error("Select Gender  ", "");
    }
    if (this.model.DOB >= this.date) {
      this.notification.error("Select valid date for DOB  ", "");
      return;
    }

    this.isSpinning = true;
    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid) {
      this.isSpinning = false;
      return;
    }
    this.isSpinning = true;

    this.isPanValid = false;
    this.dataServ.varifyPan(this.model.PAN).then((result) => {
      if (result.length > 0) {
        console.log("Success");
        // this.isholder1Pan = true
        //  this.hold1VarifiedPanDetails=this.PanDetails[0]
        this.isPanValid = true;
        this.dataServ
          .getResultArray({
            FileImport: "false",
            batchStatus: "false",
            detailArray: [
              {
                IorU: this.formHandler.config.isModifyState ? "U" : "I",
                ClientID: this.isModifyState ? this.model.insclient : 1,
                TradeCode: this.model.TradeCode || "",
                DPID: this.model.dpid || "",
                MfAccount: this.model.MFAccount || "",
                ClientFirstName: this.model.FirstName || "",
                ClientMiddleName: this.model.MiddleName || "",
                ClientLastName: this.model.LastName || "",
                DOB:
                  moment(this.model.DOB).format(
                    AppConfig.dateFormat.apiMoment
                  ) || new Date(),
                Gender: this.model.Gender || "",
                MaritalStatus: "",
                PANNumber: this.model.PAN || "",
                Relation: "",
                PermenantAddress1: this.model.perAddress1 || "",
                PermenantAddress2: this.model.perAddress2 || "",
                PermenantAddress3: this.model.perAddress1 || "",
                PermenantCity: this.model.perCity || "",
                PermenantStateId: this.model.perState,
                PermenantCountryId: this.model.perCountry
                  ? this.model.perCountry
                  : "",
                // ==null?'':this.model.perCountry.CountryName?this.model.perCountry.CountryName:'',
                PermenantPINCode: this.model.perPIN || "",
                ContactAddress1: this.model.comAddress1 || "",
                ContactAddress2: this.model.comAddress2 || "",
                ContactAddress3: this.model.comAddress1 || "",
                ContactCity: this.model.comCity || "",
                ContactStateId: this.model.comState,
                ContactCountryId: this.model.comCountry
                  ? this.model.comCountry
                  : "",
                ContactPINCode: this.model.comPIN || "",
                MobileNo: this.model.Mobile || "",
                Email: this.model.Email || "",
                SecondaryMobileNo: this.model.Mobile || "",
                SecondaryEmail: this.model.SecondaryEmail || "",
                EUser: this.currentUser.userCode || "",
                LeadType: this.model.type || "",
                LeadCode:
                  this.model.type == "E"
                    ? this.model.Employee.Code
                    : this.model.Location.Location || "",
                leaddesc:
                  this.model.type == "E"
                    ? this.model.Employee.Name
                    : this.model.Location.LocationName || "",
                locationbo: this.model.Locationbo || "",
              },
            ],
            requestId: "30",
          })
          .then((response) => {
            this.isSpinning = false;
            if (
              response &&
              response.errorCode !== undefined &&
              response.errorCode == 0
            ) {
              let resArr = response.results[0][0];

              if (resArr.Status == 0) {
                this.notification.error(resArr.ErrorMessage, "");
              } else {
                this.notification.success(resArr.ErrorMessage, "");

                this.modifyform = false;
                this.formHandler.config.showModifyBtn = true;
                this.formHandler.config.isModifyState = false;
                this.formHandler.config.showSaveBtn = false;
              }

              // Save(e,form)
              //  {
              // let isValid = this.validServ.validateForm(form,this.FormControlNames);
              //     if (!isValid)
              //       return;
              //     let arrSaveData = [];
            } else {
              this.notification.error("error", "");
              return;
            }
          });
      } else {
        this.isSpinning = false;
        this.notification.error("Invalid Pan", "");
        this.isPanValid = false;
      }
    });
  }

  // Save(e,form)
  //  {
  // let isValid = this.validServ.validateForm(form,this.FormControlNames);
  //     if (!isValid)
  //       return;
  //     let arrSaveData = [];

  //   arrSaveData.push(
  //         {
  //           "FileImport": "false",
  //           "batchStatus": "false",
  //           "detailArray":     [{
  //           "IorU" :this.isModifyState  ? "U" : "I",
  //           "ClientID" :this.isModifyState ? this.model.insclient:1,
  //           "TradeCode" :this.model.TradeCode || '',
  //           "DPID" :this.model.dpid || '' ,
  //           "MfAccount"  :this.model.MFAccount ||'' ,
  //           "ClientFirstName" :this.model.FirstName||'' ,
  //           "ClientMiddleName" :this.model.MiddleName||'' ,
  //           "ClientLastName" :this.model.LastName||'' ,
  //           "DOB" :moment(this.model.DOB).format(AppConfig.dateFormat.apiMoment)||new Date,
  //           "Gender" :this.model.Gender||'' ,
  //           "MaritalStatus" :'' ,
  //           "PANNumber" :this.model.PAN||'',
  //           "Relation" :'' ,
  //           "PermenantAddress1" :this.model.perAddress1 ||'',
  //           "PermenantAddress2" :this.model.perAddress2 ||'',
  //           "PermenantAddress3" :this.model.perAddress1 ||'',
  //           "PermenantCity" :this.model.perCity ||'',
  //           "PermenantStateId" :this.model.perState ,
  //           "PermenantCountryId" :this.model.perCountry ==null?'':this.model.perCountry.CountryName,
  //           "PermenantPINCode" :this.model.perPIN ||'',
  //           "ContactAddress1" :this.model.comAddress1 ||'',
  //           "ContactAddress2" :this.model.comAddress2 ||'',
  //           "ContactAddress3" :this.model.comAddress1 ||'',
  //           "ContactCity" :this.model.comCity||'',
  //           "ContactStateId" :this.model.comState,
  //           "ContactCountryId":this.model.comCountry==null?'':this.model.comCountry.CountryName,
  //           "ContactPINCode" :this.model.comPIN ||'',
  //           "MobileNo" :this.model.Mobile ||'',
  //           "Email":this.model.Email ||'',
  //           "SecondaryMobileNo" :this.model.Mobile ||'',
  //           "SecondaryEmail" :this.model.SecondaryEmail ||'',
  //           "EUser":this.currentUser.userCode || '',
  //           "LeadType"  :this.model.type||'',
  //           "LeadCode" : this.model.type == 'E' ? this.model.Employee.Code: this.model.Location.Location||'',
  //           "leaddesc":this.model.type == 'E' ? this.model.Employee.Name: this.model.Location.LocationName||'',
  //           "locationbo":this.currentUser.locationId||''
  //       }],
  //           "myHashTable": {},
  //           "requestId": "30",
  //           "outTblCount": "0"
  //         }

  //       )

  //     this.dataServ.ExecuteDBTran({
  //         "keyArray": [],
  //         "keyAliasArray": [],
  //         "cmdArray": arrSaveData
  //       }).then((response)=> {
  //         if(response.errorMsg && response.errorMsg!='' && response.errorMsg!=undefined){

  //         }
  //         if (response && response.errorCode !== undefined && response.errorCode == 0) {
  //           if(!this.isModifyState)
  //           {
  //            this.notification.success('Data  Saved successfully', 'success');
  //            this.resetForm();
  //           }

  //           if(response.resultSet && this.isModifyState){
  //              this.notification.success('Data  Updated successfully', 'success');
  //               this.resetForm();
  //              // this.isModifyState = true;
  //           }
  //         }
  //         else {
  //           return;
  //         }
  //       })

  //     }

  resetForm() {
    if (this.upperstring == "FR") {
      this.franch = true;
      this.getfranch();
      this.model.type = "F";
    }
    this.formHandlerRight = true;
    // this.formHandler.config.isModifyState = false;
    this.formHandler.config.showModifyBtn = false;
    this.formHandler.config.isModifyState = false;
    this.modifyform = true;
    // this.formHandler.config.showModifyBtn = true;
    // this.formHandler.config.isModifyState = false;
    this.formHandler.config.showSaveBtn = true;

    //  this.model.Gender
    this.clientid = 0;

    if (this.franch == false) {
      this.model.Location = "";
      this.model.locationid = "0";
      this.model.type = "E";
    }
    this.isModifyState = false;
    this.model.TradeCode = "";
    this.model.PAN = "";
    this.model.FullName = "";
    this.model.FirstName = "";
    this.model.MiddleName = "";
    this.model.LastName = "";
    this.model.perAddress1 = "";
    this.model.perPIN = "";
    this.model.Mobile = "";
    this.model.DOB = null;

    this.model.Gender = null;
    this.model.MaritalStatus = "";
    this.model.Natinality = "";
    this.model.Email = "";
    this.model.SecondaryEmail = "";
    this.model.dpid = "";
    this.model.MFAccount = "";

    this.model.Employee = "";
    this.model.perCity = "";
    this.model.perAddress2 = "";
    this.model.perState = null;
    this.model.perCountry = null;
    this.model.comAddress1 = "";
    this.model.comAddress2 = "";
    this.model.comCity = "";
    this.model.comCountry = null;
    this.model.comState = null;
    this.model.Locationbo = "";
    this.model.comPIN = "";
    this.model.CINNo = "";

    this.model.client = null;
  }

  Search() {
    let reqParams;

    reqParams = {
      batchStatus: "false",
      detailArray: [{ SearchType: 1013, WhereClause: "", LangId: 1 }],
      myHashTable: {},
      requestId: 2,
      outTblCount: "0",
    };

    this.lookupsearch.actionOpen(reqParams, "clients");
    this.clientid = 1;
  }
  onLookupSelect(data) {
    if (this.formHandlerRight == true) {
      this.formHandler.config.isModifyState = true;
    } else {
      this.formHandler.config.isModifyState = false;
      this.formHandler.config.showSaveBtn = false;
      return;
    }
    this.modifyform = false;
    // if(this.formHandlerRight==true){
    //   this.formHdlr.config.isModifyState=true;
    //   this.isModifyState=true;
    // }
    // else{
    //   this.formHdlr.config.isModifyState=false;
    //   this.formHdlr.config.showSaveBtn=false;
    //   return;
    // }

    this.model.insclient = data.ClientID;
    this.getclientdetails();
    this.isModifyState = true;
    this.formHandler.config.showModifyBtn = true;
    this.formHandler.config.isModifyState = false;
    this.formHandler.config.showSaveBtn = false;
  }

  getclientdetails() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            clientid: this.model.insclient,
          },
        ],
        requestId: "33",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;
        let res1;
        res1 = this.utilServ.convertToObject(response[0]);

        this.model.FirstName = res1[0].ClientFirstName;
        this.model.MiddleName = res1[0].ClientMiddleName;
        this.model.LastName = res1[0].ClientLastName;
        this.model.perAddress1 = res1[0].PermenantAddress1;
        this.model.perPIN = res1[0].PermenantPINCode;
        this.model.Mobile = res1[0].MobileNo;
        this.model.DOB = res1[0].DOB;
        this.model.Gender = res1[0].Gender;
        // this.model.MaritalStatus=res1[0].;
        // this.model.Natinality = res1[0].;
        this.model.Email = res1[0].Email.toLowerCase();
        this.model.SecondaryEmail = res1[0].SecondaryEmail;
        this.model.dpid = res1[0].DPID;
        this.model.MFAccount = res1[0].MfAccount;
        this.model.type = res1[0].Leadtype;
        this.model.Employee = res1[0].RESEMAIL;
        this.model.perCity = res1[0].PermenantCity;
        this.model.perAddress2 = res1[0].PermenantAddress2;
        this.model.perState = res1[0].PermenantState;
        this.model.perCountry = res1[0].PermenantCountry;
        this.model.comAddress1 = res1[0].ContactAddress1;
        this.model.comAddress2 = res1[0].ContactAddress2;
        this.model.comCity = res1[0].ContactCity;
        this.model.comCountry = res1[0].ContactCountry;
        this.model.comState = res1[0].ContactState;
        this.model.TradeCode = res1[0].TradeCode;
        this.model.PAN = res1[0].PANNumber;
        this.model.Locationbo = res1[0].locationcode;
        this.model.comPIN = res1[0].ContactPINCode;
        this.model.perCountry = res1[0].PermenantCountry;
        this.model.CINNo = res1[0].CINNo;
        //  { COUNTRYNAME: res1[0].PermenantCountry, Name: res1[0].PermenantCountry} ;
        this.model.comCountry = res1[0].ContactCountry;
        //  { COUNTRYNAME: res1[0].ContactCountry, Name: res1[0].ContactCountry} ;
        this.model.Employee = {
          Code: res1[0].Leadcode,
          Name: res1[0].leaddesc,
        };
        this.model.Location = {
          Location: res1[0].Leadcode,
          LocationName: res1[0].leaddesc,
        };
      });
  }
  onChangeType(e) {
    this.model.Location = "";
    this.model.locationid = "0";
    this.model.TradeCode = "";
    this.model.PAN = "";
    this.model.FullName = "";
    this.model.FirstName = "";
    this.model.MiddleName = "";
    this.model.LastName = "";
    this.model.perAddress1 = "";
    this.model.perPIN = "";
    this.model.Mobile = "";

    this.model.Gender = "";
    this.model.MaritalStatus = "";
    this.model.Natinality = "";
    this.model.Email = "";
    this.model.SecondaryEmail = "";
    this.model.dpid = "";
    this.model.MFAccount = "";
    this.model.Employee = "";
    this.model.perCity = "";
    this.model.perAddress2 = "";
    this.model.perState = "";
    this.model.perCountry = "";
    this.model.comAddress1 = "";
    this.model.comAddress2 = "";
    this.model.comCity = "";
    this.model.comCountry = "";
    this.model.comState = "";
    this.model.Locationbo = "";
    this.model.comPIN = "";
  }

  modify() {
    this.modifyform = true;
    this.formHandler.config.showModifyBtn = false;

    this.formHandler.config.isModifyState = true;
    this.formHandler.config.showSaveBtn = true;
    this.isModifyState = true;
  }

  getdetailswithpan() {
    // if( this.formHandler.config.isModifyState = true;)

    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            pannumber: this.model.PAN,
            Euser: this.currentUser.userCode,
            clientid: this.clientid,
          },
        ],
        requestId: "55",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;

        let res1;

        if (response.errorCode > 0) {
          return;
        } else if (response && response[0].rows && response[0].rows[0][1]) {
          res1 = this.utilServ.convertToObject(response[0]);
          this.clientid = 1;

          this.model.FirstName = res1[0].ClientFirstName;
          this.model.MiddleName = res1[0].ClientMiddleName;
          this.model.LastName = res1[0].ClientLastName;
          this.model.perAddress1 = res1[0].RESADD1;
          this.model.perPIN = res1[0].RESPIN;
          this.model.Mobile = res1[0].MobilePhone;
          this.model.DOB = res1[0].dob;
          this.model.Gender = res1[0].sex;
          // this.model.MaritalStatus=res1[0].;
          // this.model.Natinality = res1[0].;
          this.model.Email = res1[0].RESEMAIL.toLowerCase();
          this.model.SecondaryEmail = "";
          // this.model.dpid = '';
          // this.model.MFAccount = res1[0].MfAccount;
          if (this.upperstring == "FR") {
            this.franch = true;
            this.getfranch();
            this.model.type = "F";
          } else {
            this.model.type = "E";
          }
          this.model.Employee = "";
          this.model.perCity = "";
          this.model.perAddress2 = res1[0].RESADD2;
          this.model.perState = res1[0].ResState;
          this.model.perCountry = res1[0].ResCountry;
          // { COUNTRYNAME: res1[0].ResCountry, Name: res1[0].ResCountry} ;
          this.model.comAddress1 = "";
          this.model.comAddress2 = "";
          this.model.comCity = "";
          this.model.comCountry = res1[0].ResCountry;
          // { COUNTRYNAME: res1[0].ResCountry, Name: res1[0].ResCountry} ;
          this.model.TradeCode = res1[0].tradecode;
          this.model.dpid = res1[0].dpacno;
          this.model.MFAccount = res1[0].mfacno;
          this.model.CINNo = res1[0].CINNo;
          return;
        }
        if (response && response[0] && response[0].rows) {
          let error = response[0].rows[0][0];
          this.notification.warning(error, "");
        }
      });
  }

  getcountryList() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 43,
            WhereClause: "",
            ShowAll: "N",
            TableName: "",
          },
        ],
        requestId: "4",
        outTblCount: "0",
      })
      .then((response) => {
        if (response && response[0].rows.length > 0) {
          this.country = this.utilServ.convertToObject(response[0]);
          this.country = [...this.country];
        } else if (response.errorMsg) {
        }
      });
  }

  test(data) {
    if (data) {
      this.model.Locationbo = data.Location;
    }
  }
  getfranch() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            user: this.currentUser.userCode,
          },
        ],
        requestId: "56",
        outTblCount: "0",
      })
      .then((response) => {
        if (response && response[0].rows.length > 0) {
          this.frlocation = this.utilServ.convertToObject(response[0]);
          this.frlocation = [...this.frlocation];
          this.model.Location = {
            Location: this.frlocation[0].Location,
            LocationName: this.frlocation[0].LocationName,
          };
          this.franch = true;
        } else if (response.errorMsg) {
          this.franch = false;
        }
      });
  }
}
