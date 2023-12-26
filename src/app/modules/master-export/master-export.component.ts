import { Component, OnInit, ViewChild } from "@angular/core";
import { NzModalService } from "ng-zorro-antd";
import { DataService } from "shared";
import { UtilService } from "shared";
import { UploadFile } from "ng-zorro-antd";
import * as moment from "moment";
import { AppConfig } from "shared";
import { NzNotificationService } from "ng-zorro-antd";
import { AuthService } from "shared";
import { User } from "shared/lib/models/user";
import * as FileSaver from "file-saver";
import { FindOptions } from "shared";
import { FindType } from "shared";
import { LookUpDialogComponent } from "shared";
import { FormHandlerComponent } from "shared";

export interface MasterExportForm {
  insCompany: string;
  master: any;
  state: any;
  region: any;
  location: any;
  // Employee: any;
  type: string;
  introducer: any;
  SubList: any;
  No: any;
  td: any;
  fd: any;
}

@Component({
  selector: "app-master-export",
  templateUrl: "./master-export.component.html",
  styleUrls: ["./master-export.component.less"],
})
export class MasterExportComponent implements OnInit {
  stateFindopt: FindOptions;
  regionFindopt: FindOptions;
  branchFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  FranchiseeFindopt: FindOptions;

  model: MasterExportForm;
  insCompList: Array<any> = [];
  masterList: Array<any> = [];
  introducerList: Array<any> = [];
  isProcessing;
  currentUser: User;
  FileSaver: FileSaver;
  html;
  Columns: Array<any> = [];
  Records: Array<any> = [];
  @ViewChild(FormHandlerComponent, { static: true })
  formHandler: FormHandlerComponent;
  data: any = [];
  policyrpt: any = [];
  isSpinning: boolean;
  masterSubList: any = [];
  ViewToDate: boolean = false;
  ViewFromDate: boolean = false;
  ViewState: boolean = false;
  ViewRegion: boolean = false;
  ViewLocation: boolean = false;
  ViewIntroducer: boolean = false;
  Status: boolean = false;
  ViewInputText: boolean = false;
  Subid: any;
  CatId: any;

