import { Component, OnInit } from '@angular/core';
import { DataService, UtilService } from 'shared';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-gst-invoice-generation',
  templateUrl: './gst-invoice-generation.component.html',
  styleUrls: ['./gst-invoice-generation.component.less']
})
export class GstInvoiceGenerationComponent implements OnInit {
  html;
  fdt:Date;
  tdt:Date;
  constructor( private dataServ: DataService, private utilServ:UtilService) { }

  ngOnInit() {
  }
  Excel(colums, data, fname: string) {
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
    FileSaver.saveAs(blob, fname);
    // this.isProcessing = false;
    // this.isProcessingDownload = false;
  }
  generate(){
    this.dataServ.getResponse({
      "batchStatus": "false",
      "detailArray":
        [{
          InsCompany:21 ,
          FromDate:'' ,
          ToDate:''

        }],
      "requestId": "48"
    })
      .then((response) => {
       console.log(response)
         
         if (response && response[0].rows.length > 0) {

    
            let Records = this.utilServ.convertToResultArray(response[0]);
            let Columns = response[0].metadata.columns;
             
            this.Excel(Columns, Records, 'GstInvoiceGenReport.xls')
         }
      })
    
     
      
  }
}
