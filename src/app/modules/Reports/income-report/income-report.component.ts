import { Component, OnInit,ViewChild } from '@angular/core';
import { FindOptions } from "shared";
import { FormHandlerComponent } from 'shared';
import { FindType } from "shared";
import { UtilService } from 'shared';
import { DataService } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import * as FileSaver from 'file-saver';

export interface TreeNodeInterface {
  key: number;
  Id: number;
  NAME: string;
  LNB_NOP: any;
  LNB_PREMIUM: any;
  LNB_INCOME: any;
  LFY_NOP: any;
  LFY_PREMIUM: any;
  LFY_INCOME: any;
  LRB_NOP: any;
  LRB_PREMIUM: any;
  LRB_INCOME: any;
  LRB_NOP_MIS: any;
  LTOT_NOP: any;
  LTOT_PREMIUM: any;
  LTOT_INCOME: any;
  GNB_NOP: any;
  GNB_PREMIUM: any;
  GNB_INCOME: any;
  GPOR_NOP: any;
  GPOR_PREMIUM: any;
  GPOR_INCOME: any;
  GRB_NOP: any;
  GRB_PREMIUM: any;
  GRB_INCOME: any;
  GRB_NOP_MIS: any;
  GTOT_NOP: any;
  GTOT_PREMIUM: any;
  GTOT_INCOME: any;

  expand: boolean;

  children?: TreeNodeInterface[];
}

@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrls: ['./income-report.component.less']
})

export class IncomeReportComponent implements OnInit {
  @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;
  State:any
  stateFindopt: FindOptions;
  locationFindopt: FindOptions;
  RegionFindopt: FindOptions;
  SpFindopt: FindOptions;
  EmployeeFindopt: FindOptions;
  Location:any
  Region:any
  stateCodeValue: string;
  spCode:any
  Employee:any
  businessArr: Array<any> = [];
  ForB:any
  currentUser: User;
  company:any
  CompList:any=[]
  policystatus:any
  policylist:any=[]
  dateFrom:any
  dateTo:any
  dateFormat :any ='dd/MM/yyyy'
  lifeFill:any
  generalFill:any
  life:any
  general:any
  dataFill:any=[]
  businessDone:any
  visibleDrawer:boolean=false
  drawerPlacement:any='top'
  drawerContent:any
  drawerContentTxt:any
  regionvalue: any;
  isSpinning:boolean=false;
  treeData: Array<TreeNodeInterface> = [];
  mapOfExpandedData: any = {};
  isVisible = false;
  exportModal=false
  tabledata: any=[];
  headerdata: any;
  exporttypeList:any=[]
  exportType:any
  exportypedata:any
  Records: Array<any> = [];
  Columns: Array<any> = [];
  html: string;
  constructor(
    private utilServ: UtilService,
    private dataServ: DataService,
    private authServ: AuthService,
    private notification: NzNotificationService,
  ) { 
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user
    });
    this.stateFindopt = {
      findType: FindType.State,
      codeColumn: 'State',
      codeLabel: 'SateCode',
      descColumn: 'State',
      descLabel: 'State',
      title: 'State',
      hasDescInput: false,
      requestId: 2

    }
    this.RegionFindopt = {
      findType: FindType.Region,
      codeColumn: 'Region',
      codeLabel: 'RegionCode',
      descColumn: 'RegionName',
      descLabel: 'Region',
      hasDescInput: false,
      title: 'Region',
      requestId: 2,
      whereClause:''

    }
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      hasDescInput: false,
      title: 'Location',
      requestId: 2,
      whereClause:''

    }
    this.SpFindopt = {
      findType: FindType.SPCODE,
      codeColumn: 'SpCode',
      codeLabel: 'SpCode',
      descColumn: 'SpCode',
      descLabel: 'SpCode',
      title: 'SP',
      hasDescInput: false,
      requestId: 2

    }
    this.EmployeeFindopt = {
      findType: FindType.Employee,
      codeColumn: 'Code',
      codeLabel: 'EmployeeCode',
      descColumn: 'Name',
      descLabel: 'Employee',
      hasDescInput: false,
      title: 'Employee',
      requestId: 2

    }
  }

  ngOnInit() {
  this.formHandler.config.showPreviewBtn = true;
    this.getBusinessdone()
  this.getInsuranceCompany() 
  this.getInspolicy()
  this.formHandler.setFormType('report');
  this.formHandler.config.showExportPdfBtn = false;
  this.formHandler.config.showExportExcelBtn = true;
  this.formHandler.config.showCancelBtn=false
  this.formHandler.config.showSaveBtn=false
 
  this.getLifedetails()
  this.getgeneraldetails()
  // this.dateFrom=new Date()
  debugger
  
    let firstday=new Date()
    this.dateFrom=new Date(firstday.getFullYear(), firstday.getMonth(), 1)
  this.getDate()
  this.getexportype()
 
  }
  sortstate(data)
  {
     debugger
    if(data == null)
    {
      this.stateCodeValue =''
  
    }else
    {
      this.stateCodeValue =data.State
    }
  
    this.locationFindopt = {
      findType: FindType.Location,
      codeColumn: 'Location',
      codeLabel: 'LocationCode',
      descColumn: 'LocationName',
      descLabel: 'Location',
      hasDescInput: false,
      requestId: 2,
      whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
    }
  
      this.RegionFindopt = {
        findType: FindType.Region,
        codeColumn: 'Region',
        codeLabel: 'RegionCode',
        descColumn: 'RegionName',
        descLabel: 'Region',
        hasDescInput: false,
        requestId: 2,
        whereClause :this.stateCodeValue?"REPORTINGSTATE ='" + this.stateCodeValue  + "'": ''
      }
  this.Location=null;
  this.Region=null;
  this.reset_tabledata()
  }
  onchange_reg(data)
{ 
  if(data == null)
  {
    this.stateCodeValue =''

  }else
  {
    this.regionvalue =data.RegionName
  }

  this.locationFindopt = {
    findType: FindType.Location,
    codeColumn: 'Location',
    codeLabel: 'LocationCode',
    descColumn: 'LocationName',
    descLabel: 'Location',
    hasDescInput: false,
    requestId: 2,
    whereClause :this.regionvalue?"regionname ='" + this.regionvalue  + "'": ''
  }
  this.Location=null;
  this.reset_tabledata()
}

