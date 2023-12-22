import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import {  UploadFile } from 'ng-zorro-antd';
import * as moment from 'moment';
import { AppConfig } from 'shared';
import { NzNotificationService } from 'ng-zorro-antd';
import { AuthService } from 'shared';
import { User } from 'shared/lib/models/user';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
@Component({
  selector: 'app-common-file-upload',
  templateUrl: './common-file-upload.component.html',
  styleUrls: ['./common-file-upload.component.less']
})
export class CommonFileUploadComponent implements OnInit {
  currentUser: User;
  insCompList: any[];
  insCompany:any;
  dataDropDown: any[];
  Category:any;
  policyList: any[];
  isProcessing: boolean;
  PolicyNo: any;
  clientList: any[];
  confirmModal: any;
  findtypeValue: any;
  UploadID: number;
  fileTypefill: any;
  public file: Array<any> = [];
  DocType: any;
  tempClientFileId: any;
  ApplicationNo: any;
flag:any
  size: number;
  bulkfile:any
  completedProcess: any;
  Filelist: any[];
  checked:any=false
  constructor(private modalService: NzModalService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private authServ: AuthService,
    private notif: NzNotificationService
  ) {
  
    this.authServ.getUser().subscribe(user => {
        this.currentUser = user;
      }); }

  ngOnInit() {
    this.getInsCompany()
    this.getDropDown()
    this.Viewtable()
    this.clientList=[]
    this.bulkfile=[]
  }
  getList(){
    this.clientList=[]
  }

