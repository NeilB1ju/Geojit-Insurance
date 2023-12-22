import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';
import { AppConfig } from 'shared/lib/constants/app-config';
import { User } from 'shared/lib/models/user';
import { UtilService, AuthService, WorkspaceService, Workspace, } from 'shared';
import { DataService } from 'shared';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { ChartsModule } from 'ng2-charts';


export interface SquareOffReportForm {
  tranDate: Date;
  clientCode: string;
}

@Component({
  selector: 'nz-demo-tabs-lazy',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  // animations: [bounceInOutAnimation]
})

export class DashboardComponent implements OnInit {

  workspaces: Workspace[] = [];
  model: SquareOffReportForm;
  clientList: any[] = [];
  from: number = 0;
  timeout = null;
  reportHtml: string;
  monthArray = [];
  Brokerag:any
  PremiumArray = []
  currentUser: User;
  isProcessing: boolean;
  error: string;
  isExpandedPreview: boolean = false;
  premium: any = [];
  premiumGraphData: any = [];
  companyDetails: any = [];
  laps: any = [];
  dues: any = [];
  paid: any = [];
  rico: any = [];
  data: any = [];
  Commission: any = [];
  CommissionCaption: string = ''
  ActivePolicy: any = [];
  ActivePolicyCaption: string = ''
  Persistency: any = [];
  PersistencyCaption: string = ''
  ActiveProduct: any = [];
  PofitablePolicy: any = [];
  PerformLocation: any = [];
  CommissionGraphData: any = [];
  CommissionChartLbl = [];
  CommissionChartDt = [];
  CommissionChartDtArr = [];

  public context: CanvasRenderingContext2D;
  // rico: any=[];

  public lineChartData: ChartDataSets[] = [
    { data: this.PremiumArray, label: 'Premium' },
  ];
  public lineChartLabels: Label[] = this.monthArray;

