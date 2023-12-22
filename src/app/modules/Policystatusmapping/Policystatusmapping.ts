export class Policystatusmapping {

  
  public Code:any;
  public Description:any;
  public Phone:any;
  public Email:any;
  public Fax:any;
  public Bank:any;
  public Address1:any;
  public Address2:any;
  public Pin:any;
  public Afsm:any;
  public Channel:any;
  public Source:any;
  public CompanyID:number;
  public ProductType:number
  public Policystatus:any
  public PolicyId:any

  public constructor(data: any = {}) {
    
    this.Code = data.Code|| '';
    this.Description=data.Description || '';
    this.Phone=data.Phone || '';
    this.Email=data.Email || '';
    this.Fax=data.Fax || '';
    this.Bank=data.Bank || '';
    this.Address1=data.Address1 || '';
    this.Address2=data.Address2 || '';
    this.Pin=data.Pin || '';
    this.Afsm=data.Afsm || '';
    this.Channel=data.Channel || '';
    this.Source=data.Source || '';
    this.ProductType=data.ProductType || 0;
    this.CompanyID=data.CompanyID || 0;
    this.Policystatus=data.Policystatus || ''
    this.PolicyId=data.PolicyId || 0;
  }
}
