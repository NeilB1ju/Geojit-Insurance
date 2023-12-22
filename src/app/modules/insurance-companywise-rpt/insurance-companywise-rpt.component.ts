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
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";
import { User } from 'shared/lib/models/user';
import { InputMasks } from 'shared';

export interface InsurCompanywseReportForm {
  tranDate: Date;
  insCompany: string;
  state: any;
  Region: any;
  Location: any;
  Employee: any;
  Product: any;
  Policy: string;
  fd: Date;
  td: Date;
  insurancecompany: string;
  ReportType: string;
  sp: any;
  ProductCategory: any;
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
  selector: 'app-insurance-companywise-rpt',
  templateUrl: './insurance-companywise-rpt.component.html',
  styleUrls: ['./insurance-companywise-rpt.component.less']
})
export class InsuranceCompanywiseRptComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  insCompList: Array<any> = [];
  currentUser: User;
  model: InsurCompanywseReportForm;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  ProductFindopt: FindOptions;
  ProductCategoryFindopt: FindOptions;

  SpFindopt: FindOptions;
  location: any;
  inputMasks = InputMasks;
  rpttype: Array<any> = [];
  gridData: Array<any> = [];
  gridColumns: Array<any> = [];
  treeData: Array<TreeNodeInterface> = [];
  mapOfExpandedData: any = {};
  ProductdetailData: Array<any> = [];
  ProductdetailDataHeader: Array<any> = [];
  columnArray = [];
  numericarray = [];
  brancharray = [];
  isVisible = false;
  title = '';
  isSpinning = false;
  treeviewData: any[];
  stateCodeValue: any;
  regionvalue: any;
  typeid: any;
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService

  ) {
    this.model = <InsurCompanywseReportForm>{
      tranDate: new Date()

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );
    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: 'State',
      codeLabel: 'SateCode',
      descColumn: 'State',
      descLabel: 'State',
      title: 'State',
      hasDescInput: false,
      requestId: 2

    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title: 'Location',
      hasDescInput: false,
      requestId: 2

    }
    this.RegionFindopt = { 
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      title: 'Region',
      hasDescInput: false,
      requestId: 2

    }
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'Code',
      codeLabel: 'EmployeeCode',
      descColumn: 'Name',
      descLabel: 'Employee',
      title: 'Employee',
      hasDescInput: false,
      requestId: 2

    }
    this.ProductFindopt = {
      findType: FindType.Product,
      codeColumn: 'ProductCode',
      codeLabel: 'ProductCode',
      descColumn: 'ProductName',
      descLabel: 'Product',

      requestId: 2

    }
    this.ProductCategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: 'CategoryCode',
      codeLabel: 'CategoryCode',
      descColumn: 'CategoryName',
      descLabel: 'CategoryName',
      requestId: 2

    }
    this.SpFindopt = {
      findType: FindType.SPCODE,
      codeColumn: 'SpCode',
      codeLabel: 'SpCode',
      descColumn: 'SpCode',
      descLabel: 'SpCode',
      hasDescInput: false,
      requestId: 2

    }
  }

  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn =false
    this.formHdlr.config.showExportPdfBtn=false
    this.gridData = [];
    this.gridColumns = [];
    this.getInsCompany();
    this.getReporttype();
    let date = new Date();
    this.model.td = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
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

