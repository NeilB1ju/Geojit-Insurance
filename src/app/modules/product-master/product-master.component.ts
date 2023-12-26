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
import { ValidationService } from 'shared';
import { NzModalService } from 'ng-zorro-antd';


export interface ProductMasterForm {
  InsuranceCompany: string;
  ProductCode: String;
  ProductName: String;
  ProductDescription: String;
  ProductCategory: string;
  ProductId: Number;
  InsCompanyId: any;
  FromLimit: Number;
  ToLimit: Number;
  Percentage: Number;
  CategoryID: Number;
  FromDate: Date;
  ToDate: Date;
  isActive: boolean;
  reason: string;
  wsProductCode:string;
}

@Component({
  templateUrl: './product-master.component.html',
  styleUrls: ['./product-master.component.less'],
  selector: 'nz-demo-select-basic',


  // animations: [bounceInOutAnimation]
})

export class ProductMaster implements OnInit {


  insCompList: Array<any> = [];
  pdtCatList: Array<any> = [];
  slabDetails: Array<any> = [];
  CommStructureDet: Array<any> = [];
  EmployeeFindopt: FindOptions;
  locationFindopt: FindOptions;
  ismodifystate: boolean;
  slabEditIdx: number;
  editHighLight: boolean;
  formHandlerRight: boolean = false;
  inputMasks = InputMasks;
  commStructHtml;
  slabMsg;
  FormControlNames: {} = {};


