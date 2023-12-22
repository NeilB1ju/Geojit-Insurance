import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService } from 'shared';
import { User } from 'shared/lib/models/user';
import * as FileSaver from 'file-saver';
import { FindOptions } from 'shared';
import { FindType } from 'shared'


export interface CommissionStructureForm {
  insCompany: string;
  file: any;
  product: any;
}

@Component({
  selector: 'app-commission-structure',
  templateUrl: './commission-structure.component.html',
  styleUrls: ['./commission-structure.component.less']
})
export class CommissionStructureComponent implements OnInit {

  model: CommissionStructureForm;
  insCompList: Array<any> = [];
  // isProcessing;
  // isProcessingDownload;
  currentUser: User;
  FileSaver: FileSaver;
  html;
  Columns: Array<any> = [];
  Records: Array<any> = [];
  fileList: UploadFile[] = [];
  completedProcess: number = 0;
  productFindopt: FindOptions;

  constructor(
    private modalService: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService
  ) {
    this.model = <CommissionStructureForm>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

    this.productFindopt = {
      findType: FindType.ProductSearch,
      codeColumn: 'ProductCode',
      codeLabel: 'Product Code',
      descColumn: 'ProductName',
      descLabel: 'Product Name',
      title: 'Product',
      requestId:2
    }

  }

  ngOnInit() {
    this.getInitData();
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
        this.insCompList = this.utilServ.convertToObject(response[0]);
        this.model.insCompany = this.insCompList[0].Code;
      } else {
        // this.notif.error = "No Data Found";
      }
    });

  }

  exportData(type) {
    // this.isProcessingDownload = true;
    this.dataServ.generateTextFile({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyId: this.model.insCompany,
          Type: type,
          ProductID: this.model.product ? this.model.product.ProductID : 0
        }],
      "requestId": "28"
    }).then((response) => {debugger

      let res;

      if (response.errorCode !=0) {
        // this.Records = this.utilServ.convertToResultArray(response[0]);
        // this.Columns = response[0].metadata.columns;
        // this.Excel(this.Columns, this.Records);
        this.notif.error(response.errorMsg,'');
      } else  {
        this.notif.success('Success','');
        
      }
    });
  }

  beforeUploadFile = (file: UploadFile): boolean => {
    this.model.file = file;
    this.fileList = [file];
    return false;
  }

  //export to excel
  Excel(colums, data) {
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
    FileSaver.saveAs(blob, "CommissionStructure.xls");
    // this.isProcessing = false;
    // this.isProcessingDownload = false;
  }

  processFile(file) {
    return new Promise((resolve, reject) => {
      let file = this.model.file;
      if (!this.model.file) {
        // this.isProcessing = false;
        this.notif.error('Please select a file', '');
        return;
      }
      let fileName;
      if (file) {
        const formdata: FormData = new FormData();
        formdata.append('file', file);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          if (response && response.errorCode == 0) {
            fileName = response.fileName;
            // this.notif.success('uploaded successfully', 'success');
            resolve(fileName);
            // this.isProcessing = false;
          }
          else {
            this.notif.error(response.errorMsg, '');
            // this.isProcessing = false;
          }
        });
      }
    });
  }

  processUpload() {debugger
    this.processFile(this.model.file).then((filename) => {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
            InsCompanyID: this.model.insCompany,
            FileName: filename,
            ProductID : this.model.product ? this.model.product.ProductID : 0,
            Euser: this.currentUser.userCode
          }],
        "requestId": "27"
      }).then((response) => {debugger
        let res;
        // this.Clear();
        if (response && response.errorMsg) {
          this.notif.error(response.errorMsg,'');
        }else {
          this.notif.success("File uploaded successfully",'');
        }
      });
    }, () => {
      //  this.isProcessingSave = false;
    });
  }

  Clear = ()=> {
    this.fileList = [];
    this.model.file = '';
    return;
  }

}
