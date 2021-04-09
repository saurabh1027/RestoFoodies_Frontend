export class Category{
    cid : number = 0;
    cname : string = '';
    description : string = '';
    constructor(cid:number,cname:string,description:string) {
        this.cid = cid;
        this.cname = cname;
        this.description = description;
    }
}