this.getcategory()
      } else {

      }
    });
  }

  getReporttype() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 40
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.rpttype = this.utilServ.convertToObject(response[0]);
        this.model.ReportType = this.rpttype[0].Code;
      } else {

      }
    });
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  preview() {
    
    this.isSpinning = true;

    let val;
    if (this.model.fd > this.model.td) {
      this.notification.error("From date Should be Less than Todate", '');
      return;
    }
    // if (this.model.ReportType == 'Inward') {
    //   this.getInward();
    // }
    else {


      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            "Reporttype": this.model.ReportType ? this.model.ReportType : '',
            "SorD": 'S',
            "Regioncode": this.model.Region ? this.model.Region.Region : '',
            "Employeeid": this.model.Employee ? this.model.Employee.EmployeeID : '',
            "Productcode": this.model.Product ? this.model.Product.ProductCode : '',
            "Statecode": this.model.state ? this.model.state.State : '',
            "locationcode": this.model.Location ? this.model.Location.Location : '',
            "PolicyNo": this.model.Policy ? this.model.Policy : '',
            "From": moment(this.model.fd).format(AppConfig.dateFormat.apiMoment),
            "To": moment(this.model.td).format(AppConfig.dateFormat.apiMoment),
            "InscompanyID": this.model.insurancecompany ? this.model.insurancecompany : '',
            "Euser": this.currentUser.userCode,
            "Loctype": '',
            "ProductCategory": this.model.ProductCategory ? this.model.ProductCategory.CategoryCode : '',
            "SpCode": this.model.sp ? this.model.sp : ''


          }],
        "requestId": "41",
        "outTblCount": "0"
      }).then((response) => {
        

        this.isSpinning = false;
        if (response && response[0] && response[0].rows.length > 0) {

          if (this.model.ReportType == 'Comm') {


            let companydata = this.utilServ.convertToObject(response[0]);
            let zoneData = this.utilServ.convertToObject(response[1]);
            let stateData = this.utilServ.convertToObject(response[2]);
            let regionData = this.utilServ.convertToObject(response[3]);
            let locationData = this.utilServ.convertToObject(response[4]);

            locationData = locationData.map((o) => {
              o.key = "location_" + o.Id;
              return o;

            });

            regionData = regionData.map((regdata) => {
              regdata.key = "region_" + regdata.Id;
              regdata.children = locationData.filter((locdata) => {
                return locdata.ParentId == regdata.Id
              });

              return regdata;
            });

            stateData = stateData.map((state) => {
              state.key = "state_" + state.Id;
              state.children = regionData.filter((reg) => {
                return reg.ParentId == state.Id
              });

              return state;
            });
            zoneData = zoneData.map((zone) => {
              zone.key = "zone_" + zone.Id;
              zone.children = stateData.filter((sta) => {
                return sta.ParentId == zone.Id
              });
              return zone;
            });
            companydata = companydata.map((company) => {
              company.ParentId = 0;
              company.key = "company_" + company.Id;
              company.children = zoneData.filter((zon) => {
                return zon.ParentId == company.Id
              });
              return company;
            });
            companydata.forEach(item => {
              
              this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
            });
            console.log(this.mapOfExpandedData)
            let a = JSON.stringify(companydata)
            this.treeData = JSON.parse(a)
           






          }

          else {
            let InsComData = this.utilServ.convertToObject(response[0]);
            let ProductCatgoryData = this.utilServ.convertToObject(response[1]);
            let ProductData = this.utilServ.convertToObject(response[2]);

            ProductData = ProductData.map((o) => {
              o.key = "branch_" + o.Id;

              o.Name = o.Name + " - " + o.ProductDesc;
              return o;
            });
            ProductCatgoryData = ProductCatgoryData.map((region) => {
              region.key = "region_" + region.Id;
              region.children = ProductData.filter((branch) => {
                return branch.ParentId == region.Id
              });
              return region;
            });
            InsComData = InsComData.map((state) => {
              state.key = "state_" + state.Id;
              state.children = ProductCatgoryData.filter((region) => {
                return region.ParentId == state.Id
              });
              return state;
            });


            InsComData.forEach(item => {
              this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
            });

            this.treeData = [...InsComData];

            
          }
        }

        else {
          this.isSpinning = false;
          this.notification.error("No Data Found", '');
          this.ProductdetailData = [];
          this.treeData = [];
        }
      })
    }

  }

  previewProductDetails(data) {

    this.isSpinning = true;

    let val;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "Reporttype": this.model.ReportType ? this.model.ReportType : '',
          "SorD": 'S',
          "Regioncode": this.model.Region ? this.model.Region.Region : '',
          "Employeeid": this.model.Employee ? this.model.Employee.EmployeeID : '',
          "Productcode": data.ProductCode,
          "Statecode": this.model.state ? this.model.state.State : '',
          "locationcode": this.model.Location ? this.model.Location.Location : '',
          "PolicyNo": this.model.Policy ? this.model.Policy : '',
          "From": moment(this.model.fd).format(AppConfig.dateFormat.apiMoment),
          "To": moment(this.model.td).format(AppConfig.dateFormat.apiMoment),
          "InscompanyID": this.model.insurancecompany ? this.model.insurancecompany : '',
          "Euser": this.currentUser.userCode,
          "Loctype": '',
          "ProductCategory": this.model.ProductCategory ? this.model.ProductCategory.CategoryCode : '',
          "SpCode": this.model.sp ? this.model.sp : ''


        }],
      "requestId": "41",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning = false;
      if (response && response[3] && response[3].rows.length > 0) {

        this.ProductdetailData = this.utilServ.convertToObject(response[3]);
        this.ProductdetailDataHeader = Object.keys(this.ProductdetailData[0]);
        this.brancharray = response[3].metadata.columnsTypes;

        for (var i = 0; i < this.brancharray.length; i++) {
          if (this.brancharray[i] == "numeric") {
            this.numericarray.push(this.ProductdetailDataHeader[i]);
          }
        }

        this.isVisible = true;

      }
      else {
        this.isSpinning = false;
        this.notification.error("No Data Found", '');
        this.ProductdetailData = [];
        this.treeData = [];

        return;
      }
    })

  }
  showModal(data): void {

    if (data.key.startsWith("branch_")) {

      this.previewProductDetails(data);
      this.title = data.ProductCode + data.ProductDesc;

    }
  }
  showPolicyDashboard(data, head): void {

    if (head == 'Policy_No') {


      const modal = this.modalService.create({
        nzTitle: 'Policy Details',
        nzContent: PolicyDetailsComponent,
        nzWidth: "80%",
        nzComponentParams:
        {
          "policyNo": data.Policy_No,
          "Euser": this.currentUser.userCode,
        },
        nzFooter: null
      });

    }
  }

  setClickStyle(data) {
    if (data.key.startsWith("branch_")) {
      return true;
    } else {
      return false;
    }
  }
  setStyles(head) {
    if (this.numericarray.indexOf(head) >= 0) {
      return true;

    }
    else {
      return false;
    }

  }

  handleCancel(): void {

    this.isVisible = false;
  }
  resetForm() {
    this.model.state = '';
    this.model.Region = '';
    this.model.Location = '';
    this.model.Employee = '';
    this.model.Product = '';
    this.model.Policy = '';
    this.model.ProductCategory = '';
    this.model.sp = '';
    let date = new Date();
    this.model.td = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.ngOnInit();
    this.treeData = [];
  }


  makenull() {
    this.treeData = [];
    this.treeviewData = [];
  }

  reset_tabledata()
  {
    this.treeData = [];
    this.ProductdetailData = [];
    
   
    
  }
  sortstate(data)
{
  debugger
  if(data == null)
  {
    this.stateCodeValue =''

  }else
  {
    this.stateCodeValue =data.State
  }

  this.locationFindopt = {
    findType: FindType.Location,
    codeColumn: 'Location',
    codeLabel: 'LocationCode',
    descColumn: 'LocationName',
    descLabel: 'Location',
    hasDescInput: false,
    requestId: 2,
    whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
  }

    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      hasDescInput: false,
      requestId: 2,
      whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
    }