  model: ProductMasterForm;
  @ViewChild(LookUpDialogComponent, { static: false }) lookupsearch: LookUpDialogComponent;
  @ViewChild(FormHandlerComponent, { static: true }) formHandler: FormHandlerComponent;


  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  dateFormat = 'dd/MM/yyyy';
  isSpinning: boolean =false;
  modifyform: boolean =true;
  bajaj: any=[];
  icici: any=[];


  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private modalService: NzModalService,
    private validServ: ValidationService,
    private notification: NzNotificationService
  ) {
    this.model = <ProductMasterForm>{

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
  }

  ngOnInit() {
    this.getPendingProduct();
    this.formHandler.config.showModifyBtn = false;
    this.model.InsuranceCompany = '';
    this.model.ProductCode = '';
    this.model.ProductName = ''
    this.model.ProductDescription = '';
    this.model.ProductCategory = '';
    this.model.InsCompanyId = null;
    this.model.CategoryID = null;
    this.getInsuranceCompany();
    // this.getProductCategory();
    this.formHandler.config.isModifyState = false;
    this.formHandler.setFormType('default');
    this.formHandler.config.showDeleteBtn = false;
    this.formHandlerRight = true
    // this.dataServ.modifyright;
    this.slabDetails = [];
    this.CommStructureDet = [];
    this.ismodifystate = false;
    this.Clearrow();
    this.model.FromDate = new Date();
    this.model.ToDate = new Date();
    this.model.isActive = true;
    this.commStructHtml = '';
    this.slabMsg = '';
    this.model.reason = '';
    this.model.wsProductCode=''
    // this.getProductCategory();

  }
  Reset() {
    this.ngOnInit();

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
        // this.model.InsCompanyId = this.insCompList[1];
        this.getProductCategory();
      } else {

      }
    });
  }
  getProductCategory() {
    debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 18,
          // WhereClause: "c.InsCompanyID="+this.model.InsCompanyId+""
          WhereClause: this.model.InsCompanyId==0?"c.InsCompanyID=InsCompanyID":"c.InsCompanyID="+this.model.InsCompanyId+""
        }],
      "requestId": "4"
    }).then((response) => {debugger

      let res;
      if (response && response[0]) {
        this.pdtCatList = this.utilServ.convertToObject(response[0]);
      } else {

      }
    });
  }


  Save(form) {

    let isValid = this.validServ.validateForm(form, this.FormControlNames);
    if (!isValid)
      return;

    let slabData = this.slabDetails.map((o, i) => { return { FromDate: moment(o.FromDate).format(AppConfig.dateFormat.apiMoment), ToDate: moment(o.ToDate).format(AppConfig.dateFormat.apiMoment), FromLimit: o.FromLimit, ToLimit: o.ToLimit, Percentage: o.Percentage, SlNo: i + 1 }; });
    var JSONData = this.utilServ.setJSONArray(slabData);
    var xmlData = jsonxml(JSONData);
this.isSpinning=true
    this.dataServ.getResultArray({
      "FileImport": "false",
      "batchStatus": "false",
      "detailArray": [{
        IorU: this.formHandler.config.isModifyState ? "U" : "I",
        ProductId: this.formHandler.config.isModifyState ? this.model.ProductId : 0,
        InsCompanyID: this.model.InsCompanyId,
        ProductCode: this.model.ProductCode,
        ProductName: this.model.ProductName,
        Description: this.model.ProductDescription,
        CategoryID: this.model.CategoryID,
        XMLString: xmlData,
        Euser: this.currentUser.userCode,
        active: this.model.isActive ? 'Y' : 'N',
        reason: this.model.isActive ? '' : this.model.reason,
        WSProductCode:this.model.wsProductCode?this.model.wsProductCode:''
      }],
      "requestId": "18",
    }).then((response) => {
      this.isSpinning=false

      if (response && response.errorMsg) {
        this.notification.error('error', response.errorMsg);
        return;
      }
      if (response && response.results) {
        if (this.formHandler.config.isModifyState == true) {
          this.notification.success('Data updated successfully', 'success');
        } else {
          this.notification.success('Data saved successfully', 'success');
          this.formHandler.config.isModifyState = true;
          this.modalService.confirm({
            nzTitle: '<i>Reminder</i>',
            nzContent: '<b>Please tag commission in commission structure module for the product ' + this.model.ProductName + '</b>',
            // nzOnOk: () => this.onDelete.emit()
          });
        }
      }
    })
      .catch(function (error) {
      });

      this.getPendingProduct()
  }
  Search() {
    let reqParams;
    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 1000, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }
    this.lookupsearch.actionOpen(reqParams, 'Product');
  }
  onLookupSelect(data) {
 
    this.model.CategoryID = data.CategoryID
    this.model.ProductId = data.ProductId
    this.model.InsCompanyId = data.InsCompanyID;
    this.model.ProductCode = data.ProductCode;
    this.model.ProductName = data.ProductName;
    this.model.ProductDescription = data.Description;
    this.model.ProductCategory = data.CategoryID;
    this.model.wsProductCode=data.WSProductCode
     
    if (this.formHandlerRight == true) {
      this.formHandler.config.isModifyState = true;
    }
    else {
      this.formHandler.config.isModifyState = false;
      this.formHandler.config.showSaveBtn = false;
      return;
    }
    this.model.isActive = data.Active == 'Y' ? true : false;
    this.model.reason = data.Reason;

   
    this.retrieveCommStructureDetails();
    this.modifyform=false
    this.formHandler.config.showModifyBtn = true;
    this.formHandler.config.isModifyState = false;
      this.formHandler.config.showSaveBtn = false;
    
  }

  retrieveCommStructureDetails() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ProductId: this.model.ProductId,
          InsCompanyID: this.model.InsCompanyId
        }],
      "requestId": "29",
    }).then((response) => {
      let resArr;
      this.commStructHtml = '';
      this.slabMsg = '';
      if (response.results && response.results.length) {
        resArr = response.results[0];
        if (resArr.length > 2) {
          for (var i = 0; i < resArr.length; i++) {
            this.commStructHtml += resArr[i].HTMLContent;
          }
        } else {
          this.slabMsg = "Commission slab not tagged for the product - " + this.model.ProductDescription;
        }
      }
    })
  }

  Retrive() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          ProductId: this.model.ProductId,
          EUser: this.currentUser.userCode || '',

        }],
      "requestId": "19",
    }).then((response) => {
      if (response.results && response.results.length) {
        let result1 = response.results[0];
        let productdetails = result1[0];
        this.slabDetails = response.results[1];
        this.model.InsuranceCompany = productdetails.InsuranceCompany;
        this.model.ProductCode = productdetails.ProductCode;
        this.model.ProductName = productdetails.ProductName;
        this.model.ProductDescription = productdetails.Description;
        this.model.ProductCategory = productdetails.ProductCategory;
        this.model.isActive = productdetails.Active;
        this.model.reason = productdetails.Reason;
      }
    })
      .catch(function (error) {
      });
  }
  addSlabDetails() {
    if (!this.model.FromLimit) {
      this.notification.error('Please enter From Limit', 'error');
    }
    if (!this.model.ToLimit) {
      this.notification.error('Please enter From ToLimit', 'error');
    }
    if (!this.model.Percentage) {
      this.notification.error('Please enter From Percentage', 'error');
      return;
    }
    if (this.model.FromLimit > this.model.ToLimit) {
      this.notification.error('From Limit should be less than To Limit', 'error');
      return;
    }
    else {
      let slabData = { FromDate: this.model.FromDate, ToDate: this.model.ToDate, FromLimit: this.model.FromLimit, ToLimit: this.model.ToLimit, Percentage: this.model.Percentage }
      this.slabDetails = [...this.slabDetails, slabData];
      this.model.FromLimit = null;
      this.model.ToLimit = null;
      this.model.Percentage = null;
      this.model.FromDate = new Date();
      this.model.ToDate = new Date();
    }
  }
  Deleterow(i) {
    this.ismodifystate = false;
    this.slabDetails.splice(i, 1)
    this.slabDetails = [...this.slabDetails];
  }

  Clearrow() {
    this.ismodifystate = false;
    this.slabEditIdx = null;
    this.model.FromDate = new Date();
    this.model.ToDate = new Date();
    this.model.FromLimit = null;
    this.model.ToLimit = null;
    this.model.Percentage = null;
  }

  Editrow(data, i) {
    this.ismodifystate = true;
    this.slabEditIdx = i;
    this.model.FromDate = data.FromDate;
    this.model.ToDate = data.ToDate;
    this.model.FromLimit = data.FromLimit;
    this.model.ToLimit = data.ToLimit;
    this.model.Percentage = data.Percentage;
  }

  Updaterow() {
    let slabdata2 = { FromDate: this.model.FromDate, ToDate: this.model.ToDate, FromLimit: this.model.FromLimit, ToLimit: this.model.ToLimit, Percentage: this.model.Percentage }
    this.slabDetails.splice(this.slabEditIdx, 1, slabdata2);
    this.slabDetails = [...this.slabDetails];
    this.Clearrow();
  }

  modify()
  {
    this.modifyform=true
    this.formHandler.config.showModifyBtn = false;
  
    this.formHandler.config.isModifyState = true;
    this.formHandler.config.showSaveBtn = true;
    // this.isModifyState =true
  }
  getPendingProduct() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
         Euser:this.currentUser.userCode
        }],
      "requestId": "79"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.bajaj = this.utilServ.convertToObject(response[0]);
        this.icici = this.utilServ.convertToObject(response[1]);
       
       
      } else {

      }
    });
  }


}















