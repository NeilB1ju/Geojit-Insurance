import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { FindType } from "shared";
import { FindOptions } from "shared";
import * as  jsonxml from 'jsontoxml';
import { InputMasks, InputPatterns } from 'shared';
import { FormHandlerComponent } from 'shared';
import { UploadFile } from 'ng-zorro-antd';


declare var Tiff: any;
export interface SpMasterForm {
  Employee: any;
  SPCode: string;
  CorporateAgentName: string;
  CorporateAgentId: Number;
  CertificateNo: string;
  Institute: string;
  LicenceFrom: Date;
  LicenceTo: Date;
  ValidityFrom: Date;
  ValidityTo: Date;
  DOB: Date;
  DateOfJoin: Date;
  Department: string;
  PAN: string;
  Email: string;
  Location: any;
  Spid: Number;
  Branch: string;
  Designation: string;
  Active: boolean;
  TerminatedDate: Date;
  TerminatedReason: String;
  CACode: string;
  OfficialAddress: string;
  DOJ: Date;
  DOL: Date;
  Telephone: String;
  MRP: Number;
  type: string;
  sign: any;
  photo: any;
  DOO: Date;
  DOC: Date;
  PhotoName: string;
  CertificateName: string;
  PhotoFileType: string;
  CertificateFileType: string;
  IRDAIDiscontinuationRemarks: string;
  IRDAIDiscontinuationDate:  Date;
  IRDAISubmissionDate:  Date;
  IRDAIApprovalDate:  Date;
  URNAllotted: string;
  BlackListedSP: string;
  InsuranceCategory: string;
  
}

@Component({
  templateUrl: './sp-master.component.html',
  styleUrls: ['./sp-master.component.less'],
  selector: 'nz-demo-table-basic',
  // animations: [bounceInOutAnimation]
})

export class SpMaster implements OnInit {

  public mask = [/^[a-zA-Z ]*$/];
  

  formHandlerRight: boolean = false;
  Addtogrid: Array<any> = [];
  corporateAgent: Array<any> = [];
  EmployeeFindopt: FindOptions;
  locationFindopt: FindOptions;
  FranchiseeFindopt: FindOptions;
  onModifyState: boolean;
  fileListSignature: Array<any> = [];
  fileListPhoto: Array<any> = [];
  inputMasks = InputMasks;
  inputPatterns = InputPatterns;
  InstituteData: Array<any> = [];
  isSpinning:boolean=false;
  InsuranceCategory:Array<any> = [];
  disableLeavingDate:boolean=false


  model: SpMasterForm;
  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;
  @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;


  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  dateFormat = 'dd/MM/yyyy';

