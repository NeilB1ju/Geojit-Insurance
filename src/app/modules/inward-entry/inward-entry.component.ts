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
import { InputMasks } from 'shared';
import { ValidationService }  from 'shared';
import * as FileSaver from 'file-saver';
import { asWindowsPath } from '@angular-devkit/core';
import {HttpClient} from '@angular/common/http';

export interface InwardEntryForm {
  insCompany: any;
  client: any;
  applNo: string;
  product: any;
  entryID: string;
  tradecode: string;
  type: string;
  inwardType: any;
  entryDate: Date;
  BA :any;
  FinwardType:any;
  pdtCategory:any;
}

@Component({
  selector: 'app-inward-entry',
  templateUrl: './inward-entry.component.html',
  styleUrls: ['./inward-entry.component.less']
})
export class InwardEntryComponent implements OnInit {

  @ViewChild(FormHandlerComponent) formHdlr: FormHandlerComponent;
  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;
  clientFindopt: FindOptions;
  productcategoryFindopt:FindOptions;
  employeeFindopt: FindOptions;
  franchiseeFindopt: FindOptions;
  EmployeeFindopt:FindOptions;
  locationFindopt:FindOptions
  BaFindopt: FindOptions;
  model: InwardEntryForm;
  insCompList: Array<any> = [];
  paymntModeList: Array<any> = [];
  productList: Array<any> = [];
  currentUser: User;
  inputMasks = InputMasks;
  dateFormat = 'dd/MM/yyyy';
  FormControlNames : {} = {};
  gridData: Array<any> = [];
  gridColumns: Array<any> = [];
  isSpinning:boolean =false
  html;
  modifyform: boolean =true;
  ipAddress: { ip: string; };
  upperstring: string;
  franch: boolean;
  frlocation:any=[];
  Example: any;
  id: Number =0;
  Drop2: any;
  Drop1: any;

