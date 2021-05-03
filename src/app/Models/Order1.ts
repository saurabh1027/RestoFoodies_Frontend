import { Food_Item } from "./Food_Item";

export class Order1{
    oid:number;
    recipient_name:string;
    destination:string;
    contact:string;
    status:string;
    items:string;
    price:number;
    branch:string;
    rname:string;
    constructor(oid:number,recipient_name:string,destination:string,contact:string,status:string,items:string,price:number,branch:string,rname:string) {
      this.destination = destination;
      this.status = status;
      this.oid = oid;
      this.rname = rname;
      this.recipient_name = recipient_name;
      this.contact = contact;
      this.items = items;
      this.branch = branch;
      this.price = price;
    }
  }