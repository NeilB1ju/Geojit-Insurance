import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { FindType } from "shared";
import { FindOptions } from "shared";
import { FormHandlerComponent } from 'shared';
import { debounce } from 'rxjs/operators';
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";
import * as FileSaver from 'file-saver';

export interface TreeNodeInterface {
  key: number;
  Id: number;
  State: string;
  FromDate: Date
  Todate: Date;
  TotalApplication: number
  expand: boolean;
  children?: TreeNodeInterface[];
}

export interface reconcilationreportForm {

  insCompany: any;
  state: any;
  region: any;
  location: any;
  fromDate: Date;
  toDate: Date;
  ReportType: string;
  sORd: string;
  exporttype: string;
  category: any;
  spCode: any;
  pdtCategory: any;
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
  templateUrl: './reconcilationreport.component.html',
  styleUrls: ['./reconcilationreport.component.less'],





})

export class reconcilationreportComponent implements OnInit {



  stateFindopt: FindOptions;
  regionFindopt: FindOptions;
  locationFindopt: FindOptions;
  productcategoryFindopt: FindOptions;
  SPFindopt: FindOptions;





  model: reconcilationreportForm;
  insCompList: Array<any> = [];
  brancharray: Array<any> = [];
  numericarray: Array<any> = [];
  treeData: Array<TreeNodeInterface> = [];
  mapOfExpandedData: any = {};
  isVisible: any;
  branchcode: any;
  columnArray = [];
  ZoneData: Array<any> = [];
  ZoneData1: Array<any> = [];
  ZoneDataHeader: Array<any> = [];
  StateData: Array<any> = [];
  RegionData: Array<any> = [];
  branchdetailData: Array<any> = [];
  branchdetailDataHeader: Array<any> = [];
  rpttype: Array<any> = [];
  ZoneDataHeader1: Array<any> = [];
  ZoneDataType: Array<any> = [];
  exporttypeList: Array<any> = [];
  stateData1: Array<any> = [];
  regionData1: Array<any> = [];
  branchData1: Array<any> = [];
  employeeData: Array<any> = [];
  Records: Array<any> = [];
  Columns: Array<any> = [];
  html;
  isSpinning = false;



