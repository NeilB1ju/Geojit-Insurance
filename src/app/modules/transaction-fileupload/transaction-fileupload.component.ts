import { Component, OnInit, ViewChild } from "@angular/core";
import { LookUpDialogComponent } from "shared";
import { NzModalService } from "ng-zorro-antd";
import { DataService } from "shared";
import { UtilService } from "shared";
import { UploadFile } from "ng-zorro-antd";
import * as moment from "moment";
import { AppConfig } from "shared";
import { NzNotificationService } from "ng-zorro-antd";
import { AuthService } from "shared";
import { User } from "shared/lib/models/user";

export interface TransactionFileUploadForm {
  tranDate: Date;
  insCompany: string;
}

@Component({
  selector: "app-transaction-file-upload",
  templateUrl: "./transaction-fileupload.component.html",
  styleUrls: ["./transaction-fileupload.component.less"],
})
export class TransactionFileUploadComponent implements OnInit {
  model: TransactionFileUploadForm;
  @ViewChild(LookUpDialogComponent, { static: false })
  lookupsearch: LookUpDialogComponent;
  insCompList: Array<any> = [];
  clientList: Array<any> = [];
  isProcessing;
  completedProcess: number = 0;
  currentUser: User;

  constructor(
    private modalService: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService
  ) {
    this.model = <TransactionFileUploadForm>{
      tranDate: new Date(),
    };
    this.authServ.getUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.getInsCompany();
  }

  getInsCompany() {
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            Code: 41,
          },
        ],
        requestId: "4",
      })
      .then((response) => {
        // this.isProcessing = false;
        let res;
        if (response && response[0]) {
          this.insCompList = this.utilServ.convertToObject(response[0]);
          // this.model.insCompany = this.insCompList[0].Code;
        } else {
          // this.notif.error = "No Data Found";
        }
      });
  }

  viewList() {
    if (!this.model.insCompany) {
      this.notif.warning("Please select insurance company", "");
      return;
    }
    this.isProcessing = true;
    this.dataServ
      .getResponse({
        batchStatus: "false",
        detailArray: [
          {
            EUser: this.currentUser.userCode,
            InsCompanyID: this.model.insCompany,
          },
        ],
        requestId: "3",
      })
      .then((response) => {
        this.isProcessing = false;
        let res;
        if (response && response[0]) {
          this.clientList = this.utilServ.convertToObject(response[0]);
          for (var i = 0; i < this.clientList.length; i++) {
            this.clientList[i].file = [];
            this.clientList[i].status = "";
            this.clientList[i].errMsg = "";
            this.clientList[i].showErr = false;
          }
        } else {
          this.notif.error("No Data Found", "");
        }
      });
  }

  fileChangeEvent = (index) => {
    return (file: UploadFile): boolean => {
      this.clientList[index].file = [file];
      return false;
    };
  };

  onLookupSelect(data) {}

  openModal() {
    let reqParams;

    reqParams = {
      batchStatus: "false",
      detailArray: [{ SearchType: 1001, WhereClause: "", LangId: 1 }],
      myHashTable: {},
      requestId: 2,
      outTblCount: "0",
    };

    this.lookupsearch.actionOpen(reqParams, "Test");
  }

  uploadFiles() {
    let val,
      el,
      isChecked = false;
    for (var i = 0; i < this.clientList.length; i++) {
      el = this.clientList[i];
      if (el.checked) {
        isChecked = true;
        if (el.file.length == 0) {
          this.notif.warning(
            "Please choose file for " + el.FileDescription,
            ""
          );
          return;
        }
      }
    }
    if (!isChecked) {
      this.notif.warning("Please select atleast one record", "");
      return;
    }
    this.completedProcess = 0;
    this.processUpload(0);
  }

  processUpload(i) {
    if (!this.clientList[i]) {
      return;
    }
    this.processFile(i).then(
      (response) => {
        debugger;
        let filename = response;
        this.updateData(filename, i).then(
          (response) => {
            debugger;
            // this.notif.success("File uploaded successfully",'');
            this.processUpload(++this.completedProcess);
          },
          () => {
            // this.isProcessingSave = false;
          }
        );
      },
      () => {
        // this.isProcessingSave = false;
      }
    );
  }

  processFile(i) {
    return new Promise((resolve, reject) => {
      let val = this.clientList[i];
      if (val.checked) {
        let fileName;

        if (val.file) {
          debugger;
          val.status = "Processing";
          const formdata: FormData = new FormData();
          formdata.append("file", val.file[0]);
          this.dataServ.ftpuploadFile(formdata).then((response: any) => {
            debugger;
            if (response && response.errorCode == 0) {
              debugger;
              fileName = response.fileName;
              resolve(fileName);
            } else {
              this.notif.error(response.errorMsg, "");
            }
          });
        }
      } else {
        this.processUpload(++this.completedProcess);
      }
    });
  }

  showError(data) {
    data.showErr = true;
  }

  private updateData(fileName, i) {
    debugger;

    this.model.insCompany;
    return new Promise((resolve, reject) => {
      this.dataServ
        .getResponse({
          batchStatus: "false",
          detailArray: [
            {
              ProcessType: this.clientList[i].ProcessID,
              TranDate: moment(this.model.tranDate).format(
                AppConfig.dateFormat.apiMoment
              ),
              FileName: fileName, //'Geojit Issuance WRP YTD.csv',//filename,
              EUser: this.currentUser.userCode,
              Debug: "N",
              InsCompanyId: this.model.insCompany,
            },
          ],
          requestId: "8",
        })
        .then((response) => {
          debugger;
          // this.isProcessing = false;
          let res;
          if (response && response.errorCode == 0) {
            this.clientList[i].status = "Success";
            this.clientList[i].errMsg = "";
            resolve(true);
          } else {
            if (response[0]) {
              res = this.utilServ.convertToObject(response[0]);
              if (res[0].Msg) {
                this.clientList[i].status = "Failed";
                this.clientList[i].errMsg = res[0].Msg;
                reject();
              } else {
                this.clientList[i].status = "Success";
                this.clientList[i].errMsg = "";
                resolve(true);
              }
            } else {
              this.clientList[i].status = "Failed";
              this.clientList[i].errMsg = response.errorMsg;
              reject();
            }
          }
        });
    });
  }
  download(data) {
    debugger;
    this.dataServ
      .Download({
        batchStatus: "false",
        detailArray: [
          {
            Euser: this.currentUser.userCode,
            ProccesId: data.ProcessID,
          },
        ],
        requestId: "128",
        outTblCount: "0",
      })
      .then((response) => {
        debugger;
        if (response.errorCode == 0) {
          this.notif.success("Done", "Succesfully Dowloaded");
        } else {
          this.notif.error("Sorry", "No sample template available");
        }
      });
  }
}
