// import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';

// import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
// import * as moment from 'moment';

// import { UtilService } from 'shared';
// import { AuthService } from 'shared';
// import { DataService } from 'shared';
// import { FindOptions } from "shared";
// import { FindType } from "shared";
// import { FormHandlerComponent } from 'shared';
// import { AppConfig } from 'shared';
// // import { PolicyDetailsComponent } from "../policy-details/policy-details.component";
// import { User } from 'shared/lib/models/user';
// import { InputMasks } from 'shared';
// // import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";

// export interface inwardreportForm {
//   fromDate: Date;
//   toDate: Date;
//   businessDoneBy: string;
//   inscompany: string;
//   state: any;
//   region: any;
//   location: any;
//   frlocation: any;
//   employee: any;
//   product: any;
//   applicationNo: string;
//   sOrD: string;
//   policyNo:string;

// }

// export interface TreeNodeInterface {
//   key: number;
//   Id: number;
//   Name: string;
//   Premium_Collected: number;
//   No_Of_Policies: number;
//   Commission: number;
//   Annualised_Premium: number;
//   expand: boolean;
//   children?: TreeNodeInterface[];
// }

// @Pipe({
//   name: 'tableFilter',
// })
// export class TableFilterPipe implements PipeTransform {
//   transform(items: any[], filter: any): any {
//     if (!items || !filter) {
//       return items;
//     }
//     return items.filter(item => {
//       let flag = false;

//       if (item[filter.key] && item[filter.key] == filter.value)
//         flag = true;
//       return flag;
//     })
//   }
// }

// @Component({
//   templateUrl: './inwardreport.component.html',
//   styleUrls: ['./inwardreport.component.less']
// })

// export class inwardreportComponent implements OnInit {

//   @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

//   model: inwardreportForm;
//   stateFindopt: FindOptions;
//   locationFindopt: FindOptions;
//   RegionFindopt: FindOptions;
//   EmployeeFindopt: FindOptions;
//   ProductFindopt: FindOptions;
//   location: any;
//   isVisible: any;
//   branchcode: any;
//   columnArray = [];
//   numericarray = [];
//   brancharray = [];
//   insCompList: Array<any> = [];
//   businessArr: Array<any> = [];
//   ZoneData: Array<any> = [];
//   ZoneData1: Array<any> = [];
//   ZoneDataHeader: Array<any> = [];
//   StateData: Array<any> = [];
//   RegionData: Array<any> = [];
//   branchdetailData: Array<any> = [];
//   branchdetailDataHeader: Array<any> = [];
//   ZoneDataHeader1: Array<any> = [];
//   ZoneDataType: Array<any> = [];
//   currentUser: User;
//   treeData: Array<TreeNodeInterface> = [];
//   mapOfExpandedData: any = {};
//   inputMasks = InputMasks;
//   constructor(
//     private authServ: AuthService,
//     private utilServ: UtilService,
//     private dataServ: DataService,
//     private notification: NzNotificationService,
//     private modalService: NzModalService

//   ) {
//     this.model = <inwardreportForm>{
//     };
//     this.authServ.getUser().subscribe(user => {
//       this.currentUser = user;
//     }
//     );
//     this.stateFindopt = {
//       findType: FindType.State,
//       codeColumn: 'State',
//       codeLabel: 'SateCode',
//       descColumn: 'State',
//       descLabel: 'State',
//       hasDescInput: false,
//     }
//     this.locationFindopt = {
//       findType: FindType.Location,
//       codeColumn: 'Location',
//       codeLabel: 'LocationCode',
//       descColumn: 'LocationName',
//       descLabel: 'Location',
//       hasDescInput: false,
//     }
//     this.RegionFindopt = {
//       findType: FindType.Region,
//       codeColumn: 'Region',
//       codeLabel: 'RegionCode',
//       descColumn: 'RegionName',
//       descLabel: 'Region',
//       hasDescInput: false,
//     }
//     this.EmployeeFindopt = {
//       findType: FindType.Employee,
//       codeColumn: 'Code',
//       codeLabel: 'EmployeeCode',
//       descColumn: 'Name',
//       descLabel: 'Employee',
//       hasDescInput: false,
//     }
//     this.ProductFindopt = {
//       findType: FindType.Product,
//       codeColumn: 'ProductCode',
//       codeLabel: 'ProductCode',
//       descColumn: 'ProductName',
//       descLabel: 'Product',
//     }

//     // this.location = {
//     //   Location: 'test',
//     //   LocationName: 'rrrrrrr'
//     // }
//   }

//   ngOnInit() {
//     this.formHdlr.setFormType('report');
//     let date = new Date();
//     this.model.toDate = new Date();
//     this.model.fromDate = new Date(date.getFullYear(), date.getMonth(), 1);
//     this.getInsCompany();
//     this.getBusinessdone();
//     this.model.sOrD = 'S';
//     this.model.employee = '';
//     this.model.location = '';
//     this.model.frlocation = '';
//     this.model.region = '';
//     this.model.state = '';
//     this.model.product = '';
//     this.model.applicationNo = '';

//   }

//   getInsCompany() {
//     this.dataServ.getResponse({
//       "batchStatus": "false",
//       "detailArray":
//         [{
//           Code: 20
//         }],
//       "requestId": "4"
//     }).then((response) => {

//       let res;
//       if (response && response[0]) {
//         this.insCompList = this.utilServ.convertToObject(response[0]);
//         this.model.inscompany = this.insCompList[0].Code;
//       } else {

