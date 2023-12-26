import { Component, OnInit, ViewChild } from "@angular/core";
import { NzNotificationService } from "ng-zorro-antd";
import * as moment from "moment";
import { UtilService } from "shared";
import { AuthService } from "shared";
import { DataService } from "shared";
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from "shared";
import { AppConfig } from "shared";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
export interface CommonReportForm {
  state: any;
  region: any;
  location: any;
  client: any;
  transferFromDate: any;
  transferToDate: any;
}
@Component({
  selector: "app-client-location-transfer-report",
  templateUrl: "./client-location-transfer-report.component.html",
  styleUrls: ["./client-location-transfer-report.component.css"],
})
export class ClientLocationTransferReportComponent implements OnInit {
  validateForm!: FormGroup;
  @ViewChild(FormHandlerComponent, { static: false })
  formHdlr: FormHandlerComponent;
  Records: Array<any> = [];
  Columns: Array<any> = [];
  isProcessing;
  isSpinning = false;
  currentUser: any;
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  clientFindopt: FindOptions;
  tableData = [];
  tableDataHeader = [];
  model: any;
  constructor(
    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private fb: FormBuilder
  ) {
    this.model = <CommonReportForm>{};
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
    this.loadSearch();
  }

  ngOnInit() {
    this.validatationForm();
    this.model.transferFromDate = new Date();
    this.model.transferToDate = new Date();
  }
  validatationForm() {
    this.validateForm = this.fb.group({
      state: [null],
      region: [null],
      location: [null],
      client: [null],
      transferFromDate: [null],
      transferToDate: [null],
    });
  }
  disableDate = (current: Date): boolean => {
    const today = new Date();
    return current > today;
  };

  loadSearch() {
    debugger;

    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: "State",
      codeLabel: "State",
      descColumn: "State",
      descLabel: "State",
      hasDescInput: false,
      title: "State",
      requestId: 2,
    };
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: "Location",
      codeLabel: "LocationCode",
      descColumn: "LocationName",
      descLabel: "Location",
      title: "LocationName",
      hasDescInput: false,
      whereClause: "",
      requestId: 2,
    };
    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: "Region",
      codeLabel: "RegionCode",
      descColumn: "RegionName",
      descLabel: "Region",
      hasDescInput: false,
      title: "RegionName",
      requestId: 2,
      whereClause: "",
    };

    this.clientFindopt = {
      findType: FindType.Client,
      codeColumn: "ClientFirstName",
      codeLabel: "Client Id",
      descColumn: "ClientFirstName",
      descLabel: "Name",
      title: "Client",
      hasDescInput: false,
      requestId: 2,
    };
  }
  // filtering search types with selected ones,
  onChangeSearch(data, type) {
    debugger;

    if (!data || !type) {
      return;
    }

    // debugger
    // console.log("data",data);
    // console.log("type",type);

    if (data && type) {
      if (type === "state") {
        debugger;
        this.RegionFindopt = {
          findType: FindType.Region,
          codeColumn: "Region",
          codeLabel: "RegionCode",
          descColumn: "RegionName",
          descLabel: "Region",
          hasDescInput: false,
          title: "RegionName",
          whereClause: data.State ? "REPORTINGSTATE ='" + data.State + "'" : "",
          requestId: 2,
        };
        this.locationFindopt = {
          findType: FindType.Location,
          codeColumn: "Location",
          codeLabel: "LocationCode",
          descColumn: "LocationName",
          descLabel: "Location",
          title: "LocationName",
          hasDescInput: false,
          whereClause: data.State ? "REPORTINGSTATE ='" + data.State + "'" : "",
          requestId: 2,
        };
      } else if (type == "region") {
        debugger;
        this.locationFindopt = {
          findType: FindType.Location,
          codeColumn: "Location",
          codeLabel: "LocationCode",
          descColumn: "LocationName",
          descLabel: "Location",
          title: "LocationName",
          hasDescInput: false,
          whereClause: data.RegionName
            ? "regionname ='" + data.RegionName + "'"
            : "",
          requestId: 2,
        };
      }
    }
  }

  // table view
  view() {
    this.tableData = [];
    this.tableDataHeader = [];
    this.isSpinning = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            State: this.model.state ? this.model.state.StateCode : "",
            Region: this.model.region ? this.model.region.Region : "",
            Location: this.model.location ? this.model.location.Location : "",
            Client: this.model.client ? this.model.client.ClientID : "",
            FromDate: this.model.transferFromDate
              ? moment(this.model.transferFromDate).format(
                  AppConfig.dateFormat.apiMoment
                )
              : "",
            ToDate: this.model.transferToDate
              ? moment(this.model.transferToDate).format(
                  AppConfig.dateFormat.apiMoment
                )
              : "",
            Euser: this.currentUser.userCode ? this.currentUser.userCode : "",
          },
        ],
        requestId: "147",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;
        if (response.errorMsg) {
          this.notification.error(response.errorMsg, "");
          this.isSpinning = false;
        } else if (response && response[0] && response[0].rows.length > 0) {
          let data = this.utilServ.convertToObject(response[0]);
          this.tableData = data;
          this.tableDataHeader = Object.keys(this.tableData[0]);
          this.isSpinning = false;
        } else {
          this.notification.error("No Data Found", "");
          this.isSpinning = false;
        }
      });
  }
  // export data
  exportData() {
    this.isSpinning = true;
    let reqParams = {
      batchStatus: "false",
      detailArray: [
        {
          State: this.model.state ? this.model.state.StateCode : "",
          Region: this.model.region ? this.model.region.Region : "",
          Location: this.model.location ? this.model.location.Location : "",
          Client: this.model.client ? this.model.client.ClientID : "",
          FromDate: this.model.transferFromDate
            ? moment(this.model.transferFromDate).format(
                AppConfig.dateFormat.apiMoment
              )
            : "",
          ToDate: this.model.transferToDate
            ? moment(this.model.transferToDate).format(
                AppConfig.dateFormat.apiMoment
              )
            : "",
          Euser: this.currentUser.userCode ? this.currentUser.userCode : "",
        },
      ],
      requestId: "147",
      outTblCount: "0",
    };
    reqParams["fileType"] = "3";
    reqParams["fileOptions"] = { pageSize: "A3R" };
    let isPreview: boolean;
    isPreview = false;
    this.isProcessing = true;
    this.dataServ.generateReport(reqParams, isPreview).then(
      (response) => {
        this.isSpinning = false;
        this.isProcessing = false;
        if (response.errorMsg != undefined && response.errorMsg != "") {
          this.isSpinning = false;
          this.notification.error(response.errorMsg, "");
          return;
        } else {
          if (!isPreview) {
            this.isSpinning = false;
            this.notification.success("File downloaded successfully", "");
            return;
          }
        }
      },
      () => {
        this.isSpinning = false;
        this.notification.error("Server encountered an Error", "");
      }
    );
  }
  // reset button
  reset() {
    debugger;
    this.validateForm.reset();
    this.tableData = [];
    this.tableDataHeader = [];
    this.model.transferFromDate = new Date();
    this.model.transferToDate = new Date();
    this.loadSearch();
  }
}
