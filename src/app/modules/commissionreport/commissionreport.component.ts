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
import { PolicyDetailsComponent } from "../policy-details/policy-details.component";
import { User } from 'shared/lib/models/user';
import { InputMasks } from 'shared';


export interface commissionreportForm {
  insurancecompany: string;
  state: any;
  Region: any;
  Location: any;
  Employee: any;
  pdtCategory:any
  
  sORd:any;
  Product: any;
  Policy: string;
  fromDate: Date;
  toDate: Date;
  businessDoneby:any;
  type:String;
  category:String;
  sp:any;
  datetype:any;
  
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
  templateUrl: './commissionreport.component.html',
  styleUrls: ['./commissionreport.component.less']
})

export class commissionreportComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  ZoneData: Array<any> = [];
  companydata:Array<any> = [];
  insCompList: Array<any> = [];
  businessArr: Array<any> = [];
  policyrpt: Array<any> = [];
  rpttype: Array<any> = [];
  model: commissionreportForm;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  ProductFindopt: FindOptions;
  productcategoryFindopt:FindOptions;
  location: any;
  isVisible: any;
  branchcode: any;
  columnArray = [];
  numericarray = [];
  brancharray = [];
  currentUser: User;
  SpFindopt: FindOptions;
  treeData: Array<TreeNodeInterface> = [];
  mapOfExpandedData: any = {};
  mapOfExpandedData1: any = {};
  inputMasks = InputMasks;
  data: any=[];
  datetype: any;
  Records: any[];
  Columns: any;
  isSpinning: boolean =false;
  stateCodeValue: string;
  regionvalue: any;
  type: any[];
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService

  ) {
    this.model = <commissionreportForm>{
   
    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );

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
    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: 'State',
      codeLabel: 'State',
      descColumn: 'State',
      descLabel: 'State',
      hasDescInput: false,
      title:'State',
      requestId: 2,
    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      title:'LocationName',
      hasDescInput: false,

      requestId: 2,
    }
    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      hasDescInput: false,
      title:'RegionName',
      requestId: 2,
    }
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'Code',
      codeLabel: 'EmployeeCode',
      descColumn: 'Name',
      descLabel: 'Employee',
      hasDescInput: false,
      title: 'Employee',
      requestId: 2

    }
    this.ProductFindopt = {
      findType: FindType.Product,
      codeColumn: 'ProductCode',
      codeLabel: 'ProductCode',
      descColumn: 'ProductName',
      descLabel: 'Product',
      title:'ProductName',
      requestId: 2,
    }
    this.SpFindopt = {
      findType: FindType.SPCODE,
      codeColumn: 'SpCode',
      codeLabel: 'SpCode',
      descColumn: 'SpCode',
      descLabel: 'SpCode',
      title: 'SP',
      hasDescInput: false,
      requestId: 2

    }

    // this.location = {
    //   Location: 'test',
    //   LocationName: 'rrrrrrr'
    // }
  }

  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn =true
    this.formHdlr.config.showExportPdfBtn=false
    this.model.sORd = "S"
   
    let date = new Date();
    this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.toDate = new Date();
    
    this. getBusinessdone();
    this.getInsuerType();
   
    // this.model.datetype='T';
    this.getdatetype()

    // this.getReporttype();
    // this.rpttype = [{ Code: "Issuence", Description: "Issuance" }, { Code: "Commission", Description: "Commission" }, { Code: "Login", Description: "Login" }];
    // this.model.ReportType = this.rpttype[0].Code;
  }

  getdatetype() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 39
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this. datetype = this.utilServ.convertToObject(response[0]);
       this. model.datetype = this.datetype[0].Code;
      } else {

      }
    });
  }


  getInsuerType() {
    this.model.pdtCategory=null
    this.model.Product=null
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
  
        }],
      "requestId": "140"
    }).then((response) => {
      debugger
  
      let res;
      if (response && response[0]) {
        this.type = this.utilServ.convertToObject(response[0]);
        this.model.type = this.type[0].Id;
        this.getInsuranceCompany()
      } else {
  
      }
    });
   
  }
  getInsuranceCompany() { 

    this.model.pdtCategory=null;
    this.model.Product=null
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          InsuerType: this.model.type ? this.model.type :0
        }],
      "requestId": "139"
    }).then((response) => {
      debugger
  
      let res;
      if (response && response[0]) {debugger
        this.insCompList = this.utilServ.convertToObject(response[0]);
        this.model.insurancecompany = this.insCompList[0].Code;

        this.productcategoryFindopt = {
          findType: FindType.ProductCategory,
          codeColumn: 'CategoryCode',
          codeLabel: 'CategoryCode',
          descColumn: 'CategoryName',
          descLabel: 'CategoryName',
          whereClause: this.model.type?"ProductTypeId = '"+this.model.type +"'":'1=1',
          hasDescInput: false,
          requestId: 2
        }

      } else {
  
      }
    });

    this.reset_tabledata()
  }

  getBusinessdone() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 36
        }],
      "requestId": "4"
    }).then((response) => {

      let res;
      if (response && response[0]) {
        this.businessArr = this.utilServ.convertToObject(response[0]);
        this.model.businessDoneby = this.businessArr[0].Code;
      } else {

      }
    });
  }


    preview() {

      this.isSpinning = true;
      this.model.businessDoneby
      this.policyrpt=[];
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            //  ReportType:'Login',
           
            datetype:this.model.datetype,
            catagory:this.model.type,
           
             SpCode: this.model.sp ? this.model.sp.SpCode : '',
            
            
            SorD: this.model.sORd? this.model.sORd : '',
           
           
             InsCompanyID: this.model.insurancecompany,
             State: this.model.state ? this.model.state.StateCode : '',
            Region: this.model.Region ? this.model.Region.Region : '',
             Location: this.model.Location ? this.model.Location.Location : '',
           
           Fromdate: this.model.fromDate ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
            Todate: this.model.toDate ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) : '',
           Loctype:this.model.businessDoneby,
           
             PolicyNo: this.model.Policy ? this.model.Policy : '',
             Product: this.model.Product ? this.model.Product.ProductCode : '',
             Employee: this.model.Employee ? this.model.Employee.EmployeeID : '',
             Euser:this.currentUser.userCode ||'',
             pdtCategory:this.model.pdtCategory?this.model.pdtCategory.CategoryID:''

          }],
        "requestId": "51"
      }).then((response) => { 
        this.isSpinning = false;
        let res;
        if (response && response[0]) {

          let data=this.utilServ.convertToObject(response[0]);
          if(data.length ==0)
          {
            this.notification.error('No data found', '');
            return;
          }
          if(this.model.sORd =='D')
          {
          
          // this.branchdetailData = this.utilServ.convertToObject(response[0]);
          // this.branchdetailDataHeader = Object.keys(this.branchdetailData[0]);
          this.data = this.utilServ.convertToObject(response[0]);
          
          // console.log(this.data)
          this.policyrpt= Object.keys(this.data[0]);
          }
          else
          {


            let companydata = this.utilServ.convertToObject(response[0]);
            let zoneData = this.utilServ.convertToObject(response[1]);
            let stateData = this.utilServ.convertToObject(response[2]);
            let regionData = this.utilServ.convertToObject(response[3]);
            let locationData = this.utilServ.convertToObject(response[4]);
          // console.log(companydata)
          // console.log(zoneData)
          // console.log(stateData)
          // console.log(regionData)


          locationData = locationData.map((o) => {
            o.key = "location_" + o.Id;
            return o;
           
          });

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
            console.log(  this.mapOfExpandedData)
           let a=JSON.stringify(companydata)
            this.treeData=JSON.parse(a)
          
        
    
        
          }
          }
         else {
          // if(this.policyrpt.length==1){
          this.notification.error('No data found', '')
          // }
        }
      });
    }


    exportData() {
      this.policyrpt=[];
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            datetype:this.model.datetype,
            catagory:this.model.type,
           
             SpCode: this.model.sp ? this.model.sp.SpCode : '',
            
            
            SorD: this.model.sORd? this.model.sORd : '',
           
           
             InsCompanyID: this.model.insurancecompany,
             State: this.model.state ? this.model.state.StateCode : '',
            Region: this.model.Region ? this.model.Region.Region : '',
             Location: this.model.Location ? this.model.Location.Location : '',
           
           Fromdate: this.model.fromDate ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
            Todate: this.model.toDate ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) : '',
           Loctype:this.model.businessDoneby,
           
             PolicyNo: this.model.Policy ? this.model.Policy : '',
             Product: this.model.Product ? this.model.Product.ProductCode : '',
             Employee: this.model.Employee ? this.model.Employee.EmployeeID : '',
             Euser:this.currentUser.userCode ||''


          }],
        "requestId": "51"
      }).then((response) => {

        let res;
        if (response && response[0]) {
          this.Records = this.utilServ.convertToResultArray(response[0]);
          this.Columns = response[0].metadata.columns;
           this.utilServ.Excel(this.Columns, this.Records, '')

        } else {
          if(this.policyrpt.length==1){
          this.notification.error('No data found', '')
          }
        }
      });
    }
    reset() {
      // this.model.datetype='D'
      this.formHdlr.setFormType('report');
      this.formHdlr.config.showExportExcelBtn =true
      // this.getInsuranceCompany();
      // this.getReporttype();
      this.model.state = '';
      this.treeData=[];
      this.mapOfExpandedData=[];
      this.model.Region = '';
      this.model.Location = '';
      let date = new Date();
      this.model.fromDate =  new Date(date.getFullYear(), date.getMonth(), 1);
      this.model.toDate = new Date();
      this.model.Employee = '';
      this.model.Product = '';
      this.model.Policy = '';
      this.policyrpt=[];
      this.data=[];
     
      this.model.sp='';
      this. getBusinessdone();
    this.getInsuerType();

    }
 

  createComponentModal(data): void {

    const modal = this.modalService.create({
      nzTitle: 'Policy Details',
      nzContent: PolicyDetailsComponent,
      nzWidth: "80%",
      nzComponentParams:
      {
        "policyNo": data.ContractNumber,
        "Euser": this.currentUser.userCode,
      },
      nzFooter: null
    });
  }


//  }



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

setClickStyle(data) {
  if (data.key.startsWith("branch_")) {
    return true;
  } else {
    return false;
  }
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

showModal(data): void {

  if (data.key.startsWith("region_")) {

    // this.previewBranchDetails(data);
    
  }
}
reset_tabledata()
  {debugger
    this.model.Location
    this.treeData = [];

    this.policyrpt = [];
    this.data=[];
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

  getproduct()
{

  this.model.Product=null

  this.ProductFindopt = {
    findType: FindType.Product,
    codeColumn: 'ProductCode',
    codeLabel: 'ProductCode',
    descColumn: 'ProductName',
    descLabel: 'Product',
    whereClause: this.model.pdtCategory?"CategoryID = '"+this.model.pdtCategory.CategoryID +"'":'1=1',
    hasDescInput: false,
    requestId: 2

  }

  this.reset_tabledata()
}
}
