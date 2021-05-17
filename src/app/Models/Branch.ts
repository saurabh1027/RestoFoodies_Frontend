export class Branch{
    public bid:number;
    public bname:string;
    public location:string;
    public rid:number;
    constructor(bid:number,bname:string,location:string,rid:number){
        this.bid = bid;
        this.bname = bname;
        this.location = location;
        this.rid = rid;
    }
}