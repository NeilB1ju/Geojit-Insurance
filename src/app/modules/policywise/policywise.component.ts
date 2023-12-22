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
import { InputMasks } from 'shared';
import * as  jsonxml from 'jsontoxml';

export interface policywise {
  insCompany:any;
  Policy:any;
}

@Component({
  selector: 'app-policywise',
  templateUrl: './policywise.component.html',
  styleUrls: ['./policywise.component.less']
})
export class policywise implements OnInit {
	@ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  SpFindopt: FindOptions;
	model: policywise;
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
  insCompList: any[];
  data: number;
  Date: any;
  data1: any;
  tabledata: any;
  inputMasks = InputMasks;
  isSpinning: boolean =false;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private notif: NzNotificationService) {
  		this.model = <policywise >{
	      // licenseFrom: new Date(),
	      // licenseTo: new Date()
	    };

      this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      });

     
     }

  ngOnInit() {
  	this.formHdlr.setFormType('report');
    this.getInsuranceCompany();
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showExportPdfBtn=false;
    this.formHdlr.config.showExportExcelBtn=false;
  }


  getInsuranceCompany() {
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
        this.model.insCompany = this.insCompList[1].Code;
      } else {

      }
    });
  }


  view()
  {
    this.isSpinning=true;
    
    debugger
    
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "policyNo": this.model.Policy,
          "Company": this.model.insCompany,
          "Euser":this.currentUser.userCode

        }],
      "requestId": "52",
      "outTblCount": "0"
    }).then((response) => {
      this.isSpinning=false;

      if (response && response[0] && response[0].rows.length > 0) {
        // this.isSpinning=false;  
        let res;
        res = this.utilServ.convertToObject(response[0]);
        this.data1 = res[0];
        let res1=this.utilServ.convertToObject(response[1])
        this.tabledata=res1;
        if(this.tabledata.length)
        this.formHdlr.config.showSaveBtn = true;
        
        // console.log(this.tabledata)
       
        // this.formHdlr.config.showSaveBtn = false;
      }
      else {
        // this.isSpinning=false;  
        this.notif.error("No data found", '');

        return;
      }
    })


  }