convertTreeToList(root: object): TreeNodeInterface[] {debugger
  const stack = [];
  const array = [];
  const hashMap = {};
  stack.push({ ...root, level: 0, expand: false });

  while (stack.length !== 0) {
    const node = stack.pop();
    this.visitNode(node, hashMap, array);
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
      }
    }
  }

  return array;
}
visitNode(node: TreeNodeInterface, hashMap: object, array: TreeNodeInterface[]): void {
  if (!hashMap[node.key]) {
    hashMap[node.key] = true;
    array.push(node);
  }
}
collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
  if ($event === false) {
    if (data.children) {
      data.children.forEach(d => {
        const target = array.find(a => a.key === d.key);
        target.expand = false;
        this.collapse(array, target, false);
      });
    } else {
      return;
    }
  }
}

  getBusinessdone() {
    debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 36
        }],
      "requestId": "4"
    }).then((response) => {
debugger
      let res;
      if (response && response[0]) {
        this.businessArr = this.utilServ.convertToObject(response[0]);
        this.businessDone = this.businessArr[0].Code;
      } else {

      }
    });
  }
  getInsuranceCompany() { 
    debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser: this.currentUser.userCode,
          InsuerType: 0
        }],
      "requestId": "139"
    }).then((response) => {
       
      debugger
      let res;
      if (response && response[0]) { 
        this.CompList = this.utilServ.convertToObject(response[0]);
        this.company = this.CompList[0].Code;
      } else {
  
      }
    }); 
  }
  onchange()
  { 
    let length =this.policystatus.length;
    // window.alert(length);
    if(this.policystatus[0]=='ALL' && length ==1)
    {
       return;
    }
    else
    { 
      for(let i=0;i<length;i++)
      {
        let modeldata = this.policystatus[i];
        let data2 = this.policystatus[i+1];
       
        if(modeldata =='ALL' && length == 2)
        {
          this.policystatus.splice(i, 1);
        }
        else if(data2 =='ALL' && length == 2)
        {
          this.policystatus=null;
          this.policystatus='ALL'
          break;

        }
        else if(modeldata =='ALL' && length >2)
        {
          this.policystatus=null;
          this.policystatus='ALL'
          break;
        }
        

       
      }
    }
    this.reset_tabledata();
  
  }
  getInspolicy() {debugger
    debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser :this.currentUser.userCode,
          insureType :0
        }],
      "requestId": "123"
    }).then((response) => {
      debugger
      let res;
      if (response && response[0]) {
        this.policylist = this.utilServ.convertToObject(response[0]);
        console.log(this.policylist,'gsdftadgyasuydfaytdfy')
        this.policystatus = this.policylist[0].Code;
      } else {

      }
    });
  }
  getDate()
  {
    debugger
    // var firstday
    // firstday=new Date()
    // this.dateFrom=new Date(firstday.getFullYear(), firstday.getMonth(), 1)
  
    let dt = this.dateFrom
    this.dateTo= new Date(dt.getDate())
 
    var year = dt.getFullYear();
    var month = dt.getMonth();
    var day = dt.getDate();
    this.dateTo = new Date(year, month, day +364);   
    this.reset_tabledata()
  }
  
  getgeneraldetails() { 
    debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser        : this.currentUser.userCode,
          categoryiD   : 2,
        }],
      "requestId": "120"
    
    }).then((response) => {
       
      debugger
      let res;
      if (response && response[0]) { 
        this.generalFill = this.utilServ.convertToObject(response[0]);
         this.general = this.generalFill[0].id;
      } else {
  
      }
    }); 
  }
  getLifedetails()
  {
    debugger
        this.dataServ.getResponse({
           "batchStatus": "false",
           "detailArray":
                    [{
                      Euser        : this.currentUser.userCode,
                      categoryiD   : 1,
                    }],
           "requestId": "120",
           "outTblCount": "0"
        }).then((response) => {debugger

                    if (response && response[0] && response[0].rows.length > 0) {
                        this.lifeFill=this.utilServ.convertToObject(response[0]);    
                         this.life = this.lifeFill[0].id;
                    }
                    else {
                    }

                })
  } 
  preview() {
    this.dataFill=[]
    let data = this.policystatus.toString();
    let a = this.validate()
    if (a)
    {
      this.isSpinning=true
            this.dataServ.getResponse({
              "batchStatus": "false",
              "detailArray":
                [{
                  
                  exportType    : this.exportypedata?this.exportypedata:'',
                  dateFrom      : moment(this.dateFrom).format(AppConfig.dateFormat.apiMoment),
                  dateTo        : moment(this.dateTo).format(AppConfig.dateFormat.apiMoment),
                  general       : this.general?this.general:0,
                  life          : this.life?this.life:0,
                  spCode        : this.spCode?this.spCode.SpCode:'All',
                  State         : this.State?this.State.State:'All',
                  Region        : this.Region?this.Region.Region:'All',
                  Location      : this.Location?this.Location.Location:'All',
                  company       : this.company?this.company:0,
                  Employee      : this.Employee?this.Employee.EmployeeID:'All',
                  policystatus  : this.policystatus?data:'',
                  businessDone  : this.businessDone?this.businessDone:'',
                
                  ExcelExport   :0, 
                  Euser         :this.currentUser.userCode,	
                    
                }],
              "requestId": "121"
            }).then((response) => {debugger
              this.isSpinning=false
            
              if (response && response[0]  && response[0].rows.length > 0) {
               
                  // this.dataFill = this.utilServ.convertToResultArray(response[0]);
                  let companydata  = this.utilServ.convertToObject(response[0]);
                  let zoneData     = this.utilServ.convertToObject(response[1]);
                  let stateData    = this.utilServ.convertToObject(response[2]);
                  let regionData   = this.utilServ.convertToObject(response[3]);
                  let locationData = this.utilServ.convertToObject(response[4]);


          
              // if(this.dataFill.length == 0 )
              // {
              //   this.notification.error('No data found','')
              //   return
              // }
             
              locationData = locationData.map((o) => {
                o.key = "location_" + o.Id;
                // o.key =  o.Id;
                return o;
                });
     
              
              regionData = regionData.map((regdata) => {
                 regdata.key = "region_" + regdata.Id;
                // regdata.key = regdata.Id;
                regdata.children = locationData.filter((locdata) => {
                  return locdata.ParentId == regdata.Id
                });
  
                return regdata;
              });
    
               stateData = stateData.map((state) => {
                   state.key = "state_" + state.Id;
                  // state.key =state.Id;
                  state.children = regionData.filter((reg) => {
                    return reg.ParentId == state.Id
                  });
   
                  return state;
                });
                zoneData = zoneData.map((zone) => {
                   zone.key = "zone_" + zone.Id;
                  // zone.key = zone.Id;
                  zone.children = stateData.filter((sta) => {
                    return sta.ParentId == zone.Id
                  });
                  return zone;
                });
                companydata = companydata.map((company) => {debugger
                  company.ParentId = 0;
                   company.key = "company_" + company.Id;
                  // company.key = company.Id;
                  if(company.NAME !='TOTAL'){
                  company.children = zoneData.filter((zon) => {
                    return zon.ParentId == company.Id
                  });}
                  return company;
                });
               
                companydata.forEach(item => {debugger
                  // this.mapOfExpandedData[item.key].expand=false
                  this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
                 
                });
               
                let a=JSON.stringify(companydata)
                this.treeData=JSON.parse(a)

              }  else {
                this.isSpinning = false;
                 this.notification.error('No data found', '');
                this.treeData = [];
              }
            });

          }
          }

  exportData(dataexportType) {
           debugger
            
            this.exportypedata=dataexportType
            if (!this.exportypedata){
              this.notification.info('Select an Export Type', '');
              return false
            }
            // let data = this.policystatus.toString();
            let data 
            if(this.policystatus!='ALL'){ data = this.policystatus.toString();}
            else{ data = this.policystatus}
            this.exportModal=false
            this.isSpinning=true
            let a = this.validate()
    if (a)
    {
      // this.dataServ.getResponse({
      //         "batchStatus": "false",
      //         "detailArray":
      //         [{
      //           exportType    : this.exportypedata?this.exportypedata:'',
      //           dateFrom      : moment(this.dateFrom).format(AppConfig.dateFormat.apiMoment),
      //           dateTo        : moment(this.dateTo).format(AppConfig.dateFormat.apiMoment),
      //           general       : this.general?this.general:0,
      //           life          : this.life?this.life:0,
      //           spCode        : this.spCode?this.spCode.SpCode:'All',
      //           State         : this.State?this.State.State:'All',
      //           Region        : this.Region?this.Region.Region:'All',
      //           Location      : this.Location?this.Location.Location:'All',
      //           company       : this.company?this.company:0,
      //           Employee      : this.Employee?this.Employee.EmployeeID:'All',
      //           policystatus  : this.policystatus?this.policystatus:'',
      //           businessDone  : this.businessDone?this.businessDone:'',
              
      //           ExcelExport   :1, 
      //           Euser         :this.currentUser.userCode,	
      //         }],
      //         "requestId": "121",
      //         "outTblCount": "0"
      //       }).then((response) => {debugger
            
      //           let res;
      //           if (response && response[0]) {
      //             this.isSpinning=false
      //             this.Records = this.utilServ.convertToResultArray(response[0]);
      //             this.Columns = response[0].metadata.columns;
      //             this.utilServ.Excel(this.Columns, this.Records, this.exportType)
        
      //           }
              
      //       });

      let reqParams = {
        "batchStatus": "false",
        "detailArray":
        [{
                    exportType    : this.exportypedata?this.exportypedata:'',
                    dateFrom      : moment(this.dateFrom).format(AppConfig.dateFormat.apiMoment),
                    dateTo        : moment(this.dateTo).format(AppConfig.dateFormat.apiMoment),
                    general       : this.general?this.general:0,
                    life          : this.life?this.life:0,
                    spCode        : this.spCode?this.spCode.SpCode:'All',
                    State         : this.State?this.State.State:'All',
                    Region        : this.Region?this.Region.Region:'All',
                    Location      : this.Location?this.Location.Location:'All',
                    company       : this.company?this.company:0,
                    Employee      : this.Employee?this.Employee.EmployeeID:'All',
                    policystatus  : this.policystatus?data:'',
                    businessDone  : this.businessDone?this.businessDone:'',
                  
                    ExcelExport   :1, 
                    Euser         :this.currentUser.userCode,	
        }],
        "requestId": "121",
        "outTblCount": "0"
      }
      reqParams['fileType'] = "2";
      reqParams['fileOptions'] = { 'pageSize': 'A4' };
      let isPreview: boolean;
      isPreview = false;
  
      this.dataServ.generateReportmultiexcel(reqParams, isPreview).then((response) => { debugger
        this.isSpinning=false
        // this.isSpinning = false;
        if (response.errorMsg) {
          this.notification.error("Data not found", '')
        }
        
    },() => {
      debugger
      this.notification.error("Server Encountered an Error", '')
    }
  );
        

    }
    this.exportType=''
    this.exportypedata=''
  }

    // export to excel
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
      
      FileSaver.saveAs(blob,"Income.xls");
      
    }

     // generateReportmultiexcel
  enter(code)
  {debugger
    
    let element = code.srcElement.nextElementSibling; // get the sibling element
     // focus if not null
  if (code.keyCode === 13) {
    
    element.focus(); 
      let a= 20
    for(let i=0;i<a;i++)
    {
      let elmnt:HTMLElement=document.getElementById('check') as HTMLElement;
      elmnt.click()

      // $( "#check" ).mousemove(function( event ) {
      //  }) ;
      
      a+1
    }


   
    }
  
}