  // photoPreview: SafeUrl;
  filePreiewContent: string;
  filePreiewContentType: string;
  filePreiewFilename: string;
  filePreiewVisible: boolean;
  modifyform: boolean =true;
  LocationEditButton:boolean =false;
  repeat:number;
  alphaNumeric:any

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private _DomSanitizationService: DomSanitizer,
  ) {
    this.model = <SpMasterForm>{

      LicenceFrom: null,
      LicenceTo: null,
      ValidityFrom: null,
      ValidityTo: null,
      DOB: new Date(),
      DateOfJoin: new Date()

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;

    });


    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title: 'Location',
      requestId: 2
    }
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'EmployeeID',
      codeLabel: 'Emp Id',
      descColumn: 'Name',
      descLabel: 'Name',
      title: 'Employee',
      requestId: 2
    }
    this.FranchiseeFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'LocationName',
      descLabel: 'LocationName',
      title: 'Location',
      requestId: 2
    }
  }

  ngOnInit() {
    
    console.log("this.dataServ.branch",this.dataServ.branch);
    (this.dataServ.branch === 'HOGT' || this.dataServ.branch === 'HO' )? this.LocationEditButton=true:this.LocationEditButton=false;
    this.formHandlerRight =true 
    // this.dataServ.modifyright;
    this.getInstitute();
    this.getInsuranceCategory()
    this.model.Employee = "";
    this.model.SPCode = "";
    this.model.CertificateNo = "";
    // this.model.Institute = "";
    this.model.LicenceFrom = null;
    this.model.LicenceTo = null;
    this.model.ValidityFrom = null;
    this.model.ValidityTo =null;
    this.model.DOB = null;
    this.model.DateOfJoin = null;
    this.model.Department = "";
    this.model.PAN = "";
    this.model.Email = "";
    this.model.Location = "";
    this.Addtogrid = [];
    this.onModifyState = false;
    this.formHandler.config.isModifyState = false;
    this.formHandler.config.showModifyBtn = false;
    this.formHandler.setFormType('default');
    this.formHandler.config.showDeleteBtn = false;
    this.model.Active = true;
    this.model.Branch = "";
    this.model.Designation = "";
    this.getCorporateAgent();
    this.model.TerminatedDate = null;
    this.model.TerminatedReason = '';
    this.model.type = 'E';
    this.fileListSignature = [];
    this.fileListPhoto = [];
    this.model.DOO = null;
    this.model.DOC = null;
    this.model.MRP = null;
    this.model.Telephone = '';
    this.model.OfficialAddress = '';
    this.model.DOJ = null;
    this.model.DOL = null;
    // this.photoPreview = '';
    this.model.CertificateName = '';
    this.model.photo = '';
    this.model.IRDAIDiscontinuationRemarks= null;
    this.model.IRDAIDiscontinuationDate= null;
    this.model.IRDAISubmissionDate= null;
    this.model.IRDAIApprovalDate= null;
    this.model.URNAllotted= null;
    this.model.BlackListedSP= null;
    this.model.InsuranceCategory= null;
    this.repeat=1
    this.modifyform=true?this.disableLeavingDate=true:this.disableLeavingDate=false;
    // let data=this.inputMasks.alphaNumeric
    // console.log("inputMasks.alphaNumeric", data);
  }

  nameMask (rawValue) {
    /** @type {?} */
    var pattern = /^[a-z0-9 ]+$/i;
    /** @type {?} */
    var numberLength = 0;
    numberLength = rawValue.replace(/[^A-Z0-9 ]/gi, "").length;
    return Array.apply(null, { length: numberLength }).map((/**
     * @return {?}
     */
    function () { return pattern; }));
}

  Save() {

    debugger

    if (!this.model.Employee) {
      this.notification.error('Please enter Employee', 'error');
      return;
    }
    if (!this.model.SPCode) {
      this.notification.error('Please enter SP Code', 'error');
      return;
    }
    if (this.model.Active == false) {
      if (!this.model.TerminatedDate) {
        this.notification.error('Please enter Terminated Date', 'error');
        return;
      }

      if (!this.model.TerminatedReason) {
        this.notification.error('Please enter Terminated Reason', 'error');
        return;
      }
    }

    if(this.model.LicenceFrom > this.model.LicenceTo)
    {
      this.notification.error('Give Valid Exam Validity Date', 'error');
        return;
    }
    if(this.model.ValidityFrom > this.model.ValidityTo)
    {
      this.notification.error('Give Valid SP Certificate Validity  Date', 'error');
        return;
    }

    let terminatedDate = moment(this.model.TerminatedDate);
    if (terminatedDate.diff(moment(), 'days') < 0) {
      this.notification.error('Terminated date should be Future date or Current date', 'error')
      this.model.TerminatedDate = null;
      return;

    }
    if (!this.model.LicenceFrom) {
      this.notification.error('Please select Exam Validity From', 'error');
      return;
    }
    if (!this.model.LicenceTo) {
      this.notification.error('Please select Exam Validity To', 'error');
      return;
    }
    if (!this.model.ValidityFrom) {
      this.notification.error('Please select SP Certificate Validity From', 'error');
      return;
    }
    if (!this.model.ValidityTo) {
      this.notification.error('Please select SP Certificate Validity To', 'error');
      return;
    }
    if (!this.model.Telephone) {
      this.notification.error('Please enter Telephone', 'error');
      return;
    }
    if (!this.model.Email) {
      this.notification.error('Please enter Email', 'error');
      return;
    }
    if (this.model.type == 'E') {
      if (!this.model.PAN) {
        this.notification.error('Please enter PAN', 'error');
        return;
      }
    }
    if (!this.model.OfficialAddress) {
      this.notification.error('Please enter OfficialAddress', 'error');
      return;
    }
    if (!this.model.photo) {
      this.notification.error('Please select photo', 'error');
      return;
    }
    if (!this.model.sign) {
      this.notification.error('Please select Certificate', 'error');
      return;
    }
    // if (!this.model.Institute) {
    //   this.notification.error('Please enter Institute', 'error');
    //   return;
    // }
    if (!this.model.CertificateNo) {
      this.notification.error('Please enter CertificateNo', 'error');
      return;
    }
    let locationData = this.Addtogrid.map((o) => { return { LocationCode: o.Location }; });
    var JSONData = this.utilServ.setJSONArray(locationData);
    var xmlData = jsonxml(JSONData);
    this.isSpinning =true;
    this.dataServ.getResultArray({
      "FileImport": "false",
      "batchStatus": "false",
      "detailArray": [{
        IorU: this.onModifyState ? "U" : "I",
        SpId: this.onModifyState ? this.model.Spid : 0,
        SpCode: this.model.SPCode,
        EmployeeID: this.model.type == 'E' ? this.model.Employee.EmployeeID : this.model.Employee.Location,
        LicenseFrom: this.model.LicenceFrom ? moment(this.model.LicenceFrom).format(AppConfig.dateFormat.apiMoment) : '',
        LicenseTo: this.model.LicenceTo ? moment(this.model.LicenceTo).format(AppConfig.dateFormat.apiMoment) : '',
        CACode: this.model.CorporateAgentId || '',
        CertificateNo: this.model.CertificateNo,
        ValidityFrom: this.model.ValidityFrom ? moment(this.model.ValidityFrom).format(AppConfig.dateFormat.apiMoment) : '',
        ValidityTo: this.model.ValidityTo ? moment(this.model.ValidityTo).format(AppConfig.dateFormat.apiMoment) : '',
        institute: this.model.Institute||'',
        TerminatedDate: this.model.Active ? '' : moment(this.model.TerminatedDate).format(AppConfig.dateFormat.apiMoment),
        TerminatedReason: this.model.Active ? '' : this.model.TerminatedReason,
        Active: this.model.Active ? "Y" : "N",
        EmailId: this.model.Email || '',
        PANNumber: this.model.PAN || '',
        OfficialAddress: this.model.OfficialAddress || '',
        DateOfJoining: this.model.type == 'F' || this.model.DOJ == null ? '' : moment(this.model.DOJ).format(AppConfig.dateFormat.apiMoment),
        DateOfLeaving: this.model.type == 'F' || this.model.DOL == null ? '' : moment(this.model.DOL).format(AppConfig.dateFormat.apiMoment),
        Telephone: this.model.Telephone || '',
        LeadType: this.model.type == 'E' ? 'E' : 'F',
        Euser: this.currentUser.userCode || '',
        Photo: this.model.photo || '',
        Certificate: this.model.sign || '',
        XMLString: xmlData,
        MonthlyRenumerationPaid: this.model.MRP || 0,
        FranchiseeOpenDate: this.model.type == 'E' || this.model.DOO == null ? '' : moment(this.model.DOO).format(AppConfig.dateFormat.apiMoment),
        FranchiseeClosedDate: this.model.type == 'E' || this.model.DOC == null ? '' : moment(this.model.DOC).format(AppConfig.dateFormat.apiMoment),
        PhotoFileName: this.model.PhotoName || '',
        CertificateFileName: this.model.CertificateName || '',
        CertificateFileType: this.model.CertificateFileType || '',
        PhotoFileType: this.model.PhotoFileType || '',
        IRDAIDiscontinueRemarks:this.model.IRDAIDiscontinuationRemarks?this.model.IRDAIDiscontinuationRemarks:'',
        IRDAIDiscontinueDate:this.model.IRDAIDiscontinuationDate== null ? '' :moment(this.model.IRDAIDiscontinuationDate).format(AppConfig.dateFormat.apiMoment),
        IRDAISubmissionDate:this.model.IRDAISubmissionDate== null ? '' :moment(this.model.IRDAISubmissionDate).format(AppConfig.dateFormat.apiMoment),
        IRDAIApprovalDate :this.model.IRDAIApprovalDate== null ? '' :moment(this.model.IRDAIApprovalDate).format(AppConfig.dateFormat.apiMoment),
        URNAllotted :this.model.URNAllotted?this.model.URNAllotted:'',
        BlackListedSP :this.model.BlackListedSP?this.model.BlackListedSP:'',
        InsuranceCategory :this.model.InsuranceCategory?this.model.InsuranceCategory:''

      }],
      "requestId": "6",
    }).then((response) => {
      this.isSpinning =false;

      if (response && response.errorMsg) {
        this.notification.error(response.errorMsg, 'error');
        return;
      }
      if (response && response.results) {
        if (this.formHandler.config.isModifyState == true) {
          this.notification.success('Data updated successfully', 'success');
        } else {
          this.notification.success('Data saved successfully', 'success');
        }
        this.Reset();

      }
    })
      .catch(function (error) {
      });
  }

  Reset() {
    this.ngOnInit();
  }
  onLookupSelect(data) {


    this.model.SPCode = data.SPCode;
    this.model.Employee = data.LeadType == 'E' ? { EmployeeID: data.EmployeeID, Name: data.Name } : { Location: data.EmployeeID, LocationName: data.Name };
    this.model.Spid = data.SPID;
    if (this.formHandlerRight == true) {
      this.formHandler.config.isModifyState = true;
      this.onModifyState = true;
    }
    else {
      this.formHandler.config.isModifyState = false;
      this.formHandler.config.showSaveBtn = false;
      return;
    }
    this.model.Active = data.Active == 'Y';
    this.model.Branch = data.Location;
    this.model.DOB = data.DOB;
    this.model.type = data.LeadType;
    this.model.DOJ = data.DOJ;
    this.model.DOL = data.RelievedDate;
    this.Retrieve();
    this.getLocation();
    this.modifyform=false
    this.formHandler.config.isModifyState = false;
    this.formHandler.config.showSaveBtn = false;
    this.formHandler.config.showModifyBtn = true;

  }
  Search() {

    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 1001, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }


    this.lookupsearch.actionOpen(reqParams, 'SP');

  }

  Retrieve() {


    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          FilterType: this.model.type == 'E' ? 'E' : 'F',
          Filtervalue: this.model.type == 'E' ? this.model.Employee.EmployeeID : this.model.Employee.Location
        }],
      "requestId": "14",
    }).then((response) => {

      let result1 = response.results[0];
      let employeedetails = result1[0];

      console.log("employeedetails",employeedetails);
      
      this.model.DOB = employeedetails.DOB;
      this.model.Designation = employeedetails.Designation;
      this.model.Department = employeedetails.Department;
      this.model.Email = employeedetails.Email.toLowerCase();
      this.model.PAN = employeedetails.PANNumber;
      this.model.Branch = employeedetails.Location;
      this.model.DOJ = employeedetails.DOJ
      this.model.DOO = employeedetails.BranchStartDate
      this.model.DOL = employeedetails.RelievedDate





      // this.Addtogrid=employeedetails.Location;


      if (response && response.length > 0) {
        let res;
      }
    })
      .catch(function (error) {
      });
  }


  getInstitute() {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "Code": 32,
          "WhereClause": '',
          "ShowAll": 'N',
          "TableName": ""
        }],
      "requestId": "4",
      "outTblCount": "0"
    })
      .then((response) => {

        if (response && response[0].rows.length > 0) {

          this.InstituteData = this.utilServ.convertToObject(response[0]);
          this.InstituteData = [...this.InstituteData];
          this.model.Institute = this.InstituteData[0].Code;
        } else if (response.errorMsg) {

        }
      });

  }


  updateLocationData(type){

    debugger

    // if(this.repeat == 1){
      this.modal.warning({
        nzTitle: 'Warning',
        nzContent: 'You are trying to break the existing priority-based SP mapping on exceptional basis.',
        nzOnOk: () =>{type === 'Update'?this.Addtoloacationtable():this.Deleterow(undefined)},
        // nzOnCancel:()=>{}
      });
      // this.repeat=-1;
    // } 
    // else{
    //   this.Addtoloacationtable()
    // }

  }

  


  Addtoloacationtable() {
    
     debugger

    if (!this.model.Location) {
      this.notification.error('Please enter Location', 'error');
      // this.repeat=1;
      // console.log(" this.repeat=1;", this.repeat=1,typeof(this.repeat));
      
      
      return;
    } else {
        
      let locationdata = this.Addtogrid.find((object) => {
        return object.Location == this.model.Location.Location;
      });
      if (locationdata) {
        this.notification.error('Location Already Exist', 'error');
        // this.repeat=1;

      } else {

        this.Addtogrid = [...this.Addtogrid, this.model.Location];
        this.model.Location = '';

      }
    }
  }


  Deleterow(i) {

    debugger
    
    this.Addtogrid.splice(i, 1)
    this.Addtogrid = [...this.Addtogrid];
  }

  onChangeEmployee(data) {
    if (data) {
      if (data.PANNumber)
        this.model.PAN = data.PANNumber;
      if (!data.PANNumber)
        this.model.PAN = '';
      if (data.Email)
        this.model.Email = data.Email.toLowerCase();
      if (!data.Email)
        this.model.Email = '';
      if (data.Department)
        this.model.Department = data.Department;
      if (!data.Department)
        this.model.Department = '';
      if (data.Location)
        this.model.Branch = data.Location;
      if (!data.Location)
        this.model.Branch = '';
      if (data.DOB)
        this.model.DOB = new Date(data.DOB);
      if (!data.DOB)
        this.model.DOB = null;
      if (data.Designation)
        this.model.Designation = data.Designation;
      if (!data.Designation)
        this.model.Designation = '';
      if (data.DOJ)
        this.model.DOJ = new Date(data.DOJ);
      if (!data.DOJ)
        this.model.DOJ = null;
      if (data.RelievedDate)
        this.model.DOL = data.RelievedDate;
      if (!data.RelievedDate)
        this.model.DOL = null;
      if (data.Address1)
        this.model.OfficialAddress = data.Address1;
      if (data.Address2)
        this.model.OfficialAddress += data.Address2;
      if (data.Address3)
        this.model.OfficialAddress += data.Address2 += data.Address3;
      if (data.Address4)
        this.model.OfficialAddress += data.Address2 += data.Address3 += data.Address4;
      // if (!data.Address)
      //   this.model.OfficialAddress = '';
      if (data.MobileNo)
        this.model.Telephone = data.MobileNo;
      if (!data.MobileNo)
        this.model.Telephone = '';
      if (this.Addtogrid)
        this.Addtogrid = [];
      this.model.SPCode = '';
      this.model.CertificateNo = '';
      this.model.ValidityFrom =null;
      this.model.ValidityTo = null;
      this.model.LicenceFrom =null;
      this.model.LicenceTo = null;
      this.model.Active = true;
      this.model.TerminatedDate = null;
      this.model.TerminatedReason = '';
      if (this.model.photo)
        this.model.photo = '';
      if (this.model.CertificateName)
        this.model.CertificateName = ''
      this.fileListSignature = [];
      this.fileListPhoto = [];
      if (this.formHandler.config.isModifyState) {
        this.model.PAN = '';
        this.model.Email = '';
        this.model.Department = '';
        this.model.Branch = '';
        this.model.DOB = null;
        this.model.Designation = '';
        this.model.DOJ = null;
        this.model.DOL = null;
        this.model.OfficialAddress = '';
        this.model.Telephone = '';
        this.Addtogrid = [];
        if (this.model.photo)
          this.model.photo = '';
        if (this.model.CertificateName)
          this.model.CertificateName = ''
        this.fileListSignature = [];
        this.fileListPhoto = [];
      }


    }
  }
  onChangeFranchisee(data) {

    if (data.BranchStartDate)
      this.model.DOO = new Date(data.BranchStartDate);
    if (!data.BranchStartDate)
      this.model.DOO = null;
    if (data.closedDate)
      this.model.DOC = new Date(data.closedDate);
    if (!data.closedDate)
      this.model.DOC = null;
    if (data.Location)
      this.model.Branch = data.Location;
    if (!data.Location)
      this.model.Branch = '';
    if (data.Email)
      this.model.Email = data.Email.toLowerCase();
    if (!data.Email)
      this.model.Email = '';
    if (data.Address1)
      this.model.OfficialAddress = data.Address1;
    if (data.Address2)
      this.model.OfficialAddress += data.Address2;
    if (data.Address3)
      this.model.OfficialAddress += data.Address2 += data.Address3;
    if (data.Address4)
      this.model.OfficialAddress += data.Address2 += data.Address3 += data.Address4;
    if (this.model.photo)
      this.model.photo = '';
    if (this.model.CertificateName)
      this.model.CertificateName = ''
    this.fileListSignature = [];
    this.fileListPhoto = [];
    if (this.Addtogrid)
      this.Addtogrid = [];
    this.model.SPCode = '';
    this.model.CertificateNo = '';
    this.model.ValidityFrom = null;
    this.model.ValidityTo = null;
    this.model.LicenceFrom =null;
    this.model.LicenceTo = null;
    this.model.Active = true;
    this.model.TerminatedDate = null;
    this.model.TerminatedReason = '';
    if (this.formHandler.config.isModifyState) {
      // this.model.PAN = '';
      this.model.Email = '';
      // this.model.Department = '';
      this.model.Branch = '';
      this.model.DOB = null;
      // this.model.Designation = '';
      this.model.DOC = null;
      this.model.DOO = null;
      this.model.OfficialAddress = '';
      this.model.Telephone = '';
      this.Addtogrid = [];
      if (this.model.photo)
        this.model.photo = '';
      if (this.model.CertificateName)
        this.model.CertificateName = ''
      this.fileListSignature = [];
      this.fileListPhoto = [];
    }
  }

  onChangeActive(data) {

    if (data) {

      if (this.model.TerminatedDate)
        this.model.TerminatedDate = null;
      if (this.model.TerminatedReason)
        this.model.TerminatedReason = '';
    }
  }
  onChangeType(data) {

    if (data) {

      if (this.model.Branch)
        this.model.Branch = '';
      if (this.model.Department)
        this.model.Department = '';
      if (this.model.Designation)
        this.model.Designation = '';
      if (this.model.PAN)
        this.model.PAN = '';
      if (this.model.Email)
        this.model.Email = '';
      if (this.model.DOB)
        this.model.DOB = null
      if (this.model.DOJ)
        this.model.DOJ = null
      if (this.model.DOL)
        this.model.DOL = null
      if (this.model.OfficialAddress)
        this.model.OfficialAddress = '';
      if (this.model.Telephone)
        this.model.Telephone = '';
      if (this.model.MRP)
        this.model.MRP = null;
      this.fileListSignature = [];
      this.fileListPhoto = [];
      if (this.model.Employee)
        this.model.Employee = '';
      this.Addtogrid = [];
      if (this.model.Location)
        this.model.Location = '';
      if (this.model.SPCode)
        this.model.SPCode = '';
      if (this.model.Institute)
        this.model.Institute = '';
      if (this.model.CertificateNo)
        this.model.CertificateNo = '';
      if (this.model.LicenceFrom)
        this.model.LicenceFrom =null;
      if (this.model.LicenceTo)
        this.model.LicenceTo = null;
      if (this.model.ValidityFrom)
        this.model.ValidityFrom = null;
      if (this.model.ValidityTo)
        this.model.ValidityTo = null;
      if (this.model.TerminatedDate)
        this.model.TerminatedDate = new Date();
      if (this.model.TerminatedReason)
        this.model.TerminatedReason = '';
      if (!this.model.Active)
        this.model.Active = true;
      if (this.model.photo)
        this.model.photo = '';
      if (this.model.CertificateName)
        this.model.CertificateName = ''
      if(this.model.IRDAIDiscontinuationRemarks)
      this.model.IRDAIDiscontinuationRemarks=''
      if(this.model.IRDAIDiscontinuationDate)
      this.model.IRDAIDiscontinuationDate=null
      if(this.model.IRDAISubmissionDate)
      this.model.IRDAISubmissionDate=null
      if(this.model.IRDAIApprovalDate)
      this.model.IRDAIApprovalDate=null
      if(this.model.URNAllotted)
      this.model.URNAllotted=null
      if(this.model.BlackListedSP)
      this.model.BlackListedSP=null
      if(this.model.InsuranceCategory)
      this.model.InsuranceCategory=null
      this.formHandler.config.isModifyState = false;
    }
  }

  getLocation() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          SPID: Number(this.model.Spid),
          EUser: this.currentUser.userCode || ''


        }],
      "requestId": "7",
    }).then((response) => {

      if (response.results && response.results.length) {

        debugger

        let result1 = response.results[0];
        let empdetails = result1[0];
        console.log("empdetails",empdetails);
        this.Addtogrid = response.results[1];
        console.log("gridddddddd",this.Addtogrid);
        this.model.CorporateAgentName = empdetails.CorporateAgentName
        this.model.CertificateNo = empdetails.CertificateNo;
        this.model.LicenceFrom = new Date(empdetails.LicenseFrom);
        this.model.LicenceTo = new Date(empdetails.LicenseTo);
        this.model.ValidityFrom = new Date(empdetails.ValidityFrom);
        this.model.ValidityTo = new Date(empdetails.ValidityTo);
        this.model.Institute = empdetails.institute;
        this.model.TerminatedDate = empdetails.TerminatedDate;
        this.model.TerminatedReason = empdetails.TerminatedReason;
        this.model.OfficialAddress = empdetails.OfficialAddress;
        this.model.Telephone = empdetails.Telephone;
        this.model.PAN = empdetails.PANNumber;
        this.model.DOL = empdetails.DateOfLeaving;
        this.model.DOJ = empdetails.DateOfJoining;
        this.model.DOO = empdetails.FranchiseeOpenDate;
        this.model.DOC = empdetails.FranchiseeClosedDate;
        this.model.MRP = empdetails.MonthlyrenumerationPaid;

        this.model.IRDAIDiscontinuationRemarks=empdetails.IRDAIDiscontinueRemarks
        this.model.IRDAIDiscontinuationDate= empdetails.IRDAIDiscontinueDate
        this.model.IRDAISubmissionDate=empdetails.IRDAISubmissionDate
        this.model.IRDAIApprovalDate=empdetails.IRDAIApprovalDate
        this.model.URNAllotted=empdetails.URNAllotted
        empdetails.BlackListedSP===true?this.model.BlackListedSP="Y":"N"
        // console.log("this.model.BlackListedSP",this.model.BlackListedSP,"empdetails.BlackListedSP",empdetails.BlackListedSP);
        this.model.InsuranceCategory=empdetails.InsuranceCategory
        if (this.model.type == 'E') {
          this.model.Email = empdetails.Email.toLowerCase();
        }
        else {
          this.model.Email = empdetails.Email.toLowerCase();
        }
        if (empdetails.Certificate) {
          this.fileListSignature = [
            {
              uid: -1,
              name: empdetails.CertificateFileName,
              status: 'done',
              // url: empdetails.Certificate,
            }
          ];

          
          this.model.sign = empdetails.Certificate;
          this.model.CertificateName = empdetails.CertificateFileName;
          this.model.CertificateFileType = empdetails.CertificateFileType;
          // this.photoPreview = this._DomSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + this.model.sign);
        }
        else {
          this.fileListSignature = [];
          this.model.sign = '';
          this.model.CertificateName = '';
          this.model.CertificateFileType = '';

        }
        if (empdetails.Photo) {
          this.fileListPhoto = [
            {
              uid: -1,

              name: empdetails.PhotoFileName,
              status: 'done',
              // url: empdetails.photo,
            }
          ];
          this.model.photo = empdetails.Photo;
          this.model.PhotoName = empdetails.PhotoFileName;
          this.model.PhotoFileType = empdetails.PhotoFileType;
          // this.photoPreview = this._DomSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + this.model.photo);
        }
        else {
          this.fileListPhoto = [];
          this.model.photo = '';
          this.model.PhotoName = '';
          this.model.PhotoFileType = '';
        }
      }
    }).catch(function (error) {
    });
  }

  getInsuranceCategory() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 46
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.InsuranceCategory = this.utilServ.convertToObject(response[0]);
        this.model.InsuranceCategory = this.InsuranceCategory[0].Code;
      } else {

      }
    });
  }

  getCorporateAgent() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 29
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.corporateAgent = this.utilServ.convertToObject(response[0]);
        this.model.CorporateAgentId = this.corporateAgent[0].Code;
      } else {

      }
    });
  }

  beforeUploadSign = (file: UploadFile): boolean => {
    if ((file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/tiff') ||
      (file.type == 'application/pdf')) {
      this.fileListSignature = [file];
      this.model.CertificateName = file.name;
      this.model.CertificateFileType = file.type;
      this.encodeSignFileAsURL(file);
      return false;
    } else {
      this.notification.error('Please Upload JPG,JPEG,PNG,GIF,TIFF,PDF files', 'error');
    }
  }

  beforeUploadPhoto = (file: UploadFile): boolean => {
    if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/tiff') {
      this.fileListPhoto = [file];
      this.model.PhotoName = file.name;
      this.model.PhotoFileType = file.type
      this.encodeImageFileAsURL(file);
      return false;
    } else {
      this.notification.error('Please Upload JPG,JPEG,PNG,GIF,TIFF files', 'error');
    }
  }

  encodeSignFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {

      let dataUrl: string = reader.result.toString();
      this.model.sign = dataUrl.split(',')[1];
    }
    reader.readAsDataURL(file);
  }

  encodeImageFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {

      let dataUrl: string = reader.result.toString();
      this.model.photo = dataUrl.split(',')[1];
    }
    reader.readAsDataURL(file);
  }

  previewFile(b64: string, fileName: string, contentType: string): void {

    debugger

    if (b64) {
      this.filePreiewContent = b64;
      this.filePreiewFilename = fileName;
      this.filePreiewContentType = contentType;
      this.filePreiewVisible = true;
    }
  }

  modify()
  {
    this.modifyform=true
    this.formHandler.config.showModifyBtn = false;
  
    this.formHandler.config.isModifyState = true;
    this.formHandler.config.showSaveBtn = true;
    // this.isModifyState =true
  }



}