change(item)
{
   this.tabledata[item.id].CommissionPayable=(item.amount /100)*item.Commissionperc
}
save()
{
 

  if(this.model.Policy =='' || this.model.Policy ==null || this.model.Policy == undefined)
  {
   
    this.notif.warning("Enter policy number", '');
    return
  }
  if(this.model.insCompany =='' || this.model.insCompany ==null || this.model.insCompany == undefined)
  {
   
    this.notif.warning("Select Company ", '');
    return
  }

  if(this.tabledata == '' || this.tabledata == null || this.tabledata == undefined)
  {

    this.notif.error("No data to Save", '');
    return
  }
var JSONData = this.utilServ.setJSONArray(this.tabledata);
var user_Regxml=jsonxml(JSONData);
this.dataServ.getResponse({
  "batchStatus": "false",
  "detailArray":
    [{
      "policyNo": this.model.Policy,
      "XmlString":jsonxml(JSONData),
      "Euser":this.currentUser.userCode

    }],
  "requestId": "53",
  "outTblCount": "0"
}).then((response) => {
   

  if (response.errorCode==0) {
    

    this.notif.success("Updated Sucessfully", '')
    this.resetForm()
  }
  else {
    // this.isSpinning=false;  
    this.notif.error("Failed", '');

    return;
  }
})




}






  resetForm() {
    this.ngOnInit();
    this.tabledata='';
    this.data1='';
    this.model.Policy='';
    
  }

  // //Functions for search and sort start...
  // sort(sort: { key: string, value: string }): void {
  //   this.sortName = sort.key;
  //   this.sortValue = sort.value;
  //   this.search();
  // }
  // filter(listOfSearchSPCode: string[], searchValue: string): void {
  //   this.listOfSearchSPCode = listOfSearchSPCode;
  //   this.searchValue = searchValue;
  //   this.search();
  // }
  // search(): void {
  //   /** filter data **/
  //   const filterFunc = item => (this.listOfSearchSPCode.length ? this.listOfSearchSPCode.some(SPCode => item.SPCode.indexOf(SPCode) !== -1) : true);
  //   const data = this.gridData.filter(item => filterFunc(item));
  //   /** sort data **/
  //   if (this.sortName && this.sortValue) {
  //     this.gridDisplayData = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[ this.sortName ] > b[ this.sortName ] ? 1 : -1) : (b[ this.sortName ] > a[ this.sortName ] ? 1 : -1));
  //   } else {
  //     this.gridDisplayData = data;
  //   }
  // }
  // //Functions- search and sor end..

  // preview(type) {

  
  //   let json: any;
  //   this.listOfSPCode = [];
  //   json = {
  //     "batchStatus": "false",
  //     "detailArray":
  //        [{
  //          "EUser": this.currentUser.userCode,
  //          "SPCODE": this.model.spcode ? this.model.spcode.SpCode : '',
  //          "isHtml": type == 'D' ? 'Y' : '',
  //          "validityFrom": this.model.licenseFrom ? moment(this.model.licenseFrom).format(AppConfig.dateFormat.apiMoment) : '',
  //          "validityTo": this.model.licenseTo ? moment(this.model.licenseTo).format(AppConfig.dateFormat.apiMoment) : '',
  //        }],
  //     "requestId": "16",
  //     "outTblCount": "0",
  //     }
  //     if (type == 'D') {
  //       let reqParam = json;    
  //       reqParam['fileType'] = 1;
  //       reqParam['fileOptions'] = {'pageSize': 'A3R'};
  //       this.dataServ.generateReport(reqParam).then((response) => {
  //         if(response.errorMsg != undefined && response.errorMsg !=''){
  //             this.notif.error(response.errorMsg,'');
  //             return;
  //         }else if (response.errorCode == 0) {
  //           this.notif.success("File downloaded successfully",'');
  //         }
           
  //       }, ()=>{
  //         this.notif.error("Server encountered an Error",'');
  //       });
  //     }else {
    
  //     this.dataServ.getResponse(json).then((response) =>  {

  //       if (response && response[0] && response[0].rows.length > 0) {
  //         this.gridData = this.utilServ.convertToResultArray(response[0]);
  //         this.gridColumns = response[0].metadata.columns;
  //         if (type == 'V') {
  //           for (var i = 0; i < this.gridData.length; i++) {
  //             this.listOfSPCode.push({"text":this.gridData[i].SPCode,"value":this.gridData[i].SPCode})
  //           }
  //           this.listOfSPCode = [...this.listOfSPCode];
  //           this.gridDisplayData = [ ...this.gridData ];
  //         }else  {
  //           this.Excel(this.gridColumns,this.gridData);
  //         }
          
  //       }else {
  //         this.notif.error("No data found",'');
  //       } 
  //     })
  //   }
  // }

  // //export to excel
  // Excel(colums,data){
  //   let tableHeader;
  //   this.html = "<table><tr>";
  //       tableHeader = colums;
  //       for (let i = 0; i < tableHeader.length; i++) {
  //           this.html = this.html + "<th>" + tableHeader[i] + "</th>";
  //       }
  //       this.html = this.html + "</tr><tr>";
  //       for (let i = 0; i < data.length; i++) {
  //           for (let j = 0; j < tableHeader.length; j++) {
  //               this.html = this.html + "<td>" + data[i][tableHeader[j]] + "</td>";
  //           }
  //           this.html = this.html + "<tr>";
  //       }
  //       this.html = this.html + "</tr><table>";

  //       let blob = new Blob([this.html], {
  //           type: "application/vnd.ms-excel;charset=charset=utf-8"
  //       });
  //       FileSaver.saveAs(blob, "SpLicenseExpiryReport.xls");
  // }

  // // exportExcel() {
  // //   let blob = new Blob([document.getElementById('splicenseExp').innerHTML], {
  // //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
  // //       });
  // //    FileSaver.saveAs(blob, "SpLicenseExpiryReport.xls");
  // // }

}