  constructor(
    private modalService: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private validServ: ValidationService,
    private authServ: AuthService,
    private notif: NzNotificationService,
    private http: HttpClient) {
      this.http.get<{ip:string}>('https://jsonip.com')
      .subscribe( data => {
        this.ipAddress = data
      })
    this.model = <InwardEntryForm>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
    this.clientFindopt = {
      findType: FindType.Client,
      codeColumn: 'ClientID',
      codeLabel: 'Client Id',
      descColumn: 'ClientFirstName',
      descLabel: 'Name',
      title: 'Client',
      requestId:2
    }
    this.employeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'EmployeeID',
      codeLabel: 'Employee ID',
      descColumn: 'Name',
      descLabel: 'Employee Name',
      title: 'Employee',
      requestId:2
    }
    this.franchiseeFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'Location',
      descColumn: 'LocationName',
      descLabel: 'LocationName',
      title: 'Location',
      whereClause: "Branch='N' or Isnull(TempBranch,'N') ='Y'",
      requestId:2
    }
    this.BaFindopt = {
      findType: 1016,
      codeColumn: 'UserCode',
      codeLabel: 'BACode',
      descColumn: 'Name',
      descLabel: 'BAName',
      title: 'BA',
      requestId:2
     

    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      requestId: 2
    }
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'Code',
      codeLabel: 'EmployeeCode',
      descColumn: 'Name',
      descLabel: 'Employee',
      requestId: 2
    }
    this.productcategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: 'CategoryCode',
      codeLabel: 'CategoryCode',
      descColumn: 'CategoryName',
      descLabel: 'CategoryName',
      title: 'Product Category',
      hasDescInput: false,
      // whereClause: this.id!=0? "ProductTypeId =" + this.id :"1=1" ,
      requestId: 2
    }
  }

  ngOnInit() {

    let res = this.currentUser.userCode.substring(0, 2);
    this.upperstring = res.toUpperCase()
    if (this.upperstring == 'FR') {
      this.franch = true
     this.model.type ='F'
      this.getfranch()
    }
    else {
      this.model.type ='E'
    }


    this.model.applNo = '';
    this.model.client = '';
    this.model.entryID = null;
    this.model.insCompany = '';
    this.model.product = null;
    this.model.tradecode = '';
    this.model.insCompany=null;
    this.model.pdtCategory=null;
    // this.productList =[];
    this.formHdlr.config.showModifyBtn = false;
    
    this.formHdlr.config.isModifyState = false;
    this.formHdlr.setFormType('default'); 
    this.formHdlr.config.showDeleteBtn = false;
    // this.model.type = 'E';
    this.model.inwardType = '';
    this.model.entryDate = new (Date);
    this.getInitData();
  }

  Reset() {
    this.ngOnInit();
    this.modifyform =true
    this.productcategoryFindopt = {
        findType: FindType.ProductCategory,
        codeColumn: 'CategoryCode',
        codeLabel: 'CategoryCode',
        descColumn: 'CategoryName',
        descLabel: 'CategoryName',
        title: 'Product Category',
        hasDescInput: false,
        requestId: 2
   }
  }
  getfranch() {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          user: this.currentUser.userCode,

        }],
      "requestId": "56",
      "outTblCount": "0"
    })
      .then((response) => {
        if (response && response[0].rows.length > 0) {
          this.frlocation = this.utilServ.convertToObject(response[0]);
          this.frlocation = [...this.frlocation];
          this.model.FinwardType = { Location: this.frlocation[0].Location, LocationName: this.frlocation[0].LocationName };
          this.franch = true;
         
        } else if (response.errorMsg) {
          this.franch = false
        }
      });




  }

  exportData() {
   
    let json: any;
    json = {
      "batchStatus": "false",
      "detailArray":
         [{
           "EUser": this.currentUser.userCode,
           "InsCompanyId": this.model.insCompany        
         }],
      "requestId": "37",
      "outTblCount": "0",
      }
     
      this.dataServ.getResponse(json).then((response) =>  {
        if (response && response[0] && response[0].rows.length > 0) {
          this.gridData = this.utilServ.convertToResultArray(response[0]);
          this.gridColumns = response[0].metadata.columns;
          this.Excel(this.gridColumns,this.gridData);         
        } 
      })    
  }

  //export to excel
  Excel(colums,data){
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
        FileSaver.saveAs(blob, "ReconciliationReport.xls");
  }

  Search() {
    var reqParams;
    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SEARCHTYPE": FindType.InwardEntrySearch, "INITIALSEARCH": "N", "WhereClause": "", "LANGID": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }

    this.lookupsearch.actionOpen(reqParams, 'Inward Entry');
  }
  onLookupSelect(record) {debugger
    this.model.entryID = record.EntryId;
    this.formHdlr.config.isModifyState = true;
 
    
     if (this.model.entryID) {
      this.RetrieveEntryDet();
     }
    // // this.isModifyState =true
    this.modifyform=false
    this.formHdlr.config.showModifyBtn = true;
    this.formHdlr.config.showDeleteBtn = false;
    this.formHdlr.config.isModifyState = false;
      this.formHdlr.config.showSaveBtn = false;
  }

  RetrieveEntryDet() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray": [{
        "EntryID": this.model.entryID,
        "EUser": this.currentUser.userCode
      }],
      "myHashTable": {},
      "requestId": 21,
      "outTblCount": "0"
    })
      .then((response) => {debugger

        let res;
        if (response && response[0] && response[0].rows.length > 0) {
          res = this.utilServ.convertToObject(response[0]);
          this.model.applNo = res[0].ApplicationNo;
          this.model.insCompany = res[0].InsCompanyID;
          if(this.model.insCompany)
          {
            this.getProduct(2);
          }
          
         
          this.model.tradecode = res[0].Tradecode;
          this.model.entryDate = res[0].EntryDate;
          this.model.type = res[0].LGType;
          this.model.client = { tradecode: res[0].Tradecode, ClientFirstName: res[0].ClientFirstName, ClientID: res[0].ClientID };
          let inwardType = res[0].LGType == 'E' ? { EmployeeID: res[0].LGCode, Name: res[0].name } : { Location: res[0].Location, LocationName: res[0].name };
          this.model.inwardType=inwardType.EmployeeID?{EmployeeID:inwardType.EmployeeID,Name:inwardType.Name,Code:inwardType.EmployeeID}:'';
          this.model.FinwardType=inwardType.Location?{Location:inwardType.Location,LocationName:inwardType.Name}:'';
          this.model.BA=this.model.inwardType.Location?this.model.inwardType.Location:'';
          this.model.pdtCategory= res[0].CatID?{ CategoryID:res[0].CatID,CategoryCode:'',CategoryName:'' }:''
          if(  this.model.pdtCategory )
          {
          

             this.getProductcat()
          
          }
          {
          this.model.product = res[0].Product;
          }

   
          // this.model.entryDate = res[0].EntryDate;
        } else if (response.errorMsg) {
          this.notif.error(response.errorMsg, '');
        }
      });
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
      if (response && response[0]) {
        this.insCompList = this.utilServ.convertToObject(response[0]);
         this.model.insCompany = this.insCompList[1].Code;
        if (this.model.insCompany) {
          this.getProduct(1);
        }
      } else {
        // this.notif.error = "No Data Found";
      }
    });

    //payment mode list
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 19
        }],
      "requestId": "4"
    }).then((response) => {
      if (response && response[0]) {
        this.paymntModeList = this.utilServ.convertToObject(response[0]);

      } else {
        // this.notif.error = "No Data Found";
      }
    });

  }

  getProduct(data) {debugger
    this.onchangepdtCategory()
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray": [{
        "SEARCHTYPE": FindType.Product,
        "INITIALSEARCH": "N",
        "WHERECLAUSE": " InsCompanyId= '" + this.model.insCompany + "'",
        "LANGID": 1
      }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    })
      .then((response) => {
        if (response && response[0] && response[0].rows.length > 0) {
          this.productList = this.utilServ.convertToObject(response[0]);
          if(data =2)
          {
            this.model.product =this.model.product 
          }
          else
          {
            this.model.product = this.productList[0].ProductId;
          }
         
        } else if (response.errorMsg) {
          this.notif.error(response.errorMsg, '');
        }
      });
      this. getCat(this.model.insCompany)
     this. getfielddatawithcompany(this.model.insCompany)
  }

  getfielddatawithcompany(data)
  {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          Compantid:data?data:0

        }],
      "requestId": "81",
      "outTblCount": "0"
    })
      .then((response) => {
        if (response && response[0].rows.length > 0) {
          let data  = this.utilServ.convertToObject(response[0]);
         this.Drop1=data[0].Drop1
         this.Drop2=data[0].Drop2
        }
      })

  }

  Save(form) {debugger

    if (!this.model.client) {
      this.notif.error("Please select client", '');
      return;
    }

    if(this.Drop1 == 'P')
    {
    if (!this.model.product) {
      this.notif.error("Please select Product", '');
      return;
    }
  }
    else
    {
      if (this.model.pdtCategory == '' || this.model.pdtCategory == null || this.model.pdtCategory == undefined )
      {
       this.notif.error("Please Product category",'');
       return;
     }
    }

    if (!this.model.inwardType) {
      if (this.model.type == 'E') {
        this.notif.error("Please select employee",'');
        return;
      }
      if (this.model.type == 'E')
       {
        this.notif.error("Please select franchisee",'');
        return;
      }
    }
 

  
      
    

    // let isValid = this.validServ.validateForm(form,this.FormControlNames);
    // if (!isValid)
    //   return;
this.isSpinning=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "IorU": this.formHdlr.config.isModifyState ? 'U' : 'I',
          "EntryID": this.model.entryID ? this.model.entryID : 1,
          "InsCompanyID": this.model.insCompany,
          "ApplicationNo": this.model.applNo,
          "ClientID": this.model.client.ClientID,
          "Product": this.model.product?this.model.product:0,
          "LGType": this.model.type,
          "ProductCat":this.model.pdtCategory?this.model.pdtCategory.CategoryID:0,
          // "LGCode": this.model.type == 'E' ? this.model.inwardType.EmployeeID : this.model.inwardType.Location,
          
          "LGCode": this.model.type == 'E'?this.model.inwardType.EmployeeID:this.model.type=='F'?this.model.FinwardType.Location:this.model.BA,
          "EntryDate": this.model.entryDate ? moment(this.model.entryDate).format(AppConfig.dateFormat.apiMoment) : '',
          "Euser": this.currentUser.userCode

        }],
      "requestId": "20",
      "outTblCount": "0"
    })
      .then((response) => {debugger
        this.isSpinning=false

        let res1, res2, msg;
        if (this.formHdlr.config.isModifyState) {
          if (response.errorCode == 0) {
            this.notif.success("Data modified sucessfully", '');
          } else {
            this.notif.error(response.errorMsg, '');
          }
        } else {
          if (response && response.length || response.errorCode ==0) {
            res1 = this.utilServ.convertToObject(response[0]);
            if (res1[0].EntryID) {debugger
              this.model.entryID = res1[0].EntryID;
              this.formHdlr.config.isModifyState = true;
              this.formHdlr.config.showDeleteBtn = true;
              this.notif.success("Data saved successfully", '');
            }
            this.Reset();
          } else if (response.errorMsg) {debugger
            this.notif.error(response.errorMsg, '');
          }
        }
      });
  }
  onChangeIntroducer(data) {

    if (data) {
if(!this.formHdlr)
      // if (this.model.client)
      //   this.model.client = '';
      if (this.model.applNo)
        this.model.applNo = '';
      if (this.model.product)
        this.model.product = this.getProduct(1);
      if (this.model.entryDate)
        this.model.entryDate = new (Date);
      if (this.model.inwardType)
        this.model.inwardType = '';


    }
  }


