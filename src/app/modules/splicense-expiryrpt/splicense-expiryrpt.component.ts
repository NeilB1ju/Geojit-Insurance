import { Component, OnInit, ViewChild } from '@angular/core';
import { LookUpDialogComponent } from 'shared';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { NzMessageService, UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { FormHandlerComponent } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import * as FileSaver from 'file-saver';

export interface SPLicenseExpForm {
  licenseFrom: Date;
  licenseTo: Date;
  spcode: any;
}

@Component({
  selector: 'app-splicense-expiryrpt',
  templateUrl: './splicense-expiryrpt.component.html',
  styleUrls: ['./splicense-expiryrpt.component.less']
})
export class SplicenseExpiryrptComponent implements OnInit {
	@ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  SpFindopt: FindOptions;
	model: SPLicenseExpForm;
	gridData:Array<any> = [];
  gridDisplayData:Array<any> = [];
	gridColumns:Array<any> = [];
  listOfSPCode = [];
  listOfSearchSPCode = [];
  searchValue: string;
  sortName = null;
  sortValue = null;
  currentUser: User;
  FileSaver: FileSaver;
  html;
  isSpinning: boolean =false;

  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService) {
  		this.model = <SPLicenseExpForm >{
	      // licenseFrom: new Date(),
	      // licenseTo: new Date()
	    };

      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      });

      this.SpFindopt = {
        findType: FindType.SPCODE,
           codeColumn: 'SpCode',
           codeLabel: 'SpCode',
           descColumn: 'SpCode',
           descLabel: 'SpCode',
           title: 'SP',
           hasDescInput: false,
           requestId:2
     
         }
     }

  ngOnInit() {
    this.formHdlr.setFormType('report');
    this.formHdlr.config.showExportExcelBtn =true
  	this.gridColumns = [];
  	this.gridData = [];
    this.gridDisplayData = [];
  	this.model.spcode = '';
    this.model.licenseFrom = null;
    this.model.licenseTo = null;
    this.model.licenseFrom = new Date();
    let dt = new Date();
    this.model.licenseTo =  new Date(dt.setMonth(dt.getMonth() + 2));
  }

  resetForm() {
  	this.ngOnInit();
  }

  //Functions for search and sort start...
  sort(sort: { key: string, value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }
  filter(listOfSearchSPCode: string[], searchValue: string): void {
    this.listOfSearchSPCode = listOfSearchSPCode;
    this.searchValue = searchValue;
    this.search();
  }
  search(): void {
    /** filter data **/
    const filterFunc = item => (this.listOfSearchSPCode.length ? this.listOfSearchSPCode.some(SPCode => item.SPCode.indexOf(SPCode) !== -1) : true);
    const data = this.gridData.filter(item => filterFunc(item));
    /** sort data **/
    if (this.sortName && this.sortValue) {
      this.gridDisplayData = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[ this.sortName ] > b[ this.sortName ] ? 1 : -1) : (b[ this.sortName ] > a[ this.sortName ] ? 1 : -1));
    } else {
      this.gridDisplayData = data;
    }
  }
  //Functions- search and sor end..

  preview(type) {
 this.isSpinning=true
  
    let json: any;
    this.listOfSPCode = [];
    json = {
      "batchStatus": "false",
      "detailArray":
         [{
           "EUser": this.currentUser.userCode,
           "SPCODE": this.model.spcode ? this.model.spcode.SpCode : '',
           "isHtml": type == 'D' ? 'Y' : '',
           "validityFrom": this.model.licenseFrom ? moment(this.model.licenseFrom).format(AppConfig.dateFormat.apiMoment) : '',
           "validityTo": this.model.licenseTo ? moment(this.model.licenseTo).format(AppConfig.dateFormat.apiMoment) : '',
         }],
      "requestId": "16",
      "outTblCount": "0",
      }
      if (type == 'D') {
        let reqParam = json;    
        reqParam['fileType'] = 1;
        reqParam['fileOptions'] = {'pageSize': 'A3R'};
        this.dataServ.generateReport(reqParam).then((response) => {
          
          
        
          if(response.errorMsg != undefined && response.errorMsg !=''){
              this.notif.error(response.errorMsg,'');
              return;
          }else if (response.errorCode == 0) {
            this.notif.success("File downloaded successfully",'');
          }
           
        }, ()=>{
          this.notif.error("Server encountered an Error",'');
        });
      }else {
    
      this.dataServ.getResponse(json).then((response) =>  {

        if (response && response[0] && response[0].rows.length > 0) {
          this.gridData = this.utilServ.convertToResultArray(response[0]);
          this.gridColumns = response[0].metadata.columns;
          if (type == 'V') {
            for (var i = 0; i < this.gridData.length; i++) {
              this.listOfSPCode.push({"text":this.gridData[i].SPCode,"value":this.gridData[i].SPCode})
            }
            this.listOfSPCode = [...this.listOfSPCode];
            this.gridDisplayData = [ ...this.gridData ];
          }else  {
            this.Excel(this.gridColumns,this.gridData);
          }
          
        }else {
          this.notif.error("No data found",'');
        } 
      })
    }
    this.isSpinning=false;
  }

  //export to excel
  Excel(colums,data){
    let tableHeader;
    this.html = "<table ><tr>";
        tableHeader = colums;
        for (let i = 0; i < tableHeader.length; i++) {
            this.html = this.html + "<th style='border:1px solid black'>" + tableHeader[i] + "</th>";
        }
        this.html = this.html + "</tr><tr>";
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < tableHeader.length; j++) {
                this.html = this.html + "<td style='border:1px solid black'>" + data[i][tableHeader[j]] + "</td>";
            }
            this.html = this.html + "<tr>";
        }
        this.html = this.html + "</tr><table>";

        let blob = new Blob([this.html], {
            type: "application/vnd.ms-excel;charset=charset=utf-8"
        });
        FileSaver.saveAs(blob, "SpLicenseExpiryReport.xls");
  }

  // exportExcel() {
  //   let blob = new Blob([document.getElementById('splicenseExp').innerHTML], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
  //       });
  //    FileSaver.saveAs(blob, "SpLicenseExpiryReport.xls");
  // }

  reset_tabledata()
  {
    this.gridDisplayData=[];
  }

}
