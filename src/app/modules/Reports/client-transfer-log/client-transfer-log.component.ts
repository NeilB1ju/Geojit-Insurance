import { Component, OnInit, ViewChild } from '@angular/core';
import { FormHandlerComponent, UtilService } from 'shared';
import { FindOptions } from "shared";
import { FindType } from "shared";
import { DataService } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-client-transfer-log',
  templateUrl: './client-transfer-log.component.html',
  styleUrls: ['./client-transfer-log.component.less']
})
export class ClientTransferLogComponent implements OnInit {
  client: any
  clientFindopt: FindOptions;
  ClientlogList: any;
  ClientlogListTd: any;
  ShowLogTable: boolean = false
  currentUser: User;
  checked: boolean = true
  checkedFlag: any = 'F'
  valid: any
  Records: any[];
  Columns: any;
  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;

  constructor(
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notification: NzNotificationService) {
    this.clientFindopt = {
      findType: FindType.ClientLog,
      //  findType: 1022,
      codeColumn: 'ClientID',
      codeLabel: 'Client Id',
      descColumn: 'ClientFirstName',
      descLabel: 'Name',
      title: 'Client',
      requestId: 2
    }
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    })
  }
  resetForm() {

    this.ClientlogList = []
    this.ClientlogListTd = []
    this.client = null
    this.checked = true
  }
  cleardataclient() {
    this.ClientlogList = []
    if (this.client)
      this.checked = false
    else
      this.checked = true
    //  if (this.checked==true){
    //  this.client=''
    //  }
    //  else{
    //    this.client=this.client
    //  }

  }

  cleardatacheck() {
    this.ClientlogList = []
    if (this.checked == true)
      this.client = null
  }
  validateView() {
    if (this.checked == false && !this.client) {
      this.notification.error("Please select any Option", '')
      return false
    }
    return true
  }
  preview(excelExport) {

    debugger
    this.ClientlogList = []
    this.valid = this.validateView()
    if (this.valid) {
      this.checked
      if (this.checked == true) {
        this.checkedFlag = 'T'
        this.client = null
      }
      else {
        this.checkedFlag = 'F'

        //  this.client=this.client?this.client.ClientID:null
      }

      this.ShowLogTable = true

      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{

            clientID: this.checkedFlag == 'T' ? 0 : this.client ? this.client.ClientID : 0,
            EUser: this.currentUser.userCode
          }],
        "requestId": "104",
        "outTblCount": "0"
      }).then((response) => {
        this.currentUser.userCode
        debugger

        if (response && response[0] && response[0].rows.length > 0) {
          if (excelExport == 0) {
            this.ClientlogList = this.utilServ.convertToObject(response[0]);
            debugger
            this.ClientlogList
            this.ClientlogListTd = Object.keys(this.ClientlogList[0])
          }
          if (excelExport == 1) {

            this.Records = this.utilServ.convertToResultArray(response[0]);
            this.Columns = response[0].metadata.columns;
            this.utilServ.Excel(this.Columns, this.Records, '')
          }
        }
        else {
          this.notification.error("No data Found", '')
        }

      })

    }
  }

  ngOnInit() {
    debugger
    this.resetForm()
    // this.formHdlr.setFormType('report');
    this.formHdlr.config.showPreviewBtn = true;
    this.formHdlr.config.showExportExcelBtn = true;
    this.formHdlr.config.showFindBtn = false;
    this.formHdlr.config.showSaveBtn = false;
    this.formHdlr.config.showFindBtn = false;
  }

}
