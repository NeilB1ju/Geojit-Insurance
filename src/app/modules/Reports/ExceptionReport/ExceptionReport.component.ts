import { Component, OnInit, AfterViewInit } from '@angular/core';

import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';

import { AppConfig } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce, flip, fadeInDown, fadeInLeft, fadeInRight, zoomIn, fadeIn } from 'ng-animate';
import { UtilService } from 'shared';

export interface ExceptionReportForm {
  tranDate: Date;
  clientCode: string;
}

@Component({
  templateUrl: './ExceptionReport.component.html',
  styleUrls: ['./ExceptionReport.component.less'],
  animations: [
    trigger('fade', [transition(':enter', useAnimation(fadeIn, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger('fadeRight', [transition(':enter', useAnimation(fadeInRight, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger('fadeLeft', [transition(':enter', useAnimation(fadeInLeft, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger('fadeDown', [transition(':enter', useAnimation(fadeInDown, {
      params: { timing: 1, delay: 0 }
    }))]),
    trigger("zooming", [transition(':enter', useAnimation(zoomIn, {
      params: { timing: 2, delay: 0 }
    }))])
  ],
})

export class ExceptionReportComponent implements OnInit {


  model: ExceptionReportForm;
  clientList: any[] = [];
  reportHtml: string;

  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  totalData: any=[];
  popupData:any=[]
  popupDataHeader:any=[]
  newData: any[];
  color: string;
  isVisible:boolean=false;
  headerdata:any
  Specifictn:any
  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,
  ) {
    
    this.model = <ExceptionReportForm>{
      tranDate: new Date()
    };
    this.authServ.getUser().subscribe(user => {
     
      this.currentUser = user;
    });
    this.getdata()
  }

  ngOnInit() {
    this.totalData=[]
//this.getdata()
   
  }
getdata(){debugger
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
    [{
      Euser: this.currentUser.userCode,
      DetailID: 0
    }],
    "requestId": "137",
    "outTblCount": "0"
  }).then((response) => {debugger
    this.isProcessing = false;
    if (response && response[0].rows.length > 0) {
   // if (response.results.length) {
      debugger
    //this.totalData=response.results
    this.totalData= this.utilServ.convertToObject(response[0])
    //response && response[0].rows
    //this.utilServ.convertToObject(response[0])
    for(var j=0;j<this.totalData.length;j++){
      this.totalData[j].color=this.getRandomColor() 
    }
  debugger
   
}
})  
}
  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    let col = '#' + ('000000' + color).slice(-6);
    return col

  }
  OpenPopup(item){
    this.Specifictn=[]
    this.popupData=[]
    this.popupDataHeader=[]
    this.headerdata=''
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
      [{
        Euser: this.currentUser.userCode,
        DetailID: item
      }],
      "requestId": "137",
      "outTblCount": "0"
    }).then((response) => {debugger
      this.isProcessing = false;
      if (response && response[0].rows.length > 0) {
      this.Specifictn=this.utilServ.convertToObject(response[0])
      this.popupData= this.utilServ.convertToObject(response[1])
      this.popupDataHeader=  Object.keys(this.popupData[0])

     
     
      this.isVisible=true
      if(this.Specifictn.length){
        this.headerdata=this.Specifictn[0].Header
      }else{
        this.headerdata=''
      }
      
  }
  })  
  }
  handleCancel(): void {
 
    this.isVisible = false;
  }
  ngAfterViewInit(){
    this.getdata()
  }
}
