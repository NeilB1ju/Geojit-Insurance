import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audit-report',
  templateUrl: './audit-report.component.html',
  styleUrls: ['./audit-report.component.less']
})
export class AuditReportComponent implements OnInit {
  listOfAllData: any[] = [];
  checkedData:any[]=[];
  counter:number=0;
  visible:boolean=false;
  

  // refreshStatus(): void {

  //   this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
  //   this.isIndeterminate =
  //     this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
      
  // }

  checkedCheckBox(value: boolean): void {
  
    if(value==true){
      this.counter+=1
    }
    else{
      this.counter-=1
    }
    
  }
  compare(){
   
    this.checkedData=this.listOfAllData.filter(item => item.checked==true);
    console.log(this.checkedData)
    this.visible = true;
  }
  close(){
    this.visible=false;
  }
  
  ngOnInit(): void {
    for (let i = 0; i < 10; i++) {
      this.listOfAllData.push({
        id: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
        checked:false
      });
    }
  }
 
}