validate(){
  debugger
  // if (!this.general){
  //   this.notification.warning('Please select General','')
  //   return false
  // }
  // if (!this.life){
  //   this.notification.warning('Please select Life','')
  //   return false
  // }
  // if (!this.spCode){
  //   this.notification.warning('Please select SP Code','')
  //   return false
  // }
  // if (!this.State){
  //   this.notification.warning('Please select State','')
  //   return false
  // }
  // if (!this.Region){
  //   this.notification.warning('Please select Region','')
  //   return false
  // }
  // if (!this.Location){
  //   this.notification.warning('Please select Location','')
  //   return false
  // }
  // if (!this.company){
  //   this.notification.warning('Please select Company','')
  //   return false
  // }
  // if (!this.Employee){
  //   this.notification.warning('Please select Employee Code','')
  //   return false
  // }
  // if (!this.policystatus){
  //   this.notification.warning('Please select Policy Status','')
  //   return false
  // }
  // if (!this.businessDone){
  //   this.notification.warning('Please select Business Done','')
  //   return false
  // }
  return true
}
closeDrawer()
{
  this.visibleDrawer=false
}  
openDrawer()
{
  this.visibleDrawer=true
  this.drawerContentView()
}
drawerContentView()
  {
        this.dataServ.getResponse({
           "batchStatus": "false",
           "detailArray":
                    [{
                        EUser   : this.currentUser.userCode,
                        ModuleID  : this.dataServ.ModuleID?this.dataServ.ModuleID:0
                    }],
           "requestId": "",
           "outTblCount": "0"
        }).then((response) => {debugger
                  // this.dataServ.ModuleID
                    if (response && response[0] && response[0].rows.length > 0) {
                            this.drawerContent = this.utilServ.convertToObject(response[0]);
                            this.drawerContentTxt= this.drawerContent[0].DrawerDescription
                          
                    }

                    else {
                           
                    }

                })

} 
getnop(data,Type,NOPType,value){
  if(value <=0)
    {
      return
    }
    debugger
    let policydata = this.policystatus.toString();
    this.isSpinning=true
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
         
                  lifeORGeneral :Type?Type:'',
                  NOPType       :NOPType?NOPType:'',
                  NOPvalue      :value?value:'',
                  dateFrom      : moment(this.dateFrom).format(AppConfig.dateFormat.apiMoment),
                  dateTo        : moment(this.dateTo).format(AppConfig.dateFormat.apiMoment),
                  general       : this.general?this.general:0,
                  life          : this.life?this.life:0,
                  spCode        : this.spCode?this.spCode.SpCode:'All',
                  State         : this.State?this.State.State:'All',
                  Region        : this.Region?this.Region.Region:'All',
                  Location      : this.Location?this.Location.Location:'All',
                  company       : this.company?this.company:0,
                  Employee      : this.Employee?this.Employee.EmployeeID:'All',
                  policystatus  : this.policystatus?policydata:'',
                  businessDone  : this.businessDone?this.businessDone:'',
                 
                  ExcelExport   :0, 
                  Euser         :this.currentUser.userCode,	
                  CODEVALUE     : data.CODE?data.CODE:'All',
            
        }],
      "requestId": "122"
    }).then((response) => {debugger
      this.isSpinning=false
      // this.data = response[0].metadata.columnsTypes;
      this.tabledata = this.utilServ.convertToObject(response[0]);
      // this.Commision= this.utilServ.convertToObject(response[1]);
      // this.CommisionFlag=this.Commision[0].CommissionPaidFlag
      debugger
      console.log(this.tabledata )
     

      // if(this.tabledata.length)

        this.headerdata=this.tabledata[0].HeaderColumn
      // {
        this.showModal()
      // }

    });


}
showModal(): void {
  this.isVisible = true;
}


handleCancel(): void {
 
  this.isVisible = false;
}
showmodalexport(){
  this.exportModal = true;
}
handleCancelExport(): void {
 
  this.exportModal = false;
}
getexportype() {

  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Code: 37,
        
      }],
    "requestId": "4"
  }).then((response) => {

    let res;
    if (response && response[0]) {
      this.exporttypeList = this.utilServ.convertToObject(response[0]);
   
    } else {
    }
  });
}
reset_tabledata()
  {
    this.treeData=[]
  }
}
