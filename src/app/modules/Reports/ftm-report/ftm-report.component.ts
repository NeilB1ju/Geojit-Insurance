import {
  Component,
  OnInit,
  ViewChild,
  PipeTransform,
  Pipe,
} from "@angular/core";
import {
  FindOptions,
  DataService,
  AuthService,
  UtilService,
  FormHandlerComponent,
} from "shared";
import * as FileSaver from "file-saver";
// import * as $ from 'jquery';

import { User } from "shared/lib/models/user";
import { NzNotificationService } from "ng-zorro-antd";
// import { isDebuggerStatement } from 'node_modules1234/tsutils';

export interface TreeNodeInterface {
  key: number;
  Id: number;
  Name: string;
  title: string;
  CODE: any;
  children?: TreeNodeInterface[];
}
@Component({
  selector: "app-ftm-report",
  templateUrl: "./ftm-report.component.html",
  styleUrls: ["./ftm-report.component.less"],
})
export class FTMReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent, { static: true })
  formHandler: FormHandlerComponent;
  ReportType: any;
  rpttype: any = [
    { Code: "L", Description: "Login" },
    { Code: "I", Description: "Issuance" },
  ];
  state: any;
  stateFindopt: FindOptions;
  RegionFindopt: FindOptions;
  locationFindopt: FindOptions;
  Location: FindOptions;
  EmployeeFindopt: FindOptions;
  expandKeys: any;
  Region: any;
  currentUser: User;
  isSpinning: boolean = false;
  Employee: any;
  year: any = [];
  year1: any;
  mnth1: any;
  isVisible = false;
  Finyearlist: any = [];
  Finyear: any;
  mnth: any = [];
  mnthdata: any = [];
  mapOfExpandedData: any = {};
  treeData1: any = [];
  value: any;
  MorY: any = "M";
  filterpath: any;
  sORd: any = "S";
  yeardata: any = [];
  Records: any;
  Columns: any;
  html: string;
  BorF: any = "B";
  columnArray: any[];
  data: any;
  tabledata: any = [];
  header: string[];
  headerdata: any;
  value1: any;
  value2: any;
  value3: any;
  value4: any;
  value5: any;
  value6: any;
  value7: any;

  loading = false;
  data1: any = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title: "Ant Design Title 4",
    },
  ];

  CommisionFlag: boolean = false;
  Commision: any = [];
  IncomeFlag: boolean = false;
  Income: any = [];
  visibleDrawer: boolean = false;
  drawerPlacement: any = "top";
  drawerContent: any;
  drawerContentTxt: any;
  color1: any;
  color2: any;

  // nodes = [
  //   {
  //     title: 'parent 1',
  //     key: '100',
  //     children: [
  //       {
  //         title: 'parent 1-0',
  //         key: '1001',
  //         children: [
  //           { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
  //           { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
  //         ]
  //       },
  //       {
  //         title: 'parent 1-1',
  //         key: '1002',
  //         children: [{ title: 'leaf 1-1-0', key: '10020', isLeaf: true }]
  //       }
  //     ]
  //   }
  // ];
  constructor(
    private dataServ: DataService,
    private authServ: AuthService,
    private utilServ: UtilService,
    private notification: NzNotificationService
  ) {
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    debugger;
    this.sORd = "S";
    this.BorF = "A";
    this.isSpinning = true;

    this.formHandler.setFormType("report");
    this.formHandler.config.showExportPdfBtn = false;
    this.formHandler.config.showExportExcelBtn = true;
    this.formHandler.config.showCancelBtn = false;
    this.formHandler.config.showSaveBtn = false;

    this.ReportType = "L";
    // setTimeout(() => {
    //   this.value = '1001';
    // }, 1000);

    // this.getyearmnth()
    this.isSpinning = false;
    debugger;
    this.getfnyr();
    this.getyearmnth();
    this.year1;
    this.mnth1;
    this.Finyear;

    this.gettreedata();
  }

  reset() {
    this.mnthdata = [];
    this.yeardata = [];
    debugger;
    this.gettreedata();
  }
  getyearmnth() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 44,
          },
        ],
        requestId: "4",
      })
      .then((response) => {
        debugger;

        if (response && response[0]) {
          this.mnth = this.utilServ.convertToObject(response[0]);
          this.year = this.utilServ.convertToObject(response[1]);
          this.year1 = this.year[0].Code;
          this.mnth1 = this.mnth[0].Code;
        } else {
        }
      });
    // this.gettreedata()
  }
  gettreedata() {
    debugger;
    this.isSpinning = true;

    //   this.getfnyr()
    // this.getyearmnth()
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            EUser: this.currentUser.userCode,
            BorF: this.BorF,
            ReportPeriod: this.MorY,
            ReportYear: this.year1 ? this.year1 : 0,
            ReportMonth: this.mnth1 ? this.mnth1 : 0,
            FinyearId: this.Finyear ? this.Finyear : 0,

            ReportType: this.ReportType,
          },
        ],
        requestId: "101",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;

        this.isSpinning = false;
        if (response && response[0] && response[0].rows.length > 0) {
          let zoneData = this.utilServ.convertToObject(response[0]);
          let stateData = this.utilServ.convertToObject(response[1]);
          let regionData = this.utilServ.convertToObject(response[2]);
          let locationData = this.utilServ.convertToObject(response[3]);
          let empdata = this.utilServ.convertToObject(response[4]);

          empdata = empdata.map((o) => {
            //  o.key = "emp_" + o.Id;
            o.key = o.CODE;

            return o;
          });

          locationData = locationData.map((branch) => {
            //  branch.key = "location_" + branch.Id;
            branch.key = branch.CODE;
            branch.children = empdata.filter((o) => {
              return o.ParentId == branch.Id;
            });

            return branch;
          });

          regionData = regionData.map((locdata) => {
            //  locdata.key = "region_" + locdata.Id;
            locdata.key = locdata.CODE;
            locdata.children = locationData.filter((loc) => {
              return loc.ParentId == locdata.Id;
            });
            return locdata;
          });

          stateData = stateData.map((regdata) => {
            //  regdata.key = "state_" + regdata.Id;
            regdata.key = regdata.CODE;
            regdata.children = regionData.filter((locdata) => {
              return locdata.ParentId == regdata.Id;
            });

            return regdata;
          });

          zoneData = zoneData.map((state) => {
            state.key = "zone_" + state.Id;
            state.key = state.CODE;
            state.children = stateData.filter((reg) => {
              return reg.ParentId == state.Id;
            });

            return state;
          });
          //  zoneData = zoneData.map((zone) => {
          //    zone.key = "zone_" + zone.Id;
          //    zone.children = stateData.filter((sta) => {
          //      return sta.ParentId == zone.Id
          //    });
          //    return zone;
          //  });
          //  companydata = companydata.map((company) => {
          //    company.ParentId = 0;
          //    company.key = "company_" + company.Id;
          //    company.children = zoneData.filter((zon) => {
          //      return zon.ParentId == company.Id
          //    });
          //    return company;
          //  });
          zoneData.forEach((item) => {
            this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
          });

          let a = JSON.stringify(zoneData);
          this.treeData1 = JSON.parse(a);

          console.log(this.treeData1);
        }
      });
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

  getfnyr() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            EUser: this.currentUser.userCode,
          },
        ],
        requestId: "102",
      })
      .then((response) => {
        debugger;

        if (response && response[0]) {
          debugger;
          this.Finyearlist = this.utilServ.convertToObject(response[0]);
          // this.Finyear=this.
          this.Finyear = this.Finyearlist[0].PERIODID;
        } else {
        }
      });
  }

  preview() {
    this.yeardata = [];
    this.mnthdata = [];
    if (this.MorY == "M") {
      if (this.mnth1 == "" || this.mnth1 == null || this.mnth1 == undefined) {
        this.notification.error("select Month", "");
        return;
      }
      if (this.year1 == "" || this.year1 == null || this.year1 == undefined) {
        this.notification.error("select Year ", "");
        return;
      }
    }

    if (this.MorY == "Y") {
      if (
        this.Finyear == "" ||
        this.Finyear == null ||
        this.Finyear == undefined
      ) {
        this.notification.error("select Financial year", "");
        return;
      }
    }

    debugger;
    this.isSpinning = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            ReportType: this.ReportType,
            ReportPeriod: this.MorY,
            ReportYear: this.year1 ? this.year1 : 0,
            ReportMonth: this.mnth1 ? this.mnth1 : 0,
            FinyearId: this.Finyear ? this.Finyear : 0,
            CODEVALUE: this.value ? this.value : "ALL",
            ExcelExport: 0,
            Euser: this.currentUser.userCode,
            SorD: this.sORd,
            BorF: this.BorF,
          },
        ],
        requestId: "103",
      })
      .then((response) => {
        debugger;
        this.isSpinning = false;

        if (response && response[0]) {
          if (this.MorY == "M") {
            this.mnthdata = this.utilServ.convertToObject(response[0]);
          }
          if (this.MorY == "Y") {
            this.yeardata = this.utilServ.convertToObject(response[0]);
            this.Income = this.utilServ.convertToObject(response[2]);
            this.IncomeFlag = this.Income[0].IncomeFlag;
          }

          let filterpath = this.utilServ.convertToObject(response[1]);
          this.filterpath = filterpath[0].FilterPath;
          if (this.mnthdata.length == 0 && this.yeardata.length == 0) {
            this.notification.error("No data found", "");
            return;
          }
        } else {
          this.notification.error("No data found", "");
          return;
        }
      });
  }

  onChange($event: string): void {
    console.log($event);
  }

  exportData() {
    debugger;
    if (this.MorY == "M") {
      if (this.mnth1 == "" || this.mnth1 == null || this.mnth1 == undefined) {
        this.notification.error("select Month", "");
        return;
      }
      if (this.year1 == "" || this.year1 == null || this.year1 == undefined) {
        this.notification.error("select Year ", "");
        return;
      }
    }

    if (this.MorY == "Y") {
      if (
        this.Finyear == "" ||
        this.Finyear == null ||
        this.Finyear == undefined
      ) {
        this.notification.error("select Financial year", "");
        return;
      }
    }
    this.isSpinning = true;
    let reqParams = {
      batchStatus: "false",
      detailArray: [
        {
          ReportType: this.ReportType,
          ReportPeriod: this.MorY,
          ReportYear: this.year1 ? this.year1 : 0,
          ReportMonth: this.mnth1 ? this.mnth1 : 0,
          FinyearId: this.Finyear ? this.Finyear : 0,
          CODEVALUE: this.value ? this.value : "ALL",
          ExcelExport: 1,
          Euser: this.currentUser.userCode,
          SorD: this.sORd,
          BorF: this.BorF,
        },
      ],
      requestId: "103",
      outTblCount: "0",
    };
    reqParams["fileType"] = "2";
    reqParams["fileOptions"] = { pageSize: "A4" };
    let isPreview: boolean;
    isPreview = false;

    this.dataServ.generateReportmultiexcel(reqParams, isPreview).then(
      (response) => {
        debugger;
        this.isSpinning = false;
        // this.isSpinning = false;
        if (response.errorMsg) {
          this.notification.error("Data not found", "");
        }
      },
      () => {
        debugger;
        this.notification.error("Server Encountered an Error", "");
      }
    );
  }

  // export to excel
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
      type: "application/vnd.ms-excel;charset=charset=utf-8",
    });
    debugger;

    FileSaver.saveAs(blob, "FTM.xls");
  }

  changeBorF() {
    this.gettreedata();
    this.reset();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log("Button ok clicked!");
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log("Button cancel clicked!");
    this.isVisible = false;
  }

  getnopmnth(data, mnthorday, value) {
    if (value <= 0) {
      return;
    }
    debugger;
    this.isSpinning = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            ReportType: this.ReportType,
            ReportPeriod: this.MorY,
            ReportYear: this.year1 ? this.year1 : 0,
            ReportMonth: this.mnth1 ? this.mnth1 : 0,
            FinyearId: this.Finyear ? this.Finyear : 0,
            CODEVALUE: this.value ? this.value : "ALL",
            Euser: this.currentUser.userCode,
            SorD: this.sORd,
            BorF: this.BorF,
            Month: mnthorday,
            Day: mnthorday,
            Company: data.CompanyName,
            productcategory: data.productcategory,
          },
        ],
        requestId: "105",
      })
      .then((response) => {
        debugger;
        this.isSpinning = false;

        this.columnArray = [];
        this.data = response[0].metadata.columnsTypes;
        this.tabledata = this.utilServ.convertToObject(response[0]);
        this.Commision = this.utilServ.convertToObject(response[1]);
        this.CommisionFlag = this.Commision[0].CommissionPaidFlag;
        debugger;
        console.log(this.tabledata);
        // this.header = Object.keys(this.tabledata[0]);
        // for (var i = 0; i < this.data.length; i++) {
        //   if (this.data[i] == "numeric") {
        //     this.columnArray.push(this.header[i]);
        //   }
        // }

        if (this.tabledata.length)
          this.headerdata = this.tabledata[0].HeaderColumn;
        {
          this.showModal();
        }
      });
  }

  //   multi(){

  // }

  // generateReportmultiexcel
  enter(code) {
    debugger;

    let element = code.srcElement.nextElementSibling; // get the sibling element
    // focus if not null
    if (code.keyCode === 13) {
      element.focus();
      let a = 20;
      for (let i = 0; i < a; i++) {
        let elmnt: HTMLElement = document.getElementById(
          "check"
        ) as HTMLElement;
        elmnt.click();

        // $( "#check" ).mousemove(function( event ) {
        //  }) ;

        a + 1;
      }
    }
  }
  test() {
    console.log("test");
  }
  closeDrawer() {
    this.visibleDrawer = false;
  }
  openDrawer() {
    this.visibleDrawer = true;
    this.drawerContentView();
  }
  drawerContentView() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            EUser: this.currentUser.userCode,
            ModuleID: this.dataServ.ModuleID ? this.dataServ.ModuleID : 0,
          },
        ],
        requestId: "112",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;
        // this.dataServ.ModuleID
        if (response && response[0] && response[0].rows.length > 0) {
          this.drawerContent = this.utilServ.convertToObject(response[0]);
          this.drawerContentTxt = this.drawerContent[0].DrawerDescription;
        } else {
        }
      });
  }
}