  constructor(
    private modalService: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService
  ) {
    this.model = <MasterExportForm>{};
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: "State",
      codeLabel: "StateCode",
      descColumn: "State",
      descLabel: "State",
      title: "State",
      hasDescInput: false,
      requestId: 2,
    };
    this.regionFindopt = {
      findType: FindType.Region,
      codeColumn: "Region",
      codeLabel: "RegionCode",
      descColumn: "RegionName",
      descLabel: "Region",
      title: "Region",
      hasDescInput: false,
      requestId: 2,
    };
    this.branchFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      title: "Branch",
      hasDescInput: false,
      requestId: 2,
    };
    this.FranchiseeFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "Location",
      descColumn: "LocationName",
      descLabel: "LocationName",
      title: "Location",
      requestId: 2,
    };
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: "EmployeeID",
      codeLabel: "Emp Id",
      descColumn: "Name",
      descLabel: "Name",
      title: "Employee",
      requestId: 2,
    };
  }

  ngOnInit() {
    this.getInitData();
    this.getIntroducer();
    this.getcategorylist();
    this.formHandler.setFormType("report");
    this.formHandler.config.showExportBtn = true;
    this.formHandler.config.showPreviewBtn = true;
    this.formHandler.config.showExportPdfBtn = false;
    this.formHandler.config.showExportExcelBtn = false;
    this.model.master = "";
    this.model.region = "";
    this.model.state = "";
    this.model.location = "";
    this.model.introducer = "E";
  }

  Reset() {
    this.ngOnInit();
  }
  getInitData() {
    //insurance company list
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 20,
          },
        ],
        requestId: "4",
      })
      .then((response) => {
        let res;
        if (response && response[0]) {
          this.insCompList = this.utilServ.convertToObject(response[0]);
          this.model.insCompany = this.insCompList[0].Code;
        } else {
          // this.notif.error = "No Data Found";
        }
      });
    //Master list
  }

  getcategorylist() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Euser: this.currentUser.userCode,
            status: "C",
            Cid: 0,
          },
        ],
        requestId: "64",
      })
      .then((response) => {
        let res;
        if (response && response[0]) {
          this.masterList = this.utilServ.convertToObject(response[0]);

          console.log(this.masterList);
          // this.model.master = this.masterList[0].Code
        } else {
          // this.notif.error = "No Data Found";
        }
      });
  }

  getSUBcategorylist(data) {
    debugger;

    if (data) {
      this.CatId = data.Id;
      if (data.ViewSubcategory == true) {
        this.dataServ
          .getResponse({
            batchStatus: "false",
            detailArray: [
              {
                Euser: this.currentUser.userCode,
                status: "S",
                Cid: data ? data.Id : 0,
              },
            ],
            requestId: "64",
          })
          .then((response) => {
            let res;
            if (response && response[0]) {
              this.masterSubList = this.utilServ.convertToObject(response[0]);
              console.log(this.masterSubList);
              // this.model.master = this.masterList[0].Code
            } else {
              // this.notif.error = "No Data Found";
            }
          });
      } else {
        return;
      }
    }
  }

  getIntroducer() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 31,
          },
        ],
        requestId: "4",
      })
      .then((response) => {
        let res;
        if (response && response[0]) {
          this.introducerList = this.utilServ.convertToObject(response[0]);
          // this.model.introducer = this.introducerList[0].Code;
        } else {
        }
      });
  }
  exportData() {
    // if (!this.model.master.Code) {
    //   this.notif.warning("Please select Type", '');
    //   return;
    // }
    this.isSpinning = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            CompanyId: this.model.insCompany,
            Category: this.CatId ? this.CatId : 0,
            SubCategory: this.Subid ? this.Subid : 0,
            FromDate: this.model.fd
              ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment)
              : "",
            ToDate: this.model.td
              ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment)
              : "",
            state: this.model.state ? this.model.state.State : "",
            Region: this.model.region ? this.model.region.Region : "",
            Location: this.model.location ? this.model.location.Location : "",
            Introducer:
              this.model.master.Code == "sp" || this.model.master.Code == "C"
                ? this.model.introducer
                : "",
            CommonInput: this.model.No ? this.model.No : "",
            Euser: this.currentUser.userCode,
          },
        ],
        requestId: "65",
      })
      .then((response) => {
        this.isSpinning = false;
        let res;
        if (response && response[0]) {
          this.Records = this.utilServ.convertToResultArray(response[0]);
          this.Columns = response[0].metadata.columns;
          this.Excel(this.Columns, this.Records, "Master");
        } else {
          this.notif.error("No Data Found", "");
        }
      });
  }

  preview() {
    debugger;
    this.isSpinning = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            CompanyId: this.model.insCompany,
            Category: this.CatId ? this.CatId : 0,
            SubCategory: this.Subid ? this.Subid : 0,
            FromDate: this.model.fd
              ? moment(this.model.fd).format(AppConfig.dateFormat.apiMoment)
              : "",
            ToDate: this.model.td
              ? moment(this.model.td).format(AppConfig.dateFormat.apiMoment)
              : "",
            state: this.model.state ? this.model.state.State : "",
            Region: this.model.region ? this.model.region.Region : "",
            Location: this.model.location ? this.model.location.Location : "",
            Introducer:
              this.model.master.Code == "sp" || this.model.master.Code == "C"
                ? this.model.introducer
                : "",
            CommonInput: this.model.No ? this.model.No : "",
            Euser: this.currentUser.userCode,
          },
        ],
        requestId: "65",
      })
      .then((response) => {
        this.isSpinning = false;
        let res;
        if (response && response[0]) {
          this.data = this.utilServ.convertToObject(response[0]);
          this.policyrpt = Object.keys(this.data[0]);
        } else {
          this.notif.error("No Data Found", "");
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
      type: "application/vnd.ms-excel;charset=charset=utf-8",
    });
    FileSaver.saveAs(blob, filename + " Report.xls");
    this.isProcessing = false;
    // let blob = new Blob([document.getElementById('clientassetrpt').innerHTML], {
    //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
    //     });
    //  FileSaver.saveAs(blob, "ClientAssetReport.xls");
  }
  onLookupSelect(data) {
    this.model.location = { Location: data.LocatoionCode };
  }
  OnchangeType(data) {
    debugger;

    this.masterSubList = [];
    this.getSUBcategorylist(data);

    //     if (data) {

    //       if (this.model.location)
    //         this.model.location = "";

    //     if (this.model.region)
    //       this.model.region = "";
    //     if (this.model.state)
    //       this.model.state = "";
    //     if (this.model.introducer)
    //       this.model.introducer = 'E';
    // }
  }

  onchangeSubCategory(data) {
    this.Subid = data.Id;
    this.ViewFromDate = data.ViewFromDate;
    this.ViewToDate = data.ViewToDate;
    this.ViewState = data.ViewState;
    this.ViewRegion = data.ViewRegion;
    this.ViewLocation = data.ViewLocation;
    this.ViewIntroducer = data.ViewIntroducer;
    this.Status = data.Status;
    this.ViewInputText = data.ViewInputText;
  }

  reset_tabledata() {
    this.data = [];
    this.policyrpt = [];
  }
}