//       }
//     });
//   }
//   getBusinessdone() {
//     this.dataServ.getResponse({
//       "batchStatus": "false",
//       "detailArray":
//         [{
//           Code: 36
//         }],
//       "requestId": "4"
//     }).then((response) => {

//       let res;
//       if (response && response[0]) {
//         this.businessArr = this.utilServ.convertToObject(response[0]);
//         this.model.businessDoneBy = this.businessArr[0].Code;
//       } else {

//       }
//     });
//   }
//   reset() {
//     this.ngOnInit();
//     this.ZoneData = [];
//     this.ZoneData1 = [];
//     this.ZoneDataHeader = [];
//     this.StateData = [];
//     this.RegionData = [];
//   }
//   collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
//     if ($event === false) {
//       if (data.children) {
//         data.children.forEach(d => {
//           const target = array.find(a => a.key === d.key);
//           target.expand = false;
//           this.collapse(array, target, false);
//         });
//       } else {
//         return;
//       }
//     }
//   }

//   convertTreeToList(root: object): TreeNodeInterface[] {
//     const stack = [];
//     const array = [];
//     const hashMap = {};
//     stack.push({ ...root, level: 0, expand: true });

//     while (stack.length !== 0) {
//       const node = stack.pop();
//       this.visitNode(node, hashMap, array);
//       if (node.children) {
//         for (let i = node.children.length - 1; i >= 0; i--) {
//           stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
//         }
//       }
//     }

//     return array;
//   }

//   visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
//     if (!hashMap[node.key]) {
//       hashMap[node.key] = true;
//       array.push(node);
//     }
//   }

//   preview() {

//     let val;
//     if (this.model.fromDate > this.model.toDate) {
//       this.notification.error("From date Should be Less than Todate", '');
//       return;


//     }
//     this.dataServ.getResponse({
//       "batchStatus": "false",
//       "detailArray":
//         [{
//           InsCompanyId: this.model.inscompany,
//           BusinessDone: this.model.businessDoneBy,
//           State: this.model.state ? this.model.state.State : '',
//           Region: this.model.region ? this.model.region.Region : '',
//           Location: this.model.location ? this.model.location.Location : '',
//           Frlocation: this.model.frlocation ? this.model.frlocation : '',
//           FromDate: this.model.fromDate ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment) : '',
//           ToDate: this.model.toDate ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment) : '',
//           SorD: this.model.sOrD ? this.model.sOrD : '',
//           ApplicationNo: this.model.applicationNo ? this.model.applicationNo : '',
//           Euser: this.currentUser.userCode,


//         }],
//       "requestId": "47",
//       "outTblCount": "0"
//     }).then((response) => {
//       
//       if (response && response[0] && response[0].rows.length > 0) {

//         if (this.model.sOrD == 'S') {
//           // this.ZoneData = this.utilServ.convertToObject(response[0]);
//           // this.ZoneDataHeader = Object.keys(this.ZoneData[0]);

//           let zoneData = this.utilServ.convertToObject(response[0]);
//           let stateData = this.utilServ.convertToObject(response[1]);
//           let regionData = this.utilServ.convertToObject(response[2]);
//           let branchData = this.utilServ.convertToObject(response[3]);
//           if (stateData == []) {
//             this.notification.error('No data found', '')
//             return;
//           }
//           branchData = branchData.map((o) => {
//             o.key = "branch_" + o.Id;
//             return o;
//           });
//           regionData = regionData.map((region) => {
//             region.key = "region_" + region.Id;
//             region.children = branchData.filter((branch) => {
//               return branch.ParentId == region.Id
//             });
//             return region;
//           });
//           stateData = stateData.map((state) => {
//             state.key = "state_" + state.Id;
//             state.children = regionData.filter((region) => {
//               return region.ParentId == state.Id
//             });
//             return state;
//           });
//           zoneData = zoneData.map((zone) => {
//             zone.ParentId = 0;
//             zone.key = "zone_" + zone.Id;
//             zone.children = stateData.filter((state) => {
//               return state.ParentId == zone.Id
//             });
//             return zone;
//           });

//           zoneData.forEach(item => {
//             this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
//           });

//           this.treeData = [...zoneData];
//         }
//         if (this.model.sOrD == 'D') {
//           this.columnArray = [];
//           this.ZoneDataType = response[0].metadata.columnsTypes;

//           this.ZoneData1 = this.utilServ.convertToResultArray(response[0]);
//           this.ZoneDataHeader1 = Object.keys(this.ZoneData1[0]);
//           for (var i = 0; i < this.ZoneDataType.length; i++) {
//             if (this.ZoneDataType[i] == "numeric") {
//               this.columnArray.push(this.ZoneDataType);
//             }
//           }

//         }

//       }


//       else if (response.errorMsg) {
//         this.notification.error(response.errorMsg, '');
//       }
//       else {
//         this.notification.error("No Data Found", '');

//         return;
//       }

//     })

//   }

//   setClickStyle(data) {
//     if (data.key.startsWith("branch_")) {
//       return true;
//     } else {
//       return false;
//     }
//   }

//   setStyles(head) {
//     if (this.numericarray.indexOf(head) >= 0) {
//       return true;

//     }
//     else {
//       return false;
//     }

//   }

//   setStyle(head) {
//     if (this.columnArray.indexOf(head) >= 0) {
//       return true;

//     }
//     else {
//       return false;
//     }

//   }




// }
