import {
  Component,
  OnInit,
  ViewChild,
  Pipe,
  PipeTransform,
} from "@angular/core";

import { NzNotificationService, NzModalService } from "ng-zorro-antd";
import * as moment from "moment";
import * as FileSaver from "file-saver";
import { UtilService, ValidationService } from "shared";
import { AuthService } from "shared";
import { DataService } from "shared";
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from "shared";
import { AppConfig } from "shared";
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";
import { User } from "shared/lib/models/user";
import { InputMasks } from "shared";
// import { modelGroupProvider } from "@angular/forms/src/directives/ng_model_group";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export interface CommonReportForm {
  InsurerType: any;
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
  sORd: string;
  ForB: string;
  exporttype: string;
  sp: any;
  ProductCategory: any;
  listOfSelectedValue: any;
  policystatus: any;
  PAN: any;
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
  name: "tableFilter",
})
export class TableFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    return items.filter((item) => {
      let flag = false;

      if (item[filter.key] && item[filter.key] == filter.value) flag = true;
      return flag;
    });
  }
}

@Component({
  templateUrl: "./common-reports.component.html",
  styleUrls: ["./common-reports.component.less"],
})
export class CommonReportsComponent implements OnInit {
  validateForm!: FormGroup;
  @ViewChild(FormHandlerComponent, { static: true })
  formHdlr: FormHandlerComponent;
  clientFormControlNames: {} = {};
  insCompList: Array<any> = [];
  ZoneData: Array<any> = [];
  ZoneData1: Array<any> = [];
  ZoneDataHeader: Array<any> = [];
  ZoneDataHeader1: Array<any> = [];
  ZoneDataType: Array<any> = [];
  branchdetailData: Array<any> = [];
  branchdetailDataHeader: Array<any> = [];
  StateData: Array<any> = [];
  RegionData: Array<any> = [];
  BranchData: Array<any> = [];
  rpttype: Array<any> = [];
  model: CommonReportForm;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  ProductFindopt: FindOptions;
  ProductCategoryFindopt: FindOptions;
  franchiseeFindopt: FindOptions;
  SpFindopt: FindOptions;
  PanFindopt: FindOptions;
  location: any;
  isVisible: any;
  branchcode: any;
  columnArray = [];
  numericarray = [];
  brancharray = [];
  head: boolean;
  currentUser: User;
  treeData: Array<TreeNodeInterface> = [];
  mapOfExpandedData: any = {};
  inputMasks = InputMasks;
  // InwardData: Array<any> = [];
  // InwardDataHeader: Array<any> = [];
  Records: Array<any> = [];
  Columns: Array<any> = [];
  html;
  isProcessing;
  businessArr: Array<any> = [];
  exporttypeList: Array<any> = [];

