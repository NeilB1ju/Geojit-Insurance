import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { LookUpDialogComponent } from 'shared';
import { User } from 'shared/lib/models/user';
import { AuthService } from 'shared';
import { DataService } from 'shared';
import { UtilService } from 'shared';
import { FindType } from 'shared'
import { FindOptions } from 'shared';
import * as  jsonxml from 'jsontoxml';
import { FormHandlerComponent } from 'shared';
import { AppConfig } from 'shared';
import { InputMasks } from 'shared';
import * as moment from 'moment';

export interface SlabMasterForm {
  SlabCode: String;
  SlabName: String;
  SlabId: number;
  Percentage: number;
  FromYear: number;
  ToYear: number;
}

@Component({
  selector: 'app-slab-master',
  templateUrl: './slab-master.component.html',
  styleUrls: ['./slab-master.component.less']
})
export class SlabMasterComponent implements OnInit {


  slabDetails: Array<any> = [];
  EmployeeFindopt: FindOptions;
  locationFindopt: FindOptions;
  ismodifystate: boolean;
  slabEditIdx: number;
  editHighLight: boolean;
  inputMasks = InputMasks;
  currentUser: User;
  isProcessing: boolean;


  model: SlabMasterForm;
  @ViewChild(LookUpDialogComponent) lookupsearch: LookUpDialogComponent;
  @ViewChild(FormHandlerComponent) formHandler: FormHandlerComponent;

  constructor(
    private authServ: AuthService,
    private dataServ: DataService,
    private utilServ: UtilService,
    private notification: NzNotificationService
  ) {
    this.model = <SlabMasterForm>{

    };
    this.authServ.getUser().subscribe(user => {
      this.currentUser = user;
    });

  }

  ngOnInit() {
    this.slabDetails = [];
    this.model.FromYear = null;
    this.model.ToYear = null;
    this.model.Percentage = null;
    this.model.SlabId = this.model.SlabCode = this.model.SlabName = null;
    this.formHandler.config.isModifyState = false;
  }

  Reset() {
    this.ngOnInit();
  }

  Save() {
    if (!this.model.SlabCode) {
      this.notification.error('Please enter Slab Code', '');
      return;
    }
    let slabData = this.slabDetails.map((o, i) => { return { FromYear: o.FromYear, ToYear: o.ToYear, Percentage: o.Percentage, SlNo: i + 1 }; });
    var JSONData = this.utilServ.setJSONArray(slabData);
    var xmlData = jsonxml(JSONData);

    this.dataServ.getResultArray({
      "FileImport": "false",
      "batchStatus": "false",
      "detailArray": [{
        IorU: this.formHandler.config.isModifyState ? "U" : "I",
        SlabId: this.formHandler.config.isModifyState ? this.model.SlabId : 0,
        SlabCode: this.model.SlabCode,
        SlabName: this.model.SlabName,
        XMLString: xmlData,
        Euser: this.currentUser.userCode,
      }],
      "requestId": "25",
    }).then((response) => { 

      if (response && response.errorMsg) {
        this.notification.error('error', response.errorMsg);
        return;
      }      
      if (response && response.results) {
        if (this.formHandler.config.isModifyState == true) {
          this.notification.success('Data updated successfully', '');
        }else {
          this.notification.success('Data saved successfully', '');
          this.formHandler.config.isModifyState = true;
          this.model.SlabId = response.results[0][0].NewKey;
        }
      }
    })
      .catch(function (error) {
      });
  }
  Search() {
    let reqParams;

    reqParams = {
      "batchStatus": "false",
      "detailArray": [{ "SearchType": FindType.SlabSearch, "WhereClause": '', "LangId": 1 }],
      "myHashTable": {},
      "requestId": 2,
      "outTblCount": "0"
    }
    this.lookupsearch.actionOpen(reqParams, 'Slab');

  }
  onLookupSelect(data) {
    this.model.SlabId = data.SlabID;
    this.model.SlabCode = data.SlabCode;
    this.model.SlabName = data.SlabName;
    this.formHandler.config.isModifyState = true;
    this.RetriveSlabDetails();
  }
  RetriveSlabDetails() {
    this.dataServ.getResultArray({
      "batchStatus": "false",
      "detailArray":
        [{
          SlabId: this.model.SlabId,
          EUser: this.currentUser.userCode || '',

        }],
      "requestId": "26",
    }).then((response) => {

      if (response.results && response.results.length) {
        this.slabDetails = response.results[0];
      }
      if (response && response.length > 0) {
        let res;
      }
    })
      .catch(function (error) {
      });
  }
  addSlabDetails() {
    if (!this.model.Percentage) {
      this.notification.error('Please enter From Percentage', '');
      return;
    }
    else {
      let slabData = { FromYear: this.model.FromYear, ToYear: this.model.ToYear, Percentage: this.model.Percentage }
      this.slabDetails = [...this.slabDetails, slabData];
      this.model.Percentage = null;
      this.model.FromYear = null;
      this.model.ToYear = null;
    }
  }
  Deleterow(i) {
    this.ismodifystate = false;
    this.slabDetails.splice(i, 1)
    this.slabDetails = [...this.slabDetails];
  }

  Clearrow() {
    this.ismodifystate = false;
    this.slabEditIdx = null;
    this.model.FromYear = this.model.ToYear = null;
    this.model.Percentage = null;
  }

  Editrow(data, i) {
    this.ismodifystate = true;
    this.slabEditIdx = i;
    this.model.FromYear = data.FromYear;//new Date(data.FromYear, 0);
    this.model.ToYear = data.ToYear;//new Date(data.ToYear, 0);
    this.model.Percentage = data.Percentage;
  }

  Updaterow() {

    let slabdata2 = { FromYear: this.model.FromYear, ToYear: this.model.ToYear, Percentage: this.model.Percentage }
    this.slabDetails.splice(this.slabEditIdx, 1, slabdata2);
    this.slabDetails = [...this.slabDetails];

    this.Clearrow();
  }

}