  getInsCompany() {
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Code: 41
        }],
      "requestId": "4"
    }).then((response) => {
      // this.isProcessing = false;
      let res;
      if (response && response[0]) {
        this.insCompList = this.utilServ.convertToObject(response[0]);
        // this.model.insCompany = this.insCompList[0].Code;
        
      } else {
        // this.notif.error = "No Data Found";
      }
    });
  }
  getDropDown(){debugger
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          insCompany:this.insCompany||0,
          Euser:this.currentUser.userCode,
          Flag:'D'
        }],
      "requestId": "124"
    }).then((response) => {debugger
      // this.isProcessing = false;
      let res;
      if (response && response[0]) {
        this.dataDropDown = this.utilServ.convertToObject(response[0]);
        let V=this.utilServ.convertToObject(response[1]);
        this.size=V[0].FileSizeKB
        // this.model.insCompany = this.insCompList[0].Code;
        
      } else {
        // this.notif.error = "No Data Found";
      }
    });
  }
  getdata(){debugger
    this.clientList=[]
    this.insCompany
    this.ApplicationNo=null
    this.PolicyNo=null
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          insCompany:this.insCompany||0,
          Euser:this.currentUser.userCode,
          Flag:'A'
        }],
      "requestId": "124"
    }).then((response) => {debugger
      // this.isProcessing = false;
      let res;
      if (response && response[0]) {
        this.policyList = this.utilServ.convertToObject(response[0]);
        // this.model.insCompany = this.insCompList[0].Code;
        
      } else {
        // this.notif.error = "No Data Found";
      }
    });

  }
  viewList() {
    // this.getFiletype()
    if(this.Category=='Sample File'){this.flag='S'}
    if(this.Category=='Company'){this.flag='C'}
    if(this.Category=='Policy'){this.flag='P'
    if(!this.PolicyNo){
      this.notif.warning("Please select a policy",'')
    }}


    if (!this.insCompany) {
      this.notif.warning("Please select a Company", '');
      return;
    }
    this.isProcessing = true;
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          Euser               : this.currentUser.userCode,
          PolicyNo            : this.PolicyNo||0,
          InsCompanyId        : this.insCompany,
          flag                : this.flag
        }],
      "requestId": "125"
    }).then((response) => {
      debugger
      // this.processing=false
      let res;
      if (response && response[0]) {
        this.clientList = this.utilServ.convertToObject(response[0]);
        for (var i = 0; i < this.clientList.length; i++) {
          this.clientList[i].file = [];
          this.clientList[i].status = '';
          this.clientList[i].errMsg = '';
          this.clientList[i].showErr = false;
        }
      } else {
        this.notif.error("No Data Found", '');
      }
    });
  }
  fileChangeEvent = (index) => {
    return (file: UploadFile): boolean => {
      this.clientList[index].file = [file];
      return false;
    };
  }

  onLookupSelect(data) {

  }

  // openModal() {
  //   let reqParams;

  //   reqParams = {
  //     "batchStatus": "false",
  //     "detailArray": [{ "SearchType": 1001, "WhereClause": '', "LangId": 1 }],
  //     "myHashTable": {},
  //     "requestId": 2,
  //     "outTblCount": "0"
  //   }

  //   this.lookupsearch.actionOpen(reqParams, 'Test');
  // }
  fileTypeEventChange(event:any){
    debugger
 
   this.findtypeValue=event;
  }
  uploadFiles(rowdata) {
    debugger
   
    this.confirmModal = this.modalService.confirm({
      nzTitle: 'Do you Want to Upload this ',
      nzContent: ' ',
      nzOnOk: () =>
        new Promise((resolve, reject) => {debugger
          setTimeout(Math.random() > .01 ? resolve : reject, 1500);

    let el,obj:any
    let fileName;
   

    this.UploadID=0

    this.UploadID=rowdata.uploadID
    obj=rowdata
    el=rowdata.file[0]
    if (!el) {
      this.notif.warning("Please choose file ", '');
      return false
    }
 
    

    // if (el.type !='application/pdf')
    // {
    //   this.notif.warning("please Choose a pdf file",'');
    //   return;
    // }
    // if (!obj.remarks)
    // {
    //   this.notif.warning("Please choose a file Type ", '');
    //   return false
    // }
    el.status="Processing";
    //console.log(obj.file)
    
    
    
    if (obj.id){

     
      this.file['size'] = el.size;
      let V=this.file['size'] /1024
      if(V>this.size){
        let Y=this.size/1024
        this.notif.warning('Please select a file with size Less than '+this.size+' KB','')
        return
      }debugger
      this.processUpload(obj)
      this.getFileImage(el, (byte)=>{
        debugger
        this.file['tempFileImage'] = byte;
        this.DocType=el.type;
        var temp =  this.file['tempFileImage'];
        var result = temp.split(',');
        this.file['fileImage']=result[1];
        fileName = result[1];
        const formdata: FormData = new FormData();
        formdata.append('file', this.file['fileImage']);

       //this.updateData(i);

       this.updateData(obj).then((response) => {
        // this.notif.success("File uploaded successfully",'');
       
      }, () => {
        // this.isProcessingSave = false;
      });
   
      });
    }
    
  }).catch(() => console.log('Oops errors!'))
});
  }
 

  getFileImage(myFile, cb){
    debugger
    var reader = new FileReader();
    var base64ByteArry : any
    reader.readAsDataURL(myFile);
    base64ByteArry = reader.result;
    reader.onload = function() 
    {
      var arrayBuffer : any;
      arrayBuffer = reader.result
      base64ByteArry = arrayBuffer;
      cb(base64ByteArry);
    }
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    // return base64ByteArry;
  }

  showError(data) {
    data.showErr = true;
  }

  
  private updateData(obj) { debugger
debugger
this.flag=0
if(this.Category=='Sample File'){
  this.flag=1
}
this.tempClientFileId=obj.id
    return new Promise((resolve, reject) => {
      this.dataServ.getResponse({
        "batchStatus": "false",
        "detailArray":
          [{
                              ClientFileId                  : obj.id,
                              FileTypeId                    : this.flag||0,
                              TranDate                   : moment(new Date).format(AppConfig.dateFormat.apiMoment),
                              FileName                   : this.file['fileImage'],
                              EUser                      : this.currentUser.userCode,
                              PolicyNo                   : this.PolicyNo||'0',
                              ApplicationNo              :this.ApplicationNo||'0',
                              ModuleId                   :this.dataServ.ModuleID?this.dataServ.ModuleID:0,
                              Remarks                    :obj.remarks?obj.remarks:'',
                              documentName               :obj.file[0].name,
                              UploadId                   :this.UploadID,
                              InsCompanyId                :this.insCompany,
          }],
        "requestId": "127"
      }).then((response) => {
        debugger
        // this.isProcessing = false;
        let res;
        if (response && response.errorCode == 0) {
          // this.clientList[0].status = "Success";
          // this.clientList[0].errMsg = '';
          // resolve(true);
          this.notif.success('Successfully Uploaded','') 
          obj.status = "Success";
          obj.filestatus = "Saved";
          obj.errMsg=''
        } else {
          if (response[0]) {
            res = this.utilServ.convertToObject(response[0]);
            if (res[0].Msg) {
              obj.status = "Failed";
              obj.errMsg = res[0].Msg;
              reject();
            }else {
              obj.status = "Success";
              obj.filestatus = "Saved";
              obj.errMsg = '';
              resolve(true);
            }
            
          }else {
            obj.status = "Failed";
            obj.errMsg = response.errorMsg;
            reject();
          }
        //  this.notif.error('Failed to Save','')       
        }
        this.viewList()
      });
    });
  }

  getpolicy(){
    this.clientList=[]
    let i=this.policyList.length
    let Y=0
    for(Y=0;Y<i;Y++){
      if(this.ApplicationNo==this.policyList[Y].ApplicationNo){
        this.PolicyNo=this.policyList[Y].PolicyNo
      }
    }
  }
  getApp(){debugger
    this.clientList=[]
    let i=this.policyList.length
    let Y=0
    for(Y=0;Y<i;Y++){
      if(this.PolicyNo==this.policyList[Y].PolicyNo){
        this.ApplicationNo=this.policyList[Y].ApplicationNo
      }
    }

  }
  processUpload(i) {
 debugger
    this.processFile(i).then((response) => {debugger
      let filename = response
      // this.updateDataFtp(filename,i).then((response) => {debugger
      //   // this.notif.success("File uploaded successfully",'');
      //   this.processUpload(++this.completedProcess);
      // }, () => {
      //   // this.isProcessingSave = false;
      // });
    }, () => {
      // this.isProcessingSave = false;
    });

  }

  processFile(i) {debugger
    return new Promise((resolve, reject) => {debugger
      let val =i
      if (val) {
        let fileName;

        if (val.file) {debugger
          val.status = "Processing";
        
          const formdata: FormData = new FormData();
          formdata.append('file', val.file[0]);
          this.dataServ.ftpuploadFile(formdata).then((response: any) => {debugger
            if (response && response.errorCode == 0) {debugger
              fileName = response.fileName;
              resolve(fileName)
              debugger
            }
            else {
              this.notif.error(response.errorMsg, '');
            }
          });
        }
      } else {
        this.processUpload(++this.completedProcess);
      }
    });
  }
  private updateDataFtp(fileName, i) { debugger

    // this.insCompany
    // return new Promise((resolve, reject) => {
    //   this.dataServ.getResponse({
    //     "batchStatus": "false",
    //     "detailArray":
    //       [{
    //         // ProcessType: this.clientList[i].ProcessID,
    //         // TranDate: moment(new Date).format(AppConfig.dateFormat.apiMoment),
    //         // FileName: fileName,//'Geojit Issuance WRP YTD.csv',//filename,
    //         // EUser: this.currentUser.userCode,
    //         // Debug: 'N',
    //         // InsCompanyId: this.insCompany
    //       }],
    //     "requestId": ""
    //   }).then((response) => {
    //     debugger
    //   });
    // });
  }
  download(data){debugger
      debugger
             this.dataServ.Download(
             {
             "batchStatus":"false",
             "detailArray":
             [{
             "Euser":this.currentUser.userCode,
             Id:data.uploadID
             }],
             "requestId":"129",
             "outTblCount":"0",
             }
             ).then((response) =>
             {
               debugger
               if(response.errorCode==0){
                 this.notif.success('Done','Succesfully Dowloaded')
               }else{
                 this.notif.error('Sorry','Somthimg went wrong')
               }
 
             })
  }
  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      // this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      // this.msg.error(`${file.name} file upload failed.`);
    }
  }
  bulkfileUpload(){debugger
  let len=  this.bulkfile.length
  for(let i=0;i<len;i++){debugger
let el=this.bulkfile[i].originFileObj
let DocName=el.name
let fileName
this.getFileImage(el, (byte)=>{
  debugger
  this.file['tempFileImage'] = byte;
  this.DocType=el.type;
  var temp =  this.file['tempFileImage'];
  var result = temp.split(',');
  this.file['fileImage']=result[1];
  fileName = result[1];
  const formdata: FormData = new FormData();
  formdata.append('file', this.file['fileImage']);
  debugger
  let v=this.file['fileImage']
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        FileName:this.file['fileImage'],
        Docname:DocName,
        Euser:this.currentUser.userCode
      }],
    "requestId": "130"
  }).then((response) => {
    debugger
    // this.isProcessing = false;
    let res;
    if ( response.errorCode == 0) {
      // this.clientList[0].status = "Success";
      // this.clientList[0].errMsg = '';
      // resolve(true);
      this.notif.success('Successfully Uploaded','') 
      this.bulkfile=[]
    } else {
      if (response[0]) {
        res = this.utilServ.convertToObject(response[0]);
        if (res[0].Msg) {
        
        }else {
 
        }
        
      }else {
       
      }
    //  this.notif.error('Failed to Save','')       
    }
    this.Viewtable()
  });
});



  }
}
Viewtable(){
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Euser               : this.currentUser.userCode,
        Policy            :this.PolicyNo||'0',
        Flag        : 0,
        Id                : 0
      }],
    "requestId": "131"
  }).then((response) => {

    if (response && response[0]) {
      this.Filelist = this.utilServ.convertToObject(response[0]);
      this.policyList=this.utilServ.convertToObject(response[1]);
    }
  })
}
downloadbulk(data){debugger
  debugger
         this.dataServ.Download(
         {
         "batchStatus":"false",
         "detailArray":
         [{
          Euser               : this.currentUser.userCode,
          Policy            :'',
          Flag        : 1,
          Id                : data.ID
         }],
         "requestId":"131",
         "outTblCount":"0",
         }
         ).then((response) =>
         {
           debugger
           if(response.errorCode==0){
             this.notif.success('Done','Succesfully Dowloaded')
           }else{
             this.notif.error('Sorry','Somthimg went wrong')
           }

         })
}
bulkornot(data){debugger
this.PolicyNo=null
this.ApplicationNo=null
if(this.checked==true){
  this.Viewtable()
}
if(this.checked==false){
  this.getdata()
  this.clientList=[]
}


}
search(){
  this.Viewtable()
}
remove(){
  this.PolicyNo=null
  this.ApplicationNo=null
  this.Viewtable()
}
delete(data){debugger
  
  this.confirmModal = this.modalService.confirm({
    nzTitle: 'Do you Want to Delete this ',
    nzContent: ' ',
    nzOnOk: () =>
      new Promise((resolve, reject) => {debugger
        setTimeout(Math.random() > .01 ? resolve : reject, 1500);
  let id
  if(this.checked==true){
     id=data.ID
  }
  if(this.checked==false){
    id=data.uploadID
  }
  this.dataServ.getResponse({
    "batchStatus": "false",
    "detailArray":
      [{
        Euser               : this.currentUser.userCode,
        Id                : id,
        flag              :''
      }],
    "requestId": "132"
  }).then((response) => {

    if (response.errorCode==0) {
      this.notif.success('Successfully deleted','')
      this.Viewtable()
      if(this.insCompany==null||this.insCompany==''){
      }else{
      this.viewList()

      }
    }
  })
      
}).catch(() => console.log('Oops errors!'))
});
}
}