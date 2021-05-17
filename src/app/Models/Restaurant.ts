export class Restaurant{
    rid:number;
	name:string;
	contact:string;
	email:string;
    categories:string;
    profile:string;
    uid:number;
    constructor(rid:number,name:string,contact:string,email:string,categories:string,profile:string,uid:number) {
        this.rid=rid;
        this.name=name;
        this.contact=contact;
        this.email=email;
        this.categories=categories;
        this.profile=profile;
        this.uid=uid;
    }
}