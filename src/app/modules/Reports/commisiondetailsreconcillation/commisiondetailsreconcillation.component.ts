import { FormHandlerComponent } from 'shared';
import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'shared';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { AppConfig } from 'shared';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import * as FileSaver from 'file-saver';
import { User } from 'shared/lib/models/user';
import * as moment from 'moment';

@Component({
  selector: 'app-commisiondetailsreconcillation',
  templateUrl: './commisiondetailsreconcillation.component.html',
  styleUrls: ['./commisiondetailsreconcillation.component.css']
})
export class CommisiondetailsreconcillationComponent implements OnInit {
  
  @ViewChild(FormHandlerComponent, { static: true }) formHandler: FormHandlerComponent;
  insCompList: any[];
  html: string;
  insCompany: any;
  Fdate:Date=new Date;
  Tdate:Date=new Date;
  Policy: any;
  currentUser: User;


  constructor(

    private authServ: AuthService,
    private utilServ: UtilService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private modalService: NzModalService
  ) { 

    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    }
    );
  }

  ngOnInit() {
    this.formHandler.setFormType('report');
    this.formHandler.config.showExportPdfBtn = false;
    this.formHandler.config.showExportExcelBtn = true;
    this.formHandler.config.showPreviewBtn = false;
    this.getInsCompany()
  }
  getInsCompany() {
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
        this.insCompany=0
        // this.model.insurancecompany = this.insCompList[1].Code;

      } else {

      }
    });
  }

  
exportData() {debugger
  let v=moment(this.Fdate).format(AppConfig.dateFormat.apiMoment)
  let y=moment(this.Fdate).format(AppConfig.dateFormat.apiMoment)
  if(this.Fdate==null){

  this.notification.error('Sorry','Please select from date')
  return
  }
  if(this.Tdate==null){

    this.notification.error('Sorry','Please select to date')
    return
      }
      if (moment(this.Tdate).format(AppConfig.dateFormat.apiMoment)<moment(this.Fdate).format(AppConfig.dateFormat.apiMoment))
      {
        this.notification.error('Sorry',"From date must be less than to date")
        return false
      }
      if((moment(this.Tdate).format(AppConfig.dateFormat.apiMoment)>moment(new Date()).format(AppConfig.dateFormat.apiMoment))||moment(this.Fdate).format(AppConfig.dateFormat.apiMoment)>moment(new Date()).format(AppConfig.dateFormat.apiMoment)){
        this.notification.error('Sorry',"Future date is not allowed")
        return false
      }
  let reqParams = {
    "batchStatus": "false",
    "detailArray":
    [{
      INS_CompanyId:this.insCompany?this.insCompany:0,
      FromDate     :moment(this.Fdate).format(AppConfig.dateFormat.apiMoment)?moment(this.Fdate).format(AppConfig.dateFormat.apiMoment):'',  
      ToDate    :moment(this.Fdate).format(AppConfig.dateFormat.apiMoment)?moment(this.Tdate).format(AppConfig.dateFormat.apiMoment):'',  
      PolicyNo   :this.Policy?this.Policy:'',  
      Euser    : this.currentUser.userCode ||''
    }],
    "requestId": "138",
    "outTblCount": "0"
  }
  reqParams['fileType'] ="2";
  reqParams['fileOptions'] = { 'pageSize': 'A4' };
  let isPreview: boolean;
  isPreview = false;
debugger
  this.dataServ.generateReportmultiexcel(reqParams, isPreview).then((response) => { debugger
    // this.isSpinning = false;
    if (response.errorMsg) {
      this.notification.error("Data not found", '')
    }    
},() => {
  debugger
  this.notification.error("Server encountered an error", '')
}
);
}
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
  

  let blob = new Blob([this.html],{
    type: "application/vnd.ms-excel;charset=charset=utf-8"
    
  }
  
  
  
  );debugger
  
  FileSaver.saveAs(blob,"FTM.xls");
  
 
  
 
}
resetForm(){

  this.insCompany=0;
  this.Fdate=new Date;
  this.Tdate=new Date;
  this.Policy=null;
}
}
