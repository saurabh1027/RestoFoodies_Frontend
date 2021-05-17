export class Order1{
    oid:number;
    recipient_name:string;
    source:string;
    destination:string;
    contact:string;
    status:string;
    items:string;
    price:number;
    bid:number;
    rname:string;
    dname:string;
    constructor(oid:number,recipient_name:string,source:string,destination:string,contact:string,status:string,items:string,price:number,bid:number,rname:string,dname:string) {
      this.destination = destination;
      this.status = status;
      this.oid = oid;
      this.rname = rname;
      this.recipient_name = recipient_name;
      this.source = source;
      this.contact = contact;
      this.items = items;
      this.bid = bid;
      this.price = price;
      this.dname = dname;
    }
  }