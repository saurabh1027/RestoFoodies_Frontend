export class Order{
    oid:number;
    name:string;
    status:string = 'Unsubmitted';
    location:string;
    total_price:number;
    username:string;
    constructor(oid:number,name:string,status:string,location:string,total_price:number,username:string) {
        this.oid = oid;
        this.name = name;
        this.status =status;
        this.location = location;
        this.total_price = total_price;
        this.username = username;
    }
}