  public lineChartColors: Color[] = [
    {
      borderColor: '#ff9a9e',
      borderWidth: 1,
      pointBackgroundColor:'black',
      backgroundColor: '#F2F2F2',
    },
  ];
  public lineChartOptions: any = {
    responsiveAnimationDuration: 1000,
    responsive: true,
    legend: {   display: true  },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        }
      }]
    }

  };
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  // Doughnut
  public CommissionChartLabels: Label[] = //this.CommissionChartLbl;
   ['Life', 'Health', 'General'];
  public CommissionChartData: MultiDataSet =//this.CommissionChartDt; 
  [
    [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
  ];
  public CommissionChartType: ChartsModule = 'doughnut';

  // Doughnut
  public doughnutChartLabels: Label[] = //this.CommissionChartLbl;
  ['Life', 'Health', 'General'];
  public doughnutChartData: MultiDataSet =//this.CommissionChartDt; 
  [
    [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
  ];
  public doughnutChartType: ChartsModule = 'pie';

  // data:any=[];
  resultArray: any = []
  options: any = [];
  searchTerm: any;
  checkOptionsOne: any = [];
  indexVal: any;
  menuArray: any = [];
  showdash: any;
  isSpining: boolean=true;
  constructor(
    //  public wsServ:WorkspaceService,
    private http: HttpClient,
    private authServ: AuthService,
    private dataServ: DataService,
    private notification: NzNotificationService,
    private utilServ: UtilService,

  ) {
    this.model = <SquareOffReportForm>{
      tranDate: new Date()
    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });
  }
  gridStyle = {
    width: '33%',
    textAlign: 'center'
  };

  ngOnInit() {
    debugger
    //this.getOptions();
    this.getInsurance();

  }
  //   getOptions(){
  //     this.http.post("http://192.168.29.33:9080/index/_allIndex",'').subscribe(res=>{
  //       console.log(res)
  //       this.options=res;
  //       this.options.forEach(element => {
  //         this.checkOptionsOne.push({label:element.charAt(0).toUpperCase()+element.slice(1),value:element})
  //       });

  //     })
  //   }


  //   log(checkOptionsOne){
  //   this.indexVal=checkOptionsOne
  //   }
  //   next(){
  //     this.from=this.from+10;
  //     this.getData();
  //   }
  //   prev(){
  //     this.from=this.from-10;
  //     this.getData();
  //   }
  //   getData(){

  //    var newIndex=[];
  //  this.indexVal.forEach(element => {
  //    if(element.checked==true){
  //     newIndex.push(element)
  //    }

  //  });
  //  if(newIndex.length==0){
  //   alert("check checkbox")
  //   this.searchTerm=""
  //   return;
  // }
  //  //console.log(newIndex)
  //  var str="";

  //  for(let i=0;i<newIndex.length;i++){
  //   str=str+(newIndex[i].value)+","
  //  }
  //  str = str.slice(0, -1); 
  // console.log(str)

  //       if(this.searchTerm==""){
  //         this.resultArray=[]
  //         this.menuArray=[]
  //         this.data=[]
  //         return
  //       }
  //       this.resultArray=[]
  //       this.menuArray=[]
  //       this.data=[]


  //             const httpOptions = {
  //               headers: new HttpHeaders({ 
  //                 'Access-Control-Allow-Origin':'*',

  //               })
  //             };
  //             this.http.post("http://192.168.29.33:9080/indexData/search",
  //             {
  //               "enbleHighlight": false,
  //               "fields": "",
  //               "from": this.from,
  //               "id": 1,
  //               "indexName": str,
  //               "query": this.searchTerm,
  //               "responseFields": ""
  //             },httpOptions
  //             ).subscribe(res=>{
  //               console.log(res)
  //            let data=JSON.parse(res["serchResponse"])
  //            console.log(data)
  //           let hitsData=data.hits.hits
  //           hitsData.forEach(element => {
  //             this.data.push(element._source)

  //           });

  //         if(str=='client'){
  //           this.data.forEach(element => {
  //              this.resultArray.push(element.clientcode+"-"+element.name+"-"+(element.pannumber.trim()==""?" ":element.pannumber+"-")+(element.mobileno.trim()==" "||element.mobileno==0?" ":element.mobileno+"-")+(element.resemail.trim()==" "?" ":element.resemail))
  //            this.resultArray.push(element.clientcode,element.name,(element.pannumber.trim()==""?" ":element.pannumber),(element.mobileno.trim()==" "||element.mobileno==0?" ":element.mobileno),(element.resemail.trim()==" "?" ":element.resemail))

  //           });
  //          this.resultArray=this.data
  //         }
  //         if(str=='symbolfile'){

  //         console.log(this.data)
  //         this.data.forEach(element => {
  //           this.resultArray.push(element.InstrumentType+"-"+element.SecurityName+"-"+element.Venuecode+"-"+element.column35)
  //         });
  //         }
  //         if(str=='users'){

  //           console.log(this.data)
  //           this.data.forEach(element => {
  //             this.resultArray.push(element.cinno+"-"+element.euser+"-"+element.pan+"-"+element.usercode+"-"+element.dpid)
  //           });
  //           }
  //           if(str=='menu'){
  //             console.log(this.data)
  //             this.data.forEach(element => {
  //               this.menuArray.push({name:element.menuname,project:element.project,workspace:element.workspace,projectId:element.projectid})
  //             });
  //           }
  //             })  
  //   }

  //   doSomethingOnComplete(){
  //     alert();
  //   }

  getInsurance() {
    debugger
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
      [{
        EUser: this.currentUser.userCode
      }],
      "requestId": "46",

    }).then((response) => {
      this.isProcessing = false;
      debugger;
      if (response && response.results) {
        debugger;
        this.showdash  =response.results[15][0].showdash  
        this.premium = response.results[0][0]
        this.premiumGraphData = response.results[1]
        this.companyDetails = response.results[2];
        this.laps = response.results[3][0]
        this.dues = response.results[4][0]
        this.paid = response.results[5][0]
        this.rico = response.results[6][0]
        this.Commission = response.results[7]
        this.CommissionCaption = response.results[7][0].Caption
        this.ActivePolicy = response.results[8]
        this.ActivePolicyCaption = response.results[8][0].Caption
        this.Persistency = response.results[9]
        this.PersistencyCaption = response.results[9][0].Caption
        this.ActiveProduct = response.results[10]
        this.PofitablePolicy = response.results[11]
        this.PerformLocation = response.results[12]
        this.data = response.results[13][0].Data
        this.CommissionGraphData = response.results[14]  
        this.isSpining=false
        this.premiumGraphData.map((i) => {
          this.monthArray.push(i["Month"])
          this.PremiumArray.push(i["Premium"])
        })   

                
      //   this.CommissionChartLbl =this.CommissionGraphData.map(function (obj) { return [obj.ProductType] });
       
      //   this.CommissionChartDtArr = this.CommissionGraphData.map(function (obj) {return [obj.LastThreeMonths, obj.LastOneYear, obj.SinceInception]});

      //   this.CommissionChartDtArr.map((i) => {
      //     this.CommissionChartDt.push(i[0])
         
      //   }) 

      //  this.CommissionChartDt.push({ "Document": [] })
      //   let array = [];
      //   array.push({ "Document": [] })
      //   for (var i = 0; i < this.CommissionChartDtArr.length; i++) 
      //   {
      //      array[0].Document.push({ "Data": [] });
      //      array[0].Document[i].Data[0] = this.CommissionChartDtArr[i];
      //     // array[i].push(this.CommissionChartDtArr[i])
      //   }
      //   array[0].Document.map((i) => {
      //     this.CommissionChartDt.push(i["Data"])

      //   }) 
       

        
        

      }
    })
  }
  fillClientDetails() {
    this.clientList = [];
    this.error = "";
    if (this.model.tranDate) {
      this.isProcessing = false;

      this.dataServ.getResultArray({
        "batchStatus": "false",
        "detailArray":
        [{
          "usercode": 'GIT',
          "Password": "tiger1234"
        }],
        "requestId": "1",
        "outTblCount": "0"
      }).then((response) => {
        this.isProcessing = false;
        if (response && response.results) {
        }
      })
    }
  }
















}