this.model.Location=null;
this.model.Region=null;
this.reset_tabledata()
}
onchange_reg(data)
{debugger
  if(data == null)
  {
    this.stateCodeValue =''

  }else
  {
    this.regionvalue =data.RegionName
  }

  this.locationFindopt = {
    findType: FindType.Location,
    codeColumn: 'Location',
    codeLabel: 'LocationCode',
    descColumn: 'LocationName',
    descLabel: 'Location',
    hasDescInput: false,
    requestId: 2,
    whereClause :this.regionvalue?"regionname ='" + this.regionvalue  + "'": ''
  }
  this.model.Location=null;
  this.reset_tabledata()
}

getcategory()
{debugger
  this.model.ProductCategory=null
  this.model.Product=null
  this.typeid=0
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
         companyid: this.model.insurancecompany? this.model.insurancecompany:0,
         Euser:this.currentUser.userCode
        }],
      "requestId": "94"
    }).then((response) => {
      let res;
      if (response && response[0]) {debugger
        let data = this.utilServ.convertToObject(response[0]);
        this.typeid = data[0].id;

        // console.log(this.typeid)

        this.ProductCategoryFindopt = {
          findType: FindType.ProductCategory,
          codeColumn: 'CategoryCode',
          codeLabel: 'CategoryCode',
          descColumn: 'CategoryName',
          descLabel: 'CategoryName',
          whereClause: this.typeid?"ProductTypeId = '"+this.typeid +"'":'1=1',
          hasDescInput: false,
          requestId: 2
        }


      } else {
        // this.notif.error = "No Data Found";
      }
    });

  
this.reset_tabledata()
}
getproduct()
{

this.model.Product=null

this.ProductFindopt = {
  findType: FindType.Product,
  codeColumn: 'ProductCode',
  codeLabel: 'ProductCode',
  descColumn: 'ProductName',
  descLabel: 'Product',
  whereClause: this.model.ProductCategory?"CategoryID = '"+this.model.ProductCategory.CategoryID +"'":'1=1',
  hasDescInput: false,
  requestId: 2

}

this.reset_tabledata()
}

}
