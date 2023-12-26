import {
  Component,
  OnInit,
  ViewChild,
  Pipe,
  PipeTransform,
} from "@angular/core";
import { NzNotificationService, NzModalService } from "ng-zorro-antd";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import * as moment from "moment";
import * as FileSaver from "file-saver";
import { LookUpDialogComponent, UtilService, ValidationService } from "shared";
import { AuthService } from "shared";
import { DataService } from "shared";
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from "shared";
import { AppConfig } from "shared";
import { PolicyDetailsComponent } from "../../modules/policy-details/policy-details.component";
import { User } from "shared/lib/models/user";
import { InputMasks } from "shared";
// import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { saveAs } from "file-saver";
export interface CommonReportForm {
  registerType: any;
  fromDate: any;
  toDate: any;
  filterOn: any;
  status: any;
}

@Component({
  selector: "app-irda-report",
  templateUrl: "./irda-report.component.html",
  styleUrls: ["./irda-report.component.less"],
})
export class IrdaReportComponent implements OnInit {
  validateForm!: FormGroup;
  @ViewChild(FormHandlerComponent, { static: false })
  formHdlr: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent, { static: false })
  lookupsearch: LookUpDialogComponent;

  Records: Array<any> = [];
  Columns: Array<any> = [];
  html;
  isProcessing;
  businessArr: Array<any> = [];
  exporttypeList: Array<any> = [];
  model: any;
  isSpinning = false;
  currentUser: any;
  SpFindopt: FindOptions;
  saveORUpdateButtonFlag: boolean = false;
  registerType: any;
  filterOn: any;
  status: any;

  StatusFlag: boolean = false;
  FilterOnFlag: boolean = false;
  dateFlag: boolean = false;

  tableData = [];
  tableDataHeader = [];

  safeImageUrl: any;
  showProposal: boolean = false;
  photo: any;
  fileName: any;
  filePreiewContent: any;
  filePreiewContentType: any;
  isVisible: boolean = false;
  filePreiewFilename: any;

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
    this.model = <CommonReportForm>{};
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.validatationForm();
    this.getDropDown();
    this.model.registerType = 1;
    this.model.fromDate = new Date();
    this.model.toDate = new Date();
    this.StatusFlag = false;
    this.FilterOnFlag = true;
    this.dateFlag = true;
  }
  preview() {
    this.tableData = [];
    this.tableDataHeader = [];
    this.isSpinning = true;

    // console.log("status", this.model.status);

    debugger;

    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Flag: "View",
            RType: this.model.registerType,
            FromDate: this.model.fromDate
              ? moment(this.model.fromDate).format(
                  AppConfig.dateFormat.apiMoment
                )
              : "",
            ToDate: this.model.toDate
              ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment)
              : "",
            FilterOn: this.model.filterOn ? this.model.filterOn : "",
            Status: this.model.status ? this.model.status : "",
            Euser: this.currentUser.userCode ? this.currentUser.userCode : "",
            SPCode: "",
            ComplaintID: 0,
          },
        ],
        requestId: "146",
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

  resetForm() {
    this.getDropDown();
    this.model.registerType = 1;
    this.model.fromDate = new Date();
    this.model.toDate = new Date();
    this.StatusFlag = false;
    this.FilterOnFlag = true;
    this.dateFlag = true;
    this.tableData = [];
    this.tableDataHeader = [];
    this.model.filterOn = null;
    this.model.status = null;
  }
  exportData() {
    this.isSpinning = true;
    let reqParams = {
      batchStatus: "false",
      detailArray: [
        {
          Flag: "Excel",
          RType: this.model.registerType,
          FromDate: this.model.fromDate
            ? moment(this.model.fromDate).format(AppConfig.dateFormat.apiMoment)
            : "",
          ToDate: this.model.toDate
            ? moment(this.model.toDate).format(AppConfig.dateFormat.apiMoment)
            : "",
          FilterOn: this.model.filterOn ? this.model.filterOn : "",
          Status: this.model.status ? this.model.status : "",
          Euser: this.currentUser.userCode ? this.currentUser.userCode : "",
          SPCode: "",
          ComplaintID: 0,
        },
      ],
      requestId: "146",
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

  validatationForm() {
    // validation using reactiveformModules
    this.validateForm = this.fb.group({
      // first holder details
      PolicyNumber: [null],
      registerType: [null],
      fromDate: [null],
      toDate: [null],
      filterOn: [null],
      status: [null],
    });
  }

  getDropDown() {
    debugger;

    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Flag: "Dropdown",
            RType: "",
            FromDate: "",
            ToDate: "",
            FilterOn: "",
            Status: "",
            Euser: this.currentUser.userCode ? this.currentUser.userCode : "",
            SPCode: "",
            ComplaintID: 0,
          },
        ],
        requestId: "146",
        outTblCount: "0",
      })
      .then((response) => {
        if (response.errorMsg) {
          this.notification.error(response.errorMsg, "");
          this.isSpinning = false;
        } else if (response && response[0] && response[0].rows.length > 0) {
          this.isSpinning = false;

          this.registerType = this.utilServ.convertToObject(response[0]);
          this.filterOn = this.utilServ.convertToObject(response[1]);
          this.status = this.utilServ.convertToObject(response[2]);
        } else {
          this.notification.error("some thing went wrong", "");
        }
      });
  }

  onChangeRptType(data: any) {
    debugger;
    this.registerType;
    this.StatusFlag = false;
    this.FilterOnFlag = false;
    this.dateFlag = false;
    this.model.toDate = new Date();
    this.tableData = [];
    this.tableDataHeader = [];
    this.model.filterOn = null;
    this.model.status = null;
    this.model.fromDate = new Date();

    if (data === 1) {
      this.FilterOnFlag = true;
      this.dateFlag = true;
    } else if (data === 2) {
      this.dateFlag = true;
    } else if (data === 3) {
      this.StatusFlag = true;
    }
  }

  restTable() {
    this.tableData = [];
    this.tableDataHeader = [];
  }

  disableDate = (current: Date): boolean => {
    const today = new Date();
    return current > today;
  };

  viewImage(data: any) {
    debugger;

    let SPCode = data["SP Register Number"] ? data["SP Register Number"] : "";
    let ComplaintID = data["Complaint ID"] ? data["Complaint ID"] : 0;
    let rpttype;
    rpttype = SPCode ? 3 : 2;
    // rpttype=ComplaintID?2:0

    this.safeImageUrl = "";
    this.isSpinning = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            SPCode: SPCode,
            Flag: "photo",
            RType: rpttype ? rpttype : "",
            FromDate: "",
            ToDate: "",
            FilterOn: "",
            Status: "",
            Euser: this.currentUser.userCode ? this.currentUser.userCode : "",
            ComplaintID: ComplaintID,
          },
        ],
        requestId: "146",
        outTblCount: "0",
      })
      .then((response) => {
        //////////////////////////////////////////
        debugger;
        this.isSpinning = false;
        if (response.errorMsg || response.errorMsg != undefined) {
          this.notification.error(response.errorMsg, "");
          return;
        } else if (response && response[0] && response[0].rows.length > 0) {
          if (rpttype === 3) {
            debugger;
            this.showProposal = false;
            var responseData = this.utilServ.convertToObject(response[0]);
            let binaryImageData = responseData[0].Photo;
            let fileName = responseData[0].PhotoFileName;
            this.fileName = fileName.split(".").slice(0, -1).join(".");

            this.imageModal(binaryImageData, "data:image/jpeg;base64,");
            // var img = new Image();
            // Set the source of the image to the binary data
            // img.src = 'data:image/jpeg;base64,' + binaryImageData;
            // this.photo = img.src
          } else if (rpttype === 2) {
            var responseData = this.utilServ.convertToObject(response[0]);
            this.isVisible = false;
            let imgType = responseData[0].FileType;
            let imgData = responseData[0].Photo;
            let imgname = responseData[0].Filename;
            this.fileName = responseData[0].Filename;

            imgType === "image/jpg" &&
              this.imageModal(imgData, "data:image/jpg;base64,");

            imgType === "image/jpeg" &&
              this.imageModal(imgData, "data:image/jpeg;base64,");

            imgType === "application/pdf" &&
              this.previewFile(imgData, "application/pdf", imgname);
          }
        } else {
          this.isSpinning = false;
          this.notification.error("NO DATA FOUND ", "");
          return;
        }
      });
  }
  previewFile(b64: string, contentType?: string, fileName?: string): void {
    debugger;

    if (b64) {
      this.filePreiewContent = b64;
      this.filePreiewContentType = contentType;
      this.isVisible = true;
      this.filePreiewFilename = fileName;
    }
  }

  imageModal(Bs64, type) {
    debugger;

    this.showProposal = true;

    let binaryImageData = Bs64;
    var img = new Image();
    // Set the source of the image to the binary data
    img.src = type + binaryImageData;
    this.photo = img.src;
  }

  handleCancel1() {
    this.showProposal = false;
  }

  downloadBase64Image() {
    let imageData;
    if (this.photo.startsWith("data:image/jpeg;base64,")) {
      imageData = this.photo.substring("data:image/jpeg;base64,".length);
    } else if (this.photo.startsWith("data:image/jpg;base64,")) {
      imageData = this.photo.substring("data:image/jpg;base64,".length);
    }
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    let fileExtension = "";
    if (this.photo.startsWith("data:image/jpeg;base64,")) {
      fileExtension = "jpeg";
    } else if (this.photo.startsWith("data:image/jpg;base64,")) {
      fileExtension = "jpg";
    }
    const file = new Blob([byteArray], { type: "image/" + fileExtension });
    let fname = this.fileName ? this.fileName : "";

    saveAs(file, fname);
  }

  //   The Name of Complainant is required
  // 2) The Nature of Complaint is required
  // 3) The Date of Complaint is required
  // 4) The Policy Number is required
  // 5) The SP Code is required
  // 6) The SP Name is required
  // 7) The Action Taken is required
}
