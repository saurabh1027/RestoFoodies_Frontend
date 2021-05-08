export class Restaurant{
    rid:number;
	name:string;
	contact:string;
	email:string;
    branch:string;
    categories:string;
	latlng:string= "0.00/0.00";
    profile:string;
    username:string='';
    constructor(rid:number,name:string,contact:string,email:string,branch:string,
        categories:string,latlng:string,profile:string,username:string) {
        this.rid=rid;
        this.name=name;
        this.contact=contact;
        this.email=email;
        this.branch=branch;
        this.categories=categories;
        this.latlng=latlng;
        this.profile=profile;
        this.username=username;
    }
}