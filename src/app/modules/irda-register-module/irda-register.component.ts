import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NzNotificationService, NzModalService, UploadFile } from 'ng-zorro-antd';

import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { LookUpDialogComponent, UtilService, ValidationService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { AppConfig } from 'shared';
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";
import { User } from 'shared/lib/models/user';
import { InputMasks } from 'shared';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { log } from 'util';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface CommonReportForm {

  PolicyNumber: any
  nameOfComplaint: any
  natureOfComplaint: any
  dateOfComplaint: any
  spCode: any
  spName: any
  spStatus: any
  actionTaken: any
  Status: any
  closedDate: any


}

@Component({
  selector: 'app-irda-register',
  templateUrl: './irda-register.component.html',
  styleUrls: ['./irda-register.component.less']
})

export class IRDARegisterComponent implements OnInit {
  validateForm!: FormGroup;
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;





  Records: Array<any> = [];
  Columns: Array<any> = [];
  html;
  isProcessing;
  businessArr: Array<any> = [];
  exporttypeList: Array<any> = [];
  model: any
  isSpinning = false;
  currentUser: any
  SpFindopt: FindOptions
  PolicyFindOption: FindOptions
  saveORUpdateButtonFlag: boolean = false
  StatusDropdown: any
  closeDateFlag: boolean = false
  file = []
  Document: any
  Doctype: any
  img: any
  imgType: any
  isVisible: boolean
  baseSixtyPdfUral: any
  basesixtyural: any
  filePreiewContent: any
  filePreiewContentType: any
  fileName:any
  fileNameFromDb:any
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private ValidServ: ValidationService,
    private sanitizer: DomSanitizer

  ) {
    this.model = <CommonReportForm>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );

    this.SpFindopt = {
      findType: 1001,
      codeColumn: 'SPCode',
      codeLabel: 'SPCode',
      descColumn: 'SPCode',
      descLabel: 'SPCode',
      title: 'SP',
      hasDescInput: false,
      requestId: 2

    }
    this.PolicyFindOption = {
      findType: 1024,
      codeColumn: 'PolicyNo',
      codeLabel: 'PolicyNo',
      descColumn: 'PolicyNo',
      descLabel: 'PolicyNo',
      title: 'SP',
      hasDescInput: false,
      requestId: 2

    }
  }

  ngOnInit() {

    this.validatationForm()
    this.getDropDown()
    this.OnChangeSpCode("reset")

  }


  getDropDown() {
    this.isSpinning = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Flag: 'Dropdown',
          ComplaintID: 0,
          Euser: this.currentUser.userCode ? this.currentUser.userCode : '',
          Nameofcomplainant: "",
          Natureofcomplaint: "",
          Date: "",
          PolicyNumber: "",
          Spcode: "",
          Spname: "",
          SpStatus: "",
          ActionTaken: "",
          complaintStatus: "",
          ClosedDate: "",
          complaintDoc: "",
          DocType: "",
          Filename:""
        }],
      "requestId": "145",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response[0] && response[0].rows.length > 0) {
        this.isSpinning = false;
        this.StatusDropdown = this.utilServ.convertToObject(response[0]);

      } else if (response.errorMsg) {
        this.isSpinning = false;
        this.notification.error(response.errorMsg, '');
      }
      else {
        this.isSpinning = false;
        this.notification.error('No data found', '');
      }
    })


  }


  validatationForm() {
    // validation using reactiveformModules
    this.validateForm = this.fb.group({
      // first holder details 
      nameOfComplainant: [null, Validators.required],
      natureOfComplaint: [null, Validators.required],
      dateOfComplaint: [null, Validators.required],
      PolicyNumber: [null, Validators.required],
      spCode: [null, Validators.required],
      spName: [null, Validators.required],
      spStatus: [null, Validators.required],
      actionTaken: [null, Validators.required],
      Status: [null, Validators.required],
      closedDate: [null],

    })
  }

  Search() {


    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 1023, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }


    this.lookupsearch.actionOpen(reqParams, 'clients');
  }

  onLookupSelect(data: any, type: any) {

    debugger

    console.log("data", data, "type", type);

    this.img =''
    this.imgType=''
    this.Document=''
    this.file=[]


    this.saveORUpdateButtonFlag = true
    this.model.complaintId = null
    let flag = type ? type : ''
    this.model.complaintId = data.ComplaintID ? data.ComplaintID : ''

    this.isSpinning = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{

          Flag: flag ? flag : '',
          ComplaintID: this.model.complaintId ? this.model.complaintId : '',
          Euser: this.currentUser.userCode ? this.currentUser.userCode : '',
          Nameofcomplainant: "",
          Natureofcomplaint: "",
          Date: "",
          PolicyNumber: "",
          Spcode: "",
          Spname: "",
          SpStatus: "",
          ActionTaken: "",
          complaintStatus: "",
          ClosedDate: "",
          complaintDoc: "",
          DocType: "",
          Filename:""

        }],
      "requestId": "145",
      "outTblCount": "0"
    }).then((response) => {
      if (response && response[0] && response[0].rows.length > 0) {

        let data = this.utilServ.convertToObject(response[0]);

        debugger

        console.log("data update", data);
        this.model.Location = { Location: this.dataServ.branch ? this.dataServ.branch : "" }
        this.model.PolicyNumber = { PolicyNo: data[0].PolicyNumber }
        this.model.nameOfComplaint = data[0].Nameofcomplainant
        this.model.natureOfComplaint = data[0].Natureofcomplaint
        this.model.dateOfComplaint = data[0].Dateofcomplaint
        this.model.spCode = { SPCode: data[0].Spcode ? data[0].Spcode : "", Active: data[0].SpStatus ? "Y" : "N", Name: data[0].Spname ? data[0].Spname : "" }
        this.model.Status = data[0].complaintStatus
        this.model.actionTaken = data[0].ActionTaken
        this.model.closedDate = data[0].ClosedDate
        debugger
        this.img = data[0].ComplaintDoc
        this.imgType = data[0].DocType
        this.fileNameFromDb=data[0].Filename

        // this.img
        // this.isVisible=true
        // console.log("imgType", this.imgType,"this.img",this.img);
        // "ComplaintDoc"
        // 12
        // : 
        // "DocType"

        this.isSpinning = false;
      } else if (response.errorMsg) {
        this.isSpinning = false;
        this.notification.error(response.errorMsg, '');
      }
      else {
        this.isSpinning = false;
        this.notification.error('No data found', '');
      }
    })


  }

  handleCancel() {

    this.isVisible = false

  }



  onChangeStatus(data: any) {
    // debugger
    // console.log("data", data);
    data === 'Close' ? this.closeDateFlag = true : this.closeDateFlag = false

  }



  reset() {

    // this.model.PolicyNumber = null
    // this.model.nameOfComplaint = null
    // this.model.natureOfComplaint = null
    // this.model.dateOfComplaint = null
    // this.model.spCode = null
    // this.model.spName = null
    // this.model.spStatus = null
    // this.model.actionTaken = null

    this.validateForm.reset();
    this.OnChangeSpCode("reset")
    this.model.PolicyNumber = { PolicyNo: "" }
    this.saveORUpdateButtonFlag = false
    this.file=[]
    this.isVisible=false
    this.Document=''
    this.img =''
    this.imgType=''


  }

  OnChangeSpCode(data: any) {
    debugger
    if (data == "reset") {
      this.model.spCode = { SPCode: "", Active: "", Name: "" }
      return
    }
    else if (data) {
      this.model.spName = data.Name
      this.model.spStatus = data.Active
    }
    else {
      this.model.spCode = ''
      this.model.spStatus = ''
    }
  }






  Save(type): void {

    const controlNames = ['nameOfComplainant', 'natureOfComplaint', 'dateOfComplaint', 'PolicyNumber', 'spCode', 'spName', 'actionTaken', 'Status'];
    const customErrorMessages = {
      nameOfComplainant: 'The Name of Complainant is required.',
      natureOfComplaint: 'The Nature of Complaint is required.',
      dateOfComplaint: 'The Date of Complaint is required.',
      PolicyNumber: 'The Policy Number is required.',
      spCode: 'The SP Code is required.',
      spName: 'The SP Name is required.',
      actionTaken: 'The Action Taken is required.',
      Status: 'The  Status is required.'
    };

    debugger

    // sp for save details

    let isValid = this.ValidServ.validateForm(this.validateForm, controlNames, customErrorMessages, true)

    if (this.model.PolicyNumber && (this.model.PolicyNumber.PolicyNo === "" || this.model.PolicyNumber.PolicyNo === undefined)) {
      this.notification.error("The Policy Number is required.", '')
      return
    }
    debugger
    if (this.closeDateFlag == true && (this.model.closedDate == null || this.model.closedDate == undefined)) {
      this.notification.error("The Closed Date is required.", '')
      return
    }
    if (isValid == true) {
      let Notification

      if (type === "S") {
        this.model.complaintId = 0
        Notification = "Save"
      }
      else {
        Notification = "Update"
      }
      let saveFlag = type
      let complaintId = this.model.complaintId ? this.model.complaintId : 0;

      this.modalService.confirm({

        nzTitle: '<i>Confirmation</i>',
        nzContent: `<b>Do you want to ${Notification} ?</b>`,

        nzOnOk: () => {

          this.isSpinning = true

          this.dataServ.getResponse({
            "batchStatus": "false",
            "detailArray":
              [{

                Flag: saveFlag ? saveFlag : '',
                ComplaintID: complaintId ? complaintId : 0,
                Euser: this.currentUser.userCode ? this.currentUser.userCode : '',
                Nameofcomplainant: this.model.nameOfComplaint ? this.model.nameOfComplaint : '',
                Natureofcomplaint: this.model.natureOfComplaint ? this.model.natureOfComplaint : "",
                Date: this.model.dateOfComplaint ? moment(this.model.dateOfComplaint).format(AppConfig.dateFormat.apiMoment) : '',
                PolicyNumber: this.model.PolicyNumber.PolicyNo ? this.model.PolicyNumber.PolicyNo : "",
                Spcode: this.model.spCode.SPCode ? this.model.spCode.SPCode : "",
                Spname: this.model.spName ? this.model.spName : "",
                SpStatus: this.model.spStatus ? this.model.spStatus : "",
                ActionTaken: this.model.actionTaken ? this.model.actionTaken : "",
                complaintStatus: this.model.Status ? this.model.Status : "",
                ClosedDate: this.model.closedDate ? moment(this.model.closedDate).format(AppConfig.dateFormat.apiMoment) : '',
                complaintDoc: this.Document ? this.Document : '',
                DocType: this.Doctype ? this.Doctype : '',
                Filename:this.fileName?this.fileName:''



              }],
            "requestId": "145",
            "outTblCount": "0"
          })
            .then((response) => {
              if (response && response.length > 0) {
                this.isSpinning = false;
                let data = this.utilServ.convertToObject(response[0]);
                // console.log("data", data);
                if (saveFlag == 'S') {
                  if (data[0].Id == 1) {
                    this.notification.success(data[0].Message, '');
                    this.reset()
                  }
                  else {
                    this.notification.error(data[0].Message, '');
                    this.reset()
                  }
                }
                else {
                  if (data[0].Id == 2) {
                    this.notification.success(data[0].Message, '');
                    this.reset()
                  }
                  else {
                    this.notification.error(data[0].Message, '');
                    this.reset()
                  }
                }
                // this.createFlag = false;
                // this.resetForm()
              }
              else {
                this.isSpinning = false;
                this.notification.error(response.errorMsg, '');
                this.reset()
              }

            })
        }

      });
    }

  }

  disableDate = (current: Date): boolean => {
    const today = new Date();
    return current > today;

  };


  beforeUploadComplaint = (file: UploadFile): boolean => {

    debugger
    

    if ((file.type == 'image/jpeg' || file.type == 'image/jpg') || (file.type == 'application/pdf')) {

      this.isVisible = false;
      this.img =''
      this.imgType=''
      this.file = [file];
      this.fileName=file.name
      console.log("this.file",this.file);
      this.Doctype = file.type;
      this.encodeSignFileAsURL(file);
      return false;
    } else {
      this.file =[]
      this.notification.error('Please Upload JPG,JPEG,PDF files','');
      this.fileName=""
    }
  }

  encodeSignFileAsURL(file) {
    let reader = new FileReader();
    reader.onloadend = () => {

      let dataUrl: string = reader.result.toString();
      this.Document = dataUrl.split(',')[1];
      console.log("this.Document", this.Document);

    }
    reader.readAsDataURL(file);
  }


  View() {
    debugger

    if (this.img) {

      this.imgType === 'image/jpg' &&  this.previewFile(this.img, 'image/jpg',this.fileNameFromDb)
      this.imgType === 'image/jpeg' &&  this.previewFile(this.img, 'image/jpeg',this.fileNameFromDb)
      this.imgType === 'application/pdf' &&  this.previewFile(this.img, 'application/pdf',this.fileNameFromDb)
    }
    
  }
  previewFile(b64: string, contentType?: string, fileName?: string,): void {

    if (b64) {
      this.filePreiewContent = b64;
      this.filePreiewContentType = contentType
      this.isVisible = true;
      this.fileNameFromDb = fileName;

    }
  }
}

// convertImage(url) {
//   var img = new Image();
//   img.src = url
//   return img.src

// }





// }