//   getintro(data)
//   {

   

// if(data)
// {
//     this.dataServ.getResponse({
//       "batchStatus": "false",
//       "detailArray":
//         [{
          
//           "ClientID": data.ClientID?data.ClientID:'',
         

//         }],
//       "requestId": "50",
//       "outTblCount": "0"
//     })
//       .then((response) => {

       
//           if (response[0]) {
//            let  res1 = this.utilServ.convertToObject(response[0]);
           
//           this.model.type=res1[0].leadtype;
//           if(this.model.type =='E')
//           {
//           this.model.inwardType=res1[0].leadcode;
//           }
//           else if(this.model.type =='F')
//           {
//             this.model.FinwardType=res1[0].leadcode;
//           }
//           else if(this.model.type =='B'){
//            this. model.BA=res1[0].leadcode;
//           }
        
            
//           }
//         }
      
//       );
//     }
//   }


    modify()
    {
      this.modifyform=true
      this.formHdlr.config.showModifyBtn = false;
      this.formHdlr.config.isModifyState = true;
      this.formHdlr.config.showDeleteBtn = true;
      this.formHdlr.config.showSaveBtn = true;
      // this.isModifyState =true
    }


    delete()
    {
      // console.log('IP',this.ipAddress)
    //insurance company list
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          "EntryID": this.model.entryID,
          "Euser": this.currentUser.userCode,
          "IP":'1'
        }],
      "requestId": "60"
    }).then((response) => {
      if (response.errorCode ==0) {
        this.notif.success('Deleted Successfully', '');
        this.Reset()
        }
      else {
        this.notif.error('Execution Faild', '');
      }
    });
  }

   
  getProductcat()
  {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          CatId:this.model.pdtCategory.CategoryID?this.model.pdtCategory.CategoryID:0,
          Euser:this.currentUser.userCode
        }],
      "requestId": "72"
    }).then((response) => {debugger
      if (response && response[0]) {
    let catlist = this.utilServ.convertToObject(response[0]);
    if(catlist)
    this.model.pdtCategory= catlist[0].CategoryID?{ CategoryID:catlist[0].CategoryID,CategoryCode:catlist[0].CategoryCode,CategoryName:catlist[0].CategoryName }:''
      } else {
      
      }
    });
  } 


  onchangepdtCategory()
  {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompanyId:this.model.insCompany ? this.model.insCompany:0,
          Euser:this.currentUser.userCode
        }],
      "requestId": "73"
    }).then((response) => {debugger
      if (response && response[0]) {
    let data = this.utilServ.convertToObject(response[0]);
    this.Example = data[0].eg
      } else {
      
      }
    });

  }

  getCat(data)
  {

    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          CompanyId:data,
          Euser: this.currentUser.userCode
        }],
      "requestId": "77"
    }).then((response) => {
      if (response && response[0]) {debugger
      let res = this.utilServ.convertToObject(response[0]);
      this.id =res[0].Id?res[0].Id:0
    this.productcategoryFindopt = {
      findType: FindType.ProductCategory,
      codeColumn: 'CategoryCode',
      codeLabel: 'CategoryCode',
      descColumn: 'CategoryName',
      descLabel: 'CategoryName',
      title: 'Product Category',
      hasDescInput: false,
      whereClause: this.id!=0? "ProductTypeId =" + this.id :"1=1" ,
      requestId: 2
    }

      } else {
        // this.notif.error = "No Data Found";
      }
    });

  }

}