  // @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;
  @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;


  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  dateFormat = 'dd/MM/yyyy';
  stateCodeValue: string;
  regionvalue: any;
  typeid: any;


  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilService: UtilService,
    private notification: NzNotificationService,
    private _DomSanitizationService: DomSanitizer,
    private modalService: NzModalService
  ) {
    this.model = <reconcilationreportForm>{


    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });


    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: 'State',
      codeLabel: 'State',
      descColumn: 'State',
      descLabel: 'State',
      title: 'State',
      hasDescInput: false,
      requestId: 2

    }
    this.regionFindopt = {
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      title: 'Region',
      hasDescInput: false,
      requestId: 2
    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title: 'Branch',
      hasDescInput: false,
      requestId: 2
    }
    this.productcategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: 'CategoryCode',
      codeLabel: 'CategoryCode',
      descColumn: 'CategoryName',
      descLabel: 'CategoryName',
      title: 'Product Category',
      hasDescInput: false,
      requestId: 2
    }
    this.SPFindopt = {
      findType: FindType.SPCODE,
      codeColumn: 'SpCode',
      codeLabel: 'SpCode',
      descColumn: 'SpCode',
      descLabel: 'SpCode',
      title: 'SP',
      hasDescInput: false,
      requestId: 2
    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title: 'Branch',
      hasDescInput: false,
      requestId: 2
    }
  }

  ngOnInit() {
    this.getInitData();
    this.getReporttype();
    this.getexportype();
    this.formHandler.setFormType('report');
    this.formHandler.config.showExportPdfBtn = false;
    this.formHandler.config.showExportExcelBtn = true;
    this.model.location = '';
    this.model.region = '';
    this.model.state = '';
    this.model.pdtCategory = '';
    this.model.spCode = '';
    this.model.category = '';
    let date = new Date();
    this.model.toDate = new Date();
    this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);

    this.model.sORd = 'S'


  }


  Reset() {
    this.ngOnInit();
    this.resetForm();
    // this.stateData=[];
  }
  getInitData() {
    //insurance company list
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
        this.insCompList = this.utilService.convertToObject(response[0]);
        this.model.insCompany = this.insCompList[1].Code;
        this.getcategory()
      } else {
        // this.notif.error = "No Data Found";
      }
    });
  }
  getexportype() {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 37
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.exporttypeList = this.utilService.convertToObject(response[0]);
        this.model.exporttype = this.exporttypeList[0].Code;
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
    
    this.treeData =[];
    this.StateData = [];
    this.ZoneData1 = [];
    this.ZoneDataType =[];
    if (this.model.fromDate > this.model.toDate) {
      this.notification.error("From date Should be Less than Todate", '');
      return;


    }
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyId: this.model.insCompany?this.model.insCompany :21,
          State: this.model.state ? this.model.state.State : '',
          Region: this.model.region ? this.model.region.RegionName : '',
          Location: this.model.location ? this.model.location.Location : '',
          FromDate: this.model.fromDate ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.model.toDate ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          Euser: this.currentUser.userCode,
          SorD: this.model.sORd ? this.model.sORd : '',
          ReportType: this.model.ReportType,
          ExportType: this.model.exporttype,
          SPCode: this.model.spCode ? this.model.spCode.SpCode : '',
          ProductCategory: this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : ''


        }],
      "requestId": "35",
      "outTblCount": "0"
    }).then((response) => {

     


      if (response && response[0] && response[0].rows.length > 0) {
        this.isSpinning = false;
        if(this.model.ReportType== 'Comm')
        {

          let companydata  = this.utilService.convertToObject(response[0]);
          let zoneData     = this.utilService.convertToObject(response[1]);
          let stateData    = this.utilService.convertToObject(response[2]);
          let regionData   = this.utilService.convertToObject(response[3]);
          let locationData = this.utilService.convertToObject(response[4]);
          let policyData   = this.utilService.convertToObject(response[5]);
          let data   = this.utilService.convertToObject(response[6]);
        // console.log(companydata)
        // console.log(zoneData)
        // console.log(stateData)
        // console.log(regionData)
        // console.log(locationData)
        // console.log(branchData)
        // console.log(policyData)

          
        data = data.map((o) => {
          o.key = "data_" + o.Id;
          return o;
         
        });


        policyData = policyData.map((branch) => {
          branch.key = "branch_" + branch.Id;
          branch.children = data.filter((policy) => {
            return policy.ParentId == branch.Id
          });
// zzzzzzz
          //  console.log(region)
          return branch;
        });


        locationData = locationData.map((locdata) => {
          locdata.key = "location_" + locdata.Id;
          locdata.children = policyData.filter((loc) => {
            return loc.ParentId == locdata.Id
          });
// zzzzzzz
          //  console.log(region)
          return locdata;
        });





        // locationData = locationData.map((o) => {
        //   o.key = "location_" + o.Id;
        //   return o;
         
        // });

        // regionData = regionData.map((o) => {
        //     o.key = "region_" + o.Id;
        //     return o;
           
        //   });
          // console.log(regionData)



          regionData = regionData.map((regdata) => {
            regdata.key = "region_" + regdata.Id;
            regdata.children = locationData.filter((locdata) => {
              return locdata.ParentId == regdata.Id
            });
// zzzzzzz
            //  console.log(region)
            return regdata;
          });



          stateData = stateData.map((state) => {
            state.key = "state_" + state.Id;
            state.children = regionData.filter((reg) => {
              return reg.ParentId == state.Id
            });
// zzzzzzz
            //  console.log(region)
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
         
         let a=JSON.stringify(companydata)
          this.treeData=JSON.parse(a)
          console.log(  this.treeData)
        
      
  



          

        }else
        {


        if (this.model.sORd == 'S') {
          if (this.model.exporttype == 'StateWise') {

            this.stateData1 = this.utilService.convertToResultArray(response[0]);


          }
          if (this.model.exporttype == 'RegionWise') {
            this.regionData1 = this.utilService.convertToResultArray(response[0]);

          }
          if (this.model.exporttype == 'LocationWise') {
            this.branchData1 = this.utilService.convertToResultArray(response[0]);


          }
          if (this.model.exporttype == 'EmployeeWise') {
            this.employeeData = this.utilService.convertToResultArray(response[0]);


          }

          // this.ZoneData = this.utilServ.convertToObject(response[0]);
          // this.ZoneDataHeader = Object.keys(this.ZoneData[0]);

          let zoneData = this.utilService.convertToObject(response[0]);
          let stateData = this.utilService.convertToObject(response[1]);
          let regionData = this.utilService.convertToObject(response[2]);
          let branchData = this.utilService.convertToObject(response[3]);
          if (stateData == []) {
            this.isSpinning = false;
            this.notification.error('No data found', '')
            this.StateData = [];
            this.ZoneData1 = [];
            return;
          }
          branchData = branchData.map((o) => {
            o.key = "branch_" + o.Id;
            return o;
          });
          regionData = regionData.map((region) => {
            region.key = "region_" + region.Id;
            region.children = branchData.filter((branch) => {
              return branch.ParentId == region.Id
            });
            return region;
          });
          stateData = stateData.map((state) => {
            state.key = "state_" + state.Id;
            state.children = regionData.filter((region) => {
              return region.ParentId == state.Id
            });
            return state;
          });
          zoneData = zoneData.map((zone) => {
            zone.ParentId = 0;
            zone.key = "zone_" + zone.Id;
            zone.children = stateData.filter((state) => {
              return state.ParentId == zone.Id
            });
            return zone;
          });

          zoneData.forEach(item => {
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
          });

          this.treeData = [...zoneData];
        }

        if (this.model.sORd == 'D') {
          this.columnArray = [];
          this.ZoneDataType = response[0].metadata.columnsTypes;

          this.ZoneData1 = this.utilService.convertToResultArray(response[0]);
          this.ZoneDataHeader1 = Object.keys(this.ZoneData1[0]);
          for (var i = 0; i < this.ZoneDataType.length; i++) {
            if (this.ZoneDataType[i] == "numeric") {
              this.columnArray.push(this.ZoneDataType);
            }
          }

        }

      }

    }
      else if (response.errorMsg) {
        this.notification.error(response.errorMsg, '');
      }
      
      else {
        this.isSpinning = false;
        this.notification.error("No Data Found", '');
        this.StateData = [];
        this.ZoneData1 = [];
        return;
      }

    })

  }

  setClickStyle(data) {
    if (data.key.startsWith("branch_")) {
      return true;
    } else {
      return false;
    }
  }


  setClickStyleComm(data) {
    if (data.key.startsWith("data_")) {
      return true;
    } else {
      return false;
    }
  }

  showmodal(data)
  {
    if (data.key.startsWith("data_")) {

  this.createComponentModal(data)
      
    }else
    {
      return
    }

  }

  createComponentModal(data): void {

    const modal = this.modalService.create({
      nzTitle: 'Policy Details',
      nzContent: PolicyDetailsComponent,
      nzWidth: "80%",
      nzComponentParams:
      {
        "policyNo": data.NAME,
        "Euser": this.currentUser.userCode,
      },
      nzFooter: null
    });
  }

 
  setStyles(head) {
    if (this.numericarray.indexOf(head) >= 0) {
      return true;

    }
    else {
      return false;
    }

  }

  setStyle(head) {
    if (this.columnArray.indexOf(head) >= 0) {
      return true;

    }
    else {
      return false;
    }

  }


  previewBranchDetails(data) {

    this.isSpinning = true;
    let val;

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyId: this.model.insCompany,
          State: this.model.state ? this.model.state.State : '',
          Region: this.model.region ? this.model.region.RegionName : '',
          Location: data.LocationCode,
          FromDate: this.model.fromDate ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.model.toDate ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          Euser: this.currentUser.userCode,
          Reporttype: this.model.ReportType,
          SPcode: this.model.spCode ? this.model.spCode.SpCode : '',


        }],
      "requestId": "38",
      "outTblCount": "0"
    }).then((response) => {


      if (response && response[0] && response[0].rows.length > 0) {
        this.isSpinning = false;
        this.branchdetailData = this.utilService.convertToObject(response[0]);
        this.branchdetailDataHeader = Object.keys(this.branchdetailData[0]);
        for (let i = 0; i < this.branchdetailData.length; i++) {
          if (this.branchdetailData[i].Inward == true) {
            this.branchdetailData[i].Inward = 'Y';

          }
          else {
            this.branchdetailData[i].Inward = 'N';
          }
          if (this.branchdetailData[i].Login == true) {
            this.branchdetailData[i].Login = 'Y';

          }
          else {
            this.branchdetailData[i].Login = 'N';
          }
          if (this.branchdetailData[i].IssuancePending == true) {
            this.branchdetailData[i].IssuancePending = 'Y';

          }
          else {
            this.branchdetailData[i].IssuancePending = 'N';
          }
          if (this.branchdetailData[i].IssuanceRejected == true) {
            this.branchdetailData[i].IssuanceRejected = 'Y';

          }
          else {
            this.branchdetailData[i].IssuanceRejected = 'N';
          }
          if (this.branchdetailData[i].Issued == true) {
            this.branchdetailData[i].Issued = 'Y';

          }
          else {
            this.branchdetailData[i].Issued = 'N';
          }
          // if (this.branchdetailData[i].CommissionRecieved == true) {
          //   this.branchdetailData[i].CommissionRecieved = 'Y';

          // }
          // else {
          //   this.branchdetailData[i].CommissionRecieved = 'N';
          // }

        }


        this.brancharray = response[0].metadata.columnsTypes;

        for (var i = 0; i < this.brancharray.length; i++) {
          if (this.brancharray[i] == "numeric") {
            this.numericarray.push(this.branchdetailDataHeader[i]);
          }
        }


        this.isVisible = true;

      }
      else {
        this.notification.error("No Data Found", '');
        this.isSpinning = false;


        return;
      }
    })

  }

  showPolicyDashboard(data, head): void {
    if (head == 'PolicyNo' && this.model.ReportType == 'IssuanceOnly' || this.model.ReportType == 'IssuanceAvailableandLoginMissing') {


      const modal = this.modalService.create({
        nzTitle: 'Policy Details',
        nzContent: PolicyDetailsComponent,
        nzWidth: "80%",
        nzComponentParams:
        {
          "policyNo": data.PolicyNo,
          "Euser": this.currentUser.userCode,
        },
        nzFooter: null
      });

    }
  }

  resetForm() {
    this.model.state = '';
    this.model.region = '';
    this.model.location = '';
    this.model.pdtCategory = '';
    this.model.spCode = '';
    this.model.category = '';
    this.ZoneData = [];
    this.ZoneData1 = [];
    this.ZoneDataHeader = [];
    this.StateData = [];
    this.RegionData = [];
    let date = new Date();
    this.model.toDate = new Date();
    this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.sORd = 'S'
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.employeeData = [];
    this.ngOnInit();
  }

  find() {

  }
  showModal(data): void {

    if (data.key.startsWith("branch_")) {

      this.previewBranchDetails(data);
      this.branchcode = data.Name;
    }
  }

  handleOk(): void {

    this.isVisible = false;
  }

  handleCancel(): void {

    this.isVisible = false;
  }
  // createComponentModal(): void {

  //   const modal = this.modalService.create({
  //     nzTitle: 'Reconciliation Report',
  //     // nzContent: PolicyDetailsComponent,
  //     nzWidth: "80%",
  //     nzComponentParams:
  //     {
  //       //  "policyNo" :data.Policy_Number,
  //       //  "Euser" : this.currentUser.userCode,
  //     },

  //   });
  // }
  getReporttype() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 35
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.rpttype = this.utilService.convertToObject(response[0]);
        // for (let i = 0; i < this.rpttype.length; i++) {
        //   if (this.rpttype[i].Code == 'IssuanceOnly') {
        //     this.rptflag = true;
        //   }
        //   else {
        //     this.rptflag = false;
        //   }


        // }
        this.model.ReportType = this.rpttype[0].Code;

      } else {

      }
    });
  }
  changeType() {
    this.ZoneData1 = [];
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.employeeData = [];
  }
  onchangeRpttype() {
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.employeeData = [];
    this.ZoneData = [];
    this.ZoneData1 = [];
    this.ZoneDataHeader = [];
  }
  exportData() {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
       InsCompanyId: this.model.insCompany?this.model.insCompany :21,
          State: this.model.state ? this.model.state.State : '',
          Region: this.model.region ? this.model.region.RegionName : '',
          Location: this.model.location ? this.model.location.Location : '',
          FromDate: this.model.fromDate ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
          ToDate: this.model.toDate ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) : '',
          Euser: this.currentUser.userCode,
          SorD: this.model.sORd ? this.model.sORd : '',
          ReportType: this.model.ReportType,
          ExportType: this.model.exporttype,
          SPCode: this.model.spCode ? this.model.spCode.SpCode : '',
          ProductCategory: this.model.pdtCategory ? this.model.pdtCategory.CategoryCode : ''
        }],
      "requestId": "35"
    }).then((response) => {debugger

      let res;
      if (response && response[0]) {
        this.Records = this.utilService.convertToResultArray(response[0]);
        this.Columns = response[0].metadata.columns;
        if (this.model.sORd =='S') {
          this.notification.error('No Data Found', '');
          return;
        }

        if (this.model.exporttype == 'StateWise') {
          this.Excel(this.Columns, this.Records, this.stateData1);
        }

        if (this.model.exporttype == 'RegionWise') {
          this.Excel(this.Columns, this.Records, this.regionData1);
        }
        if (this.model.exporttype == 'LocationWise') {
          this.Excel(this.Columns, this.Records, this.branchData1);
        }
        if (this.model.exporttype == 'EmployeeWise' && this.model.sORd == 'S') {
          this.Excel(this.Columns, this.Records, this.employeeData);
        }
        if (this.model.sORd == 'D') {
          this.Excel(this.Columns, this.Records, this.ZoneData1);
        }
        this.notification.success("Success", '')
      } else {
        this.notification.error("No Data Found", '');
      }
    });
  }

  //export to excel
  Excel(colums, data, filename) {
    let tableHeader;
    this.html = "<table><tr>";
    tableHeader = colums;
    for (let i = 0; i < tableHeader.length; i++) {
      this.html = this.html + "<th>" + tableHeader[i] + "</th>";
    }
    this.html = this.html + "</tr><tr>";
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < tableHeader.length; j++) {
        this.html = this.html + "<td>" + data[i][tableHeader[j]] + "</td>";
      }
      this.html = this.html + "<tr>";
    }
    this.html = this.html + "</tr><table>";

    let blob = new Blob([this.html], {
      type: "application/vnd.ms-excel;charset=charset=utf-8"
    });
    FileSaver.saveAs(blob, "Reconciliation Report.xls");
    this.isProcessing = false;
    // let blob = new Blob([document.getElementById('clientassetrpt').innerHTML], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    //     });
    //  FileSaver.saveAs(blob, "ClientAssetReport.xls");
  }

  reset_tabledata()
  {
   
    
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.employeeData = [];
    this.ZoneData = [];
    this.ZoneData1 = [];
    this.ZoneDataHeader = [];
    
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

    this.regionFindopt = {
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      hasDescInput: false,
      requestId: 2,
      whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
    }
this.model.location=null;
this.model.region=null;
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
  this.model.location=null;
  this.reset_tabledata()
}

getcategory()
{debugger
  this.model.pdtCategory=null
  // this.model.Product=null
  this.typeid=0
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
         companyid: this.model.insCompany? this.model.insCompany:0,
         Euser:this.currentUser.userCode
        }],
      "requestId": "94"
    }).then((response) => {
      let res;
      if (response && response[0]) {debugger
        let data = this.utilService.convertToObject(response[0]);
        this.typeid = data[0].id;

        // console.log(this.typeid)

        this.productcategoryFindopt = {
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
}