  stateData1: Array<any> = [];
  EmployeeData1: Array<any> = [];
  EmployeeData1header: Array<any> = [];
  regionData1: Array<any> = [];
  branchData1: Array<any> = [];
  stateData1header: Array<any> = [];
  regionData1header: Array<any> = [];
  branchData1header: Array<any> = [];
  isSpinning = false;
  policylist: any = [];
  stateCodeValue: string;
  regionvalue: any;
  Insuertype: any[];
  pendinglist: any = [];
  riderdata: any = [];
  riderdatatype: any;
  riderheader: string[];
  header: any[];
  isVisible1: boolean = false;
  panPattern: any[];
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private ValidServ: ValidationService
  ) {
    this.model = <CommonReportForm>{
      tranDate: new Date(),
    };
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: "State",
      codeLabel: "SateCode",
      descColumn: "State",
      descLabel: "State",
      title: "State",
      hasDescInput: false,
      requestId: 2,
    };
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      hasDescInput: false,
      title: "Location",
      requestId: 2,
      whereClause: "",
    };

    this.franchiseeFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      whereClause: "Branch='N' or Isnull(TempBranch,'N') ='Y'",
      title: "Franchisee",
      hasDescInput: false,
      requestId: 2,
    };
    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: "Region",
      codeLabel: "RegionCode",
      descColumn: "RegionName",
      descLabel: "Region",
      hasDescInput: false,
      title: "Region",
      requestId: 2,
      whereClause: "",
    };
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: "Code",
      codeLabel: "EmployeeCode",
      descColumn: "Name",
      descLabel: "Employee",
      hasDescInput: false,
      title: "Employee",
      requestId: 2,
    };
    this.ProductFindopt = {
      findType: FindType.Product,
      codeColumn: "ProductCode",
      codeLabel: "ProductCode",
      descColumn: "ProductName",
      descLabel: "Product",
      hasDescInput: false,
      requestId: 2,
    };
    this.ProductCategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: "CategoryCode",
      codeLabel: "CategoryCode",
      descColumn: "CategoryName",
      descLabel: "CategoryName",
      hasDescInput: false,
      requestId: 2,
    };
    this.SpFindopt = {
      findType: FindType.SPCODE,
      codeColumn: "SpCode",
      codeLabel: "SpCode",
      descColumn: "SpCode",
      descLabel: "SpCode",
      title: "SP",
      hasDescInput: false,
      requestId: 2,
    };

    // ,TradeCode,ClientFirstName,,PANNumber
    this.PanFindopt = {
      findType: FindType.Client,
      codeColumn: "PANNumber",
      codeLabel: "PANNumber",
      descColumn: "",
      descLabel: "",
      title: "",
      hasDescInput: false,
      requestId: 2,
    };
  }

  ngOnInit() {
    this.validatationForm();
    this.formHdlr.setFormType("report");
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showExportPdfBtn = false;
    let date = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.td = new Date();
    this.model.sORd = "S";
    this.getCommondata();
  }

  validatationForm() {
    // validation using reactiveformModules
    this.validateForm = this.fb.group({
      // first holder details
      PolicyNumber_Or_ApplicationNo: [
        null,
        [Validators.pattern("^[0-9a-zA-Z-/]*$")],
      ],
      Report_Type: [null],
      Insurer_Type: [null],
      Business_Done_By: [null],
      State: [null],
      Region: [null],
      Location: [null],
      Franchisee: [null],
      Insurance_Company: [null],
      Sp_Code: [null],
      Product_Category: [null],
      Export_Type: [null],
      From_Date: [null],
      To_Date: [null],
      Employee_Code: [null],
      PAN: [null],
      Policy_Status: [null],
      sORd: [null],
    });
  }

  getCommondata() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Euser: this.currentUser.userCode,
          },
        ],
        requestId: "138",
      })
      .then((response) => {
        if (response && response[0]) {
          // 0th and 1st result set
          let data = this.utilServ.convertToObject(response[1]);
          this.header = data[0].Header;
          this.columnArray = [];
          this.riderdatatype = response[0].metadata.columnsTypes;
          this.riderdata = this.utilServ.convertToObject(response[0]);
          if (this.riderdata.length) {
            this.riderheader = Object.keys(this.riderdata[0]);
            for (var i = 0; i < this.riderdatatype.length; i++) {
              if (this.riderdatatype[i] == "numeric") {
                this.columnArray.push(this.riderheader[i]);
              }
            }
          }
          if (this.riderdata.length) {
            this.isVisible1 = true;
          }

          // 2nd resultset
          this.rpttype = this.utilServ.convertToObject(response[2]);
          this.model.ReportType = this.rpttype[0].Code;

          // 3rd Resultset
          this.businessArr = this.utilServ.convertToObject(response[3]);
          this.model.ForB = this.businessArr[0].Code;

          // 4th resultset
          this.exporttypeList = this.utilServ.convertToObject(response[4]);
          this.model.exporttype = this.exporttypeList[0].Code;

          // 5th resultset
          this.Insuertype = this.utilServ.convertToObject(response[5]);
          this.model.InsurerType = this.Insuertype[0].Id;
          this.getInsuranceCompany();

          // 6th Resultset
          this.policylist = this.utilServ.convertToObject(response[6]);
          this.model.policystatus = this.policylist[0].Code;
        } else {
        }
      });
  }

  setClickStyle(data) {
    if (data.key.startsWith("branch_")) {
      return true;
    } else {
      return false;
    }
  }
  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean
  ): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach((d) => {
          const target = array.find((a) => a.key === d.key);
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
          stack.push({
            ...node.children[i],
            level: node.level + 1,
            expand: false,
            parent: node,
          });
        }
      }
    }
    return array;
  }
  visitNode(
    node: TreeNodeInterface,
    hashMap: object,
    array: TreeNodeInterface[]
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  preview() {
    let isValid = this.ValidServ.validateForm(
      this.validateForm,
      this.clientFormControlNames
    );
    if (isValid == false) {
      this.isSpinning = false;
      return;
    }
    let data = this.model.policystatus.toString();
    let val;
    if (this.model.fd > this.model.td) {
      this.notification.error("From date Should be Less than Todate", "");
      return;
    } else {
      this.isSpinning = true;
      this.dataServ
        .getResponse({
          batchStatus: "false",
          detailArray: [
            {
              Reporttype: this.model.ReportType ? this.model.ReportType : "",
              SorD: this.model.sORd ? this.model.sORd : "",
              Regioncode: this.model.Region ? this.model.Region.Region : "",
              // "Regioncode": 'Kerala',
              Employeeid: this.model.Employee
                ? this.model.Employee.EmployeeID
                : "",
              Productcode: this.model.Product
                ? this.model.Product.ProductCode
                : "",
              Statecode: this.model.state ? this.model.state.State : "",
              locationcode: this.model.Location
                ? this.model.Location.Location
                : "",
              PolicyNo: this.model.Policy ? this.model.Policy : "",
              From: moment(this.model.fd).format(
                AppConfig.dateFormat.apiMoment
              ),
              To: moment(this.model.td).format(AppConfig.dateFormat.apiMoment),
              InscompanyID: this.model.insurancecompany
                ? this.model.insurancecompany
                : "",
              Euser: this.currentUser.userCode,
              Loctype: this.model.ForB,
              ExportType: this.model.exporttype,
              ProductCategory: this.model.ProductCategory
                ? this.model.ProductCategory.CategoryCode
                : "",
              SpCode: this.model.sp ? this.model.sp.SpCode : "",
              PolicyStatus: this.model.policystatus ? data : "",
              InsurerType: this.model.InsurerType
                ? this.model.InsurerType
                : "ALL",
              Pan: this.model.PAN ? this.model.PAN.PANNumber : "",
              NewExpView: "VIEW",
            },
          ],
          requestId: "11",
          outTblCount: "0",
        })
        .then((response) => {
          debugger;

          if (response && response[0] && response[0].rows.length > 0) {
            this.isSpinning = false;
            if (this.model.sORd == "S") {
              if (this.model.exporttype == "StateWise") {
                this.stateData1 = this.utilServ.convertToResultArray(
                  response[0]
                );
                this.stateData1header = Object.keys(this.stateData1[0]);
                this.Columns = this.stateData1[0].metadata.columns;
              }
              if (this.model.exporttype == "RegionWise") {
                this.regionData1 = this.utilServ.convertToResultArray(
                  response[0]
                );
                this.regionData1header = Object.keys(this.regionData1[0]);
                this.Columns = this.regionData1[0].metadata.columns;
              }
              if (this.model.exporttype == "LocationWise") {
                this.branchData1 = this.utilServ.convertToResultArray(
                  response[0]
                );
                this.branchData1header = Object.keys(this.branchData1[0]);
                this.Columns = this.branchData1[0].metadata.columns;
              }
              if (this.model.exporttype == "EmployeeWise") {
                this.EmployeeData1 = this.utilServ.convertToResultArray(
                  response[0]
                );
                this.EmployeeData1header = Object.keys(this.EmployeeData1[0]);
                this.Columns = this.EmployeeData1[0].metadata.columns;
              }
              if (this.model.ReportType == "Login") {
                if (this.model.exporttype == "TreeView") {
                  let companydata = this.utilServ.convertToObject(response[0]);
                  let zoneData = this.utilServ.convertToObject(response[1]);
                  let stateData = this.utilServ.convertToObject(response[2]);
                  let regionData = this.utilServ.convertToObject(response[3]);
                  let locationData = this.utilServ.convertToObject(response[4]);
                  let policyData = this.utilServ.convertToObject(response[5]);
                  let data = this.utilServ.convertToObject(response[6]);

                  data = data.map((o) => {
                    o.key = "data_" + o.Id;
                    return o;
                  });

                  policyData = policyData.map((branch) => {
                    branch.key = "branch_" + branch.Id;
                    branch.children = data.filter((policy) => {
                      return policy.ParentId == branch.Id;
                    });
                    return branch;
                  });
                  locationData = locationData.map((locdata) => {
                    locdata.key = "location_" + locdata.Id;
                    locdata.children = policyData.filter((loc) => {
                      return loc.ParentId == locdata.Id;
                    });
                    return locdata;
                  });
                  regionData = regionData.map((regdata) => {
                    regdata.key = "region_" + regdata.Id;
                    regdata.children = locationData.filter((locdata) => {
                      return locdata.ParentId == regdata.Id;
                    });
                    return regdata;
                  });

                  stateData = stateData.map((state) => {
                    state.key = "state_" + state.Id;
                    state.children = regionData.filter((reg) => {
                      return reg.ParentId == state.Id;
                    });
                    return state;
                  });
                  zoneData = zoneData.map((zone) => {
                    zone.key = "zone_" + zone.Id;
                    zone.children = stateData.filter((sta) => {
                      return sta.ParentId == zone.Id;
                    });
                    return zone;
                  });
                  companydata = companydata.map((company) => {
                    company.ParentId = 0;
                    company.key = "company_" + company.Id;
                    company.children = zoneData.filter((zon) => {
                      return zon.ParentId == company.Id;
                    });
                    return company;
                  });
                  companydata.forEach((item) => {
                    this.mapOfExpandedData[item.key] =
                      this.convertTreeToList(item);
                  });

                  let a = JSON.stringify(companydata);
                  this.treeData = JSON.parse(a);
                }
              }
              if (
                this.model.ReportType == "Issuance" ||
                this.model.ReportType == "LogVsIssu"
              ) {
                if (this.model.exporttype == "TreeView") {
                  let companydata = this.utilServ.convertToObject(response[0]);
                  let zoneData = this.utilServ.convertToObject(response[1]);
                  let stateData = this.utilServ.convertToObject(response[2]);
                  let regionData = this.utilServ.convertToObject(response[3]);
                  let locationData = this.utilServ.convertToObject(response[4]);
                  let policyData = this.utilServ.convertToObject(response[5]);
                  let data = this.utilServ.convertToObject(response[6]);

                  data = data.map((o) => {
                    o.key = "data_" + o.Id;
                    return o;
                  });
                  policyData = policyData.map((branch) => {
                    branch.key = "branch_" + branch.Id;
                    branch.children = data.filter((policy) => {
                      return policy.ParentId == branch.Id;
                    });
                    return branch;
                  });
                  locationData = locationData.map((locdata) => {
                    locdata.key = "location_" + locdata.Id;
                    locdata.children = policyData.filter((loc) => {
                      return loc.ParentId == locdata.Id;
                    });

                    return locdata;
                  });
                  regionData = regionData.map((regdata) => {
                    regdata.key = "region_" + regdata.Id;
                    regdata.children = locationData.filter((locdata) => {
                      return locdata.ParentId == regdata.Id;
                    });
                    return regdata;
                  });
                  stateData = stateData.map((state) => {
                    state.key = "state_" + state.Id;
                    state.children = regionData.filter((reg) => {
                      return reg.ParentId == state.Id;
                    });
                    return state;
                  });
                  zoneData = zoneData.map((zone) => {
                    zone.key = "zone_" + zone.Id;
                    zone.children = stateData.filter((sta) => {
                      return sta.ParentId == zone.Id;
                    });
                    return zone;
                  });
                  companydata = companydata.map((company) => {
                    company.ParentId = 0;
                    company.key = "company_" + company.Id;
                    company.children = zoneData.filter((zon) => {
                      return zon.ParentId == company.Id;
                    });
                    return company;
                  });
                  companydata.forEach((item) => {
                    this.mapOfExpandedData[item.key] =
                      this.convertTreeToList(item);
                  });
                  let a = JSON.stringify(companydata);
                  this.treeData = JSON.parse(a);
                  console.log(this.treeData);
                }
              }
            }
          } else if (response.errorMsg) {
            this.isSpinning = false;
            this.notification.error(response.errorMsg, "");
          } else {
            this.isSpinning = false;
            this.notification.error("No data found", "");
            this.treeData = [];
          }
          if (this.model.sORd == "D") {
            this.columnArray = [];
            this.ZoneDataType = response[0].metadata.columnsTypes;

            this.ZoneData1 = this.utilServ.convertToObject(response[0]);
            this.ZoneDataHeader1 = Object.keys(this.ZoneData1[0]);
            for (var i = 0; i < this.ZoneDataType.length; i++) {
              if (this.ZoneDataType[i] == "numeric") {
                this.columnArray.push(this.ZoneDataHeader1[i]);
              }
            }
          }
        });
    }
  }
  setStyles(head) {
    if (this.numericarray.indexOf(head) >= 0) {
      return true;
    } else {
      return false;
    }
  }
  setStyle(head) {
    if (this.columnArray.indexOf(head) >= 0) {
      return true;
    } else {
      return false;
    }
  }
  previewBranchDetails(data) {
    this.isSpinning = true;
    let val;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Reporttype: this.model.ReportType ? this.model.ReportType : "",
            SorD: this.model.sORd == "S" ? "S" : "D",
            Regioncode: this.model.Region ? this.model.Region.Region : "",
            Employeeid: this.model.Employee
              ? this.model.Employee.EmployeeID
              : "",
            Productcode: this.model.Product
              ? this.model.Product.ProductCode
              : "",
            Statecode: this.model.state ? this.model.state.State : "",
            locationcode: data.Location,
            PolicyNo: this.model.Policy ? this.model.Policy : "",
            From: moment(this.model.fd).format(AppConfig.dateFormat.apiMoment),
            To: moment(this.model.td).format(AppConfig.dateFormat.apiMoment),
            InscompanyID: this.model.insurancecompany
              ? this.model.insurancecompany
              : "",
            Euser: this.currentUser.userCode,
          },
        ],
        requestId: "17",
        outTblCount: "0",
      })
      .then((response) => {
        if (response && response[0] && response[0].rows.length > 0) {
          this.isSpinning = false;
          this.branchdetailData = this.utilServ.convertToObject(response[0]);
          this.branchdetailDataHeader = Object.keys(this.branchdetailData[0]);
          this.brancharray = response[0].metadata.columnsTypes;

          for (var i = 0; i < this.brancharray.length; i++) {
            if (this.brancharray[i] == "numeric") {
              this.numericarray.push(this.branchdetailDataHeader[i]);
            }
          }
          this.isVisible = true;
        } else {
          this.notification.error("No Data Found", "");
          this.isSpinning = false;
          return;
        }
      });
  }
  exportData() {
    debugger;

    let isValid = this.ValidServ.validateForm(
      this.validateForm,
      this.clientFormControlNames
    );
    if (isValid == false) {
      this.isSpinning = false;
      return;
    }

    this.isSpinning = true;
    let data = this.model.policystatus.toString();
    let val;

    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Reporttype: this.model.ReportType ? this.model.ReportType : "",
            SorD: this.model.sORd ? this.model.sORd : "",
            Regioncode: this.model.Region ? this.model.Region.Region : "",
            Employeeid: this.model.Employee
              ? this.model.Employee.EmployeeID
              : "",
            Productcode: this.model.Product
              ? this.model.Product.ProductCode
              : "",
            Statecode: this.model.state ? this.model.state.State : "",
            locationcode: this.model.Location
              ? this.model.Location.Location
              : "",
            PolicyNo: this.model.Policy ? this.model.Policy : "",
            From: moment(this.model.fd).format(AppConfig.dateFormat.apiMoment),
            To: moment(this.model.td).format(AppConfig.dateFormat.apiMoment),
            InscompanyID: this.model.insurancecompany
              ? this.model.insurancecompany
              : "",
            Euser: this.currentUser.userCode,
            Loctype: this.model.ForB,
            ExportType: this.model.exporttype,
            ProductCategory: this.model.ProductCategory
              ? this.model.ProductCategory.CategoryCode
              : "",
            SpCode: this.model.sp ? this.model.sp.SpCode : "",
            PolicyStatus: this.model.policystatus ? data : "",
            InsurerType: this.model.InsurerType
              ? this.model.InsurerType
              : "ALL",
            Pan: this.model.PAN ? this.model.PAN.PANNumber : "",
            NewExpView: "EXCEL",
          },
        ],
        requestId: "11",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;

        if (this.model.exporttype == "TreeView" && this.model.sORd == "S") {
          // this.notification.error('No Data Found', '')
          this.Records = this.utilServ.convertToResultArray(response[0]);
          this.Columns = response[0].metadata.columns;
          this.utilServ.Excel(
            this.Columns,
            this.Records,
            this.model.exporttype
          );
          this.isSpinning = false;
        } else {
          let res;
          if (response && response[0]) {
            this.Records = this.utilServ.convertToResultArray(response[0]);
            this.Columns = response[0].metadata.columns;
            this.utilServ.Excel(
              this.Columns,
              this.Records,
              this.model.exporttype
            );
            this.isSpinning = false;
          }
        }
      });
  }
  resetForm() {
    this.model.policystatus = null;
    this.model.state = null;
    this.model.Region = null;
    this.model.Location = null;
    this.model.Employee = null;
    this.model.Product = null;
    this.model.Policy = "";
    this.ZoneData = [];
    this.ZoneData1 = [];
    this.ZoneDataHeader = [];
    this.StateData = [];
    this.RegionData = [];
    let date = new Date();
    this.model.fd = new Date(date.getFullYear(), date.getMonth(), 1);
    this.model.td = new Date();
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.stateData1header = [];
    this.regionData1header = [];
    this.branchData1header = [];
    this.model.sp = "";
    this.model.ProductCategory = "";
    this.getCommondata();
    this.reset();
    this.model.sORd = "S";
    this.model.PAN = null;
  }
  reset() {
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.stateData1header = [];
    this.regionData1header = [];
    this.branchData1header = [];
    this.ZoneData = [];
    this.ZoneData1 = [];
    this.ZoneDataHeader = [];
    this.StateData = [];
    this.RegionData = [];
    this.EmployeeData1 = [];
    // this.EmployeeData1 = [];
  }

  find() {}
  showModal(data): void {
    if (data.key.startsWith("branch_")) {
      this.previewBranchDetails(data);
      this.branchcode = data.Name;
    }
  }
  handleOk(): void {
    this.isVisible = false;
    this.isVisible1 = false;
  }
  handleCancel(): void {
    this.isVisible = false;
    this.isVisible1 = false;
  }
  createComponentModal(data, head): void {
    if (head == "Policy_Number" && this.model.ReportType == "Issuance") {
      const modal = this.modalService.create({
        nzTitle: "Policy Details",
        nzContent: PolicyDetailsComponent,
        nzWidth: "80%",
        nzComponentParams: {
          policyNo: data.Policy_Number,
          Euser: this.currentUser.userCode,
        },
        nzFooter: null,
      });
    }
  }
  isHeader(header, model) {
    if (header == "Policy_Number" && model == "Issuance") {
      return true;
    } else {
      return false;
    }
  }
  onchange() {
    let length = this.model.policystatus.length;
    // window.alert(length);
    if (this.model.policystatus[0] == "ALL" && length == 1) {
      return;
    } else {
      for (let i = 0; i < length; i++) {
        let modeldata = this.model.policystatus[i];
        let data2 = this.model.policystatus[i + 1];
        if (modeldata == "ALL" && length == 2) {
          this.model.policystatus.splice(i, 1);
        } else if (data2 == "ALL" && length == 2) {
          this.model.policystatus = null;
          this.model.policystatus = "ALL";
          break;
        } else if (modeldata == "ALL" && length > 2) {
          this.model.policystatus = null;
          this.model.policystatus = "ALL";
          break;
        }
      }
    }
    this.reset_tabledata();
  }
  reset_tabledata() {
    this.treeData = [];
    this.stateData1 = [];
    this.regionData1 = [];
    this.branchData1 = [];
    this.stateData1header = [];
    this.regionData1header = [];
    this.branchData1header = [];
    this.ZoneData = [];
    this.ZoneData1 = [];
    this.ZoneDataHeader = [];
    this.StateData = [];
    this.RegionData = [];
    this.EmployeeData1 = [];
  }
  sortstate(data) {
    if (data == null) {
      this.stateCodeValue = "";
    } else {
      this.stateCodeValue = data.State;
    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      hasDescInput: false,
      requestId: 2,
      whereClause: this.stateCodeValue
        ? "REPORTINGSTATE ='" + this.stateCodeValue + "'"
        : "",
    };
    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: "Region",
      codeLabel: "RegionCode",
      descColumn: "RegionName",
      descLabel: "Region",
      hasDescInput: false,
      requestId: 2,
      whereClause: this.stateCodeValue
        ? "REPORTINGSTATE ='" + this.stateCodeValue + "'"
        : "",
    };
    this.model.Location = null;
    this.model.Region = null;
    this.reset_tabledata();
  }
  onchange_reg(data) {
    if (data == null) {
      this.stateCodeValue = "";
    } else {
      this.regionvalue = data.RegionName;
    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      hasDescInput: false,
      requestId: 2,
      whereClause: this.regionvalue
        ? "regionname ='" + this.regionvalue + "'"
        : "",
    };
    this.model.Location = null;
    this.reset_tabledata();
  }
  getInsuranceCompany() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Euser: this.currentUser.userCode,
            InsuerType: this.model.InsurerType ? this.model.InsurerType : 0,
          },
        ],
        requestId: "139",
      })
      .then((response) => {
        let res;
        if (response && response[0]) {
          this.insCompList = this.utilServ.convertToObject(response[0]);
          this.model.insurancecompany = this.insCompList[0].Code;
        } else {
        }
      });
    this.ProductCategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: "CategoryCode",
      codeLabel: "CategoryCode",
      descColumn: "CategoryName",
      descLabel: "CategoryName",
      whereClause: this.model.InsurerType
        ? "ProductTypeId = '" + this.model.InsurerType + "'"
        : "1=1",
      hasDescInput: false,
      requestId: 2,
    };
  }

  getproduct() {
    this.model.Product = null;

    this.ProductFindopt = {
      findType: FindType.Product,
      codeColumn: "ProductCode",
      codeLabel: "ProductCode",
      descColumn: "ProductName",
      descLabel: "Product",
      whereClause: this.model.ProductCategory
        ? "CategoryID = '" + this.model.ProductCategory.CategoryID + "'"
        : "1=1",
      hasDescInput: false,
      requestId: 2,
    };

    this.reset_tabledata();
  }
}
