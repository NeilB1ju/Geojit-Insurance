import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { AppConfig, AuthService, DataService, FormHandlerComponent, User, UtilService } from 'shared';
import { FindOptions } from "shared";
import * as XLSX from 'xlsx';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';

export interface fileuploadform {
  filetype: any;
  date: Date;
  sheet: any;
  EXtype: any
}

@Component({
  selector: 'app-irda-sp-file-upload-in-spice-application',
  templateUrl: './irda-sp-file-upload-in-spice-application.component.html',
  styleUrls: ['./irda-sp-file-upload-in-spice-application.component.css']
})
export class IrdaSpFileUploadInSpiceApplicationComponent implements OnInit {

  model: any;
  file:  any = [];
  currentUser: any;
  fileName: any;
  Filetypes: any = [];
  UploadFlag: boolean = true
  Upload: Array<any> = [];
  wsname: Array<any> = [];
  isSpinning: any
  disableButton:boolean

  uploads: any
  isExcelFile: any
  wb: any
  bstr: any
  fName: any
  FileExtention: any
  ShowSheet: boolean = false
  // disableButton: boolean = false
  @ViewChild(FormHandlerComponent, { static: false }) formHdlr: FormHandlerComponent;
  constructor(private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private notification: NzNotificationService,) {
    this.model = <fileuploadform>{
    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

  }

  ngOnInit() {
    this.model.date = new Date();
    this.getfiletype();
    
  }

  

  getfiletype() {
    this.isSpinning = true;
    this.model.filetype = null
    this.model.Filetypes = []
    console.log("this.model.EXtype", this.model.EXtype);
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode
        }],
      "requestId": "148",
      "outTblCount": "0"
    })

      .then((response) => {
        if (response && response[0] && response[0].rows.length > 0) {
          console.log(response);
          this.Filetypes = this.utilServ.convertToObject(response[0]);
          this.model.filetype= this.Filetypes[0].RptId
          this.isSpinning = false;
        }
        else {
          this.notification.error('File Types  Not Found', '');
          this.isSpinning = false;

        }

      })
  }
  uploadresponse() {
    if (this.file) {

      this.processFile(0);
    }
    else {
      this.notification.error('Please select  File', '');

      return;
    }
    // this.processUpload(0)
  }

  


  fileChangeEvent = () => {
    // this.disableButton=true

    return (file: UploadFile): boolean => {
      if (file.type == 'application/vnd.ms-excel' || file.type == 'text/csv' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        this.file = [file];
        this.disableButton=false
        this.fileUpload()


      }
      else {
        this.notification.error("Please Upload Valid file format", "")
        this.disableButton=true
        return false
      }
      // this.resetForm();
      return false;
    };
  }

  processFile(i) {
    debugger
    this.isSpinning = true;
    return new Promise((resolve, reject) => {
      let val = this.file;
      if (val) {
        val.status = "Processing";
        const formdata: FormData = new FormData();
        formdata.append('file', val[0]);
        this.dataServ.ftpuploadFile(formdata).then((response: any) => {
          if (response && response.errorCode == 0) {
            this.fileName = response.fileName;
            resolve(this.fileName)
            this.updateData(this.fileName, 0)
          }
          else {
            this.notification.error(response.errorMsg, '');
          }
        });
      }
    });
  }
  

  onChangeFileType(data){

    this.model.date = new Date();
    this.wsname = []
    this.model.sheet = ''
    this.file=[]

  }


  //************************//

  fileUpload() {
    debugger

    this.model.sheet = ''
    this.wsname = []
    this.UploadFlag = false
    if (this.file && this.file.length > 0) {
      this.isExcelFile = !!this.file[0].name.match(/(.xls|.xlsx)/);
      if (this.isExcelFile) {
        this.ShowSheet = true
        this.isSpinning = true;
        this.fName = this.file[0].name
        this.FileExtention = this.fName.split('.').pop();
        const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          /* read workbook */
          this.bstr = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(this.bstr, { type: 'binary' });
          /* grab first sheet */
          this.wsname = wb.SheetNames;
          this.model.sheet = this.wsname[0]
          // const ws: XLSX.WorkSheet = wb.Sheets[this.wsname[0]];
          /* save data */
          // data = XLSX.utils.sheet_to_json(ws);

        };
        reader.readAsBinaryString(this.file[0]);
        reader.onloadend = (e) => {
          this.isSpinning = false;
        }
      } else {
        this.model.sheet = null
        this.ShowSheet = false
        return;
      }
    }
  }
  private updateData(fileName, i) {
    return new Promise((resolve, reject) => {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            PROCESSFILE:fileName?fileName:'',
            PROCESSID: this.model.filetype?this.model.filetype:'',
            EUSER:this.currentUser.userCode? this.currentUser.userCode:'',
            ENTRYDATE:this.model.date? moment(this.model.date).format(AppConfig.dateFormat.apiMoment) : '',
            SHEETNAME:this.model.sheet?this.model.sheet:''

          }],
        "requestId": "149",
      })
        .then((response) => {
          if (response.errorMsg) {
            this.notification.error(response.errorMsg, '');
            this.isSpinning = false;
            this.file = undefined;
            this.resetValue()
          }
          else if (response && response[0] && response[0].rows) {
            if (response.length > 0) {
              this.isSpinning = false;
              let data:any=this.utilServ.convertToObject(response[0])
              this.notification.success(data[0].Message, '')
              this.resetValue()
            }
          }
        });
    });
  }
  resetValue() {
   
    this.fileName = null
    this.model.filetype = null
    this.model.date = new Date()
    this.wsname = []
    this.model.sheet = null
    this.file=[]
    this.getfiletype()
   
  }
}





