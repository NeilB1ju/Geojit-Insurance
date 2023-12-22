import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { DataService, LookUpDialogComponent } from 'shared';
import { UtilService } from 'shared';
import { UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService } from 'shared';
import { User } from 'shared/lib/models/user';
import * as FileSaver from 'file-saver';
import { FindOptions } from 'shared';
import { FindType } from 'shared';
import * as  jsonxml from 'jsontoxml';


export interface clientmergingForm {
  Clientid: any;
  insCompany: string;
  file: any;
  product: any;
  Tradecode:any;
  DPId:any;
  Pan:any;
  Location: any;
  PAN: any;
  Mobile: any;
  Email: any;
  Address: any;
  Name: any;

}

@Component({
  selector: 'app-clientmerging',
  templateUrl: './clientmerging.component.html',
  styleUrls: ['./clientmerging.component.less']
})
export class clientmergingComponent implements OnInit {

  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;

  model: clientmergingForm;
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
  clientid: number;
  CName: boolean = true;
  masterid:any;
  isSpinning:boolean=false;
  isVisible:boolean=false;  

  CAddress: boolean = true;
  CEmail: boolean = true;
  CMobileC: boolean = true;
  CPAN: boolean = true;
  CDPId:boolean=true;
  Findlist: any=[];
  tablelist: any=[];
  masterClient: any;
  arrey: any =[];
  policytable: any;
  policydata: any=[];
  policyheader: string[];
  columnArray: any;

  constructor(
    private modalService: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService
  ) {
    this.model = <clientmergingForm>{

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
    
  }


  view()
  {
this.isSpinning=true
this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Email:this.CEmail && this.model.Email?this.model.Email:'',
          Pan:this.CPAN && this.model.PAN?this.model.PAN:'',
          Mobile:this.CMobileC && this.model.Mobile?this.model.Mobile:'',
          DPid:this.CDPId && this.model.DPId?this.model.DPId:'',
          Address:this.CAddress && this.model.Address?this.model.Address:'',
          Euser:this.currentUser.userCode,
          Clientname:this.CName && this.model.Name?this.model.Name:''
        }],
      "requestId": "80"
    }).then((response) => {debugger
      this.isSpinning=false

      if (response && response.errorMsg) {
        this.notif.error(response.errorMsg,'');
      }
      else {
        this.tablelist = this.utilServ.convertToObject(response[0]);

        if(this.tablelist.length == 0)
        {
          this.notif.error('No data','');
          
        }else
        {

          this.tablelist.forEach((element,index) => {
            element.Counter=index
          });
        }
      }
    });

  }
  Search() {
  
     
    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": 1020, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }


    this.lookupsearch.actionOpen(reqParams, 'clients');
    this.clientid = 1
  }

  onLookupSelect(data) { 
    this.tablelist=[]
    this.model.Clientid = data.ClientID;
    this.getclientdetails();
  }
  getclientdetails() {
     
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "clientid": this.model.Clientid
        }],
      "requestId": "33",
      "outTblCount": "0"
    })
      .then((response) => {debugger
        let res1
        res1 = this.utilServ.convertToObject(response[0]);
         console.log(res1)
        this.model.Name = res1[0].ClientFirstName;
        this.model.Mobile = res1[0].MobileNo;
        // this.model.MaritalStatus=res1[0].;
        // this.model.Natinality = res1[0].;
        this.model.Email = res1[0].Email
        
        this.model.DPId = res1[0].DPID;
        this.model.Tradecode = res1[0].TradeCode;
        this.model.PAN = res1[0].PANNumber;
         this.model.Address=res1[0].ContactAddress1+','+res1[0].ContactAddress2+','+res1[0].ContactAddress3




   
 
      });

  }

  onchange() {
    this.tablelist = []
  }

  MasterClientid(data,index)
  {
    debugger
    if(this.tablelist[index].master==false)
    {
      this.masterClient=null
    }
    else
    {
      this.masterClient=data.ClientID
    }
      
     
      for(let i=0;i<this.tablelist.length;i++)
      {
        if(i != index)
        {
        this.tablelist[i].master=false
        }
      }
      // this.tablelist.forEach(element => {
      //   element.master=false
      // });
      // this.tablelist[index].master=true
  }

  Merge(){
  this.modalService.confirm({
    nzTitle: '<i>Confirmation</i>',
    nzContent: '<b>Are you sure want to merge this clients ?</b>',
    nzOnOk: () =>{this.Merge1()}
  });
}

  Merge1()
  {
  
    this.arrey=[]

    if(this.masterClient == '' || this.masterClient == null || this.masterClient == undefined )
    {
        this.notif.error('Select a master client ','')
      return;
    }
    for(let i=0;i<this.tablelist.length;i++)
    {
     if(this.tablelist[i].checked ==true)
      this.arrey.push(this.tablelist[i])

    }
    if(this.arrey == [] || this.arrey.length == 0 )
    {
       this.notif.error('Select clients to merge','')
      return;
    }
    if( this.arrey.length < 2 )
    {
       this.notif.error('Select atleast 2 clients to merge','')
      return;
    }

    var JSONData = this.utilServ.setJSONArray(this.arrey);
    let XMLDATA = jsonxml(JSONData);
    XMLDATA = XMLDATA.replace(/&/gi, '#||')
    this.isSpinning=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "MasterClientid": this.masterClient?this.masterClient:0,
          "XML":XMLDATA,
          "Euser":this.currentUser.userCode
        }],
      "requestId": "84",
      "outTblCount": "0"
    })
      .then((response) => {debugger
        this.isSpinning=false

        if(response.errorCode ==0 && !response.errorMsg)
        {

          this.notif.success('Success','')

          this.reset()
        }
        else
        {
          this.notif.error(response.errorMsg,'')
        }
      })


  }
  changechecked(index)
  {
    this.tablelist[index].master =false;
    this.masterClient=this.masterClient?this.masterClient:''
  }


  reset()
  {
    this.tablelist=[];
    this.model.Name='';
    this.model.Address='';
    this.model.Mobile='';
    this.model.PAN='';
    this.model.DPId='';
    this.model.Email=''
    this.masterClient=''
    this.CName=true;
    this.CMobileC=true;
    this.CPAN=true;
    this.CAddress=true;
    this.CEmail=true;
    this.CDPId=true;
  }

  Getpolicyno(data)
  {debugger

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Clientid:data.ClientID,
          Euser:this.currentUser.userCode
        }],
      "requestId": "85",
      "outTblCount": "0"
    })
      .then((response) => {debugger
        if(response  )
        {
          let data1 =[]
            data1=  this.utilServ.convertToObject(response[0]);
            if(data1.length)
            {
          this.policytable = response[0].metadata.columnsTypes;
          this.policydata = this.utilServ.convertToObject(response[0]);
          this.policyheader = Object.keys(this.policydata[0]);
          for (var i = 0; i < this.policytable.length; i++) {
            if (this.policytable[i] == "numeric") {
              this.columnArray.push(this.policyheader[i]);
            }
          }
        }
        this.isVisible=true
        }

       
          
        
        
  })
}

handleCancel()
{
  this.isVisible=false
}


}

