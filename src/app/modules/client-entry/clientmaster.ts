export class clientMaster {

  
  
  public Location:any;
  public locationid:string;
  public TradeCode:string;
  public PAN:string;
  public FullName:string;
  public FirstName:string;
  public MiddleName:string; 
  public LastName:string;
  public perAddress1:string;
  public perPIN:string;
  public Mobile:string;
  public DOB:Date;
  public Gender:string;
  public MaritalStatus:string;
  public Natinality:string;
  public Email:string;
  public SecondaryEmail:string;
  public dpid:string;
  public MFAccount:string;
  public type:string;
  public Employee:any;
  public perCity:string;
  public perAddress2:string;
  public perState:any;
  public perCountry:any;
  public comAddress1:string;
  public comCity:string;
  public comAddress2:string;
  public comCountry:any;
  public comState:any;
  public comPIN:string;
  public client:any;
  public insclient:string;
  public Locationbo:string;
  public BA:string;
  public CINNo:string;


  public constructor(data: any = {}) {
    
    this.client = data.client|| null;
    this.Locationbo = data.Locationbo|| '';
    this.insclient = data.insclient|| '';
    this.Location = data.Location|| '';
    this.locationid = data.locationid ||0;
    this.TradeCode = data.TradeCode ||'';
    this.PAN= data.PAN ||'';
    this.FullName = data.FullName ||'';
    this.FirstName = data.FirstName ||'';
    this.MiddleName = data.MiddleName ||'';
    this.LastName = data.LastName ||'';
    this.perAddress1 = data.perAddress1 ||'';
    this.perPIN = data.perPIN ||'';
    this.Mobile = data.Mobile ||'';
    this.DOB = data.DOB ||'';
    this.Gender = data.Gender ||'';
    this.MaritalStatus= data.MaritalStatus ||'';
    this.Natinality = data.Natinality|| '';
    this.Email = data.Email ||'';
    this.SecondaryEmail = data.SecondaryEmail ||'';
    this.dpid = data.dpid ||'';
    this.MFAccount = data.MFAccount||'';
    this.type = data.type || 'E';
    this.Employee=data.Employee ||'';
    this.perCity = data.perCity ||'';
    this.perAddress2= data.perAddress2||'';
    this.perState = data.perState|| '';
    this.perCountry = data.perCountry||0;
    this.comAddress1 = data.comAddress1 ||'';
    this.comAddress2= data.comAddress2 ||'';
    this.comCity = data.comCity||'';
    this.comCountry = data.comCountry|| '';
    this.comState=data.Employee ||'';
    this.comPIN=data.comPIN ||'';
    this.BA = data.BA||'';
  



    
  }
}
