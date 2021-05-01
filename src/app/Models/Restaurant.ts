export class Restaurant{
    rid:number;
	name:string;
	contact:string;
	email:string;
    branch:string;
    categories:string;
	latlng:string= "0.00/0.00";
	opening_time:string= "10:00";
	closing_time:string= "22:00";
    profile:string;
    username:string='';
    constructor(rid:number,name:string,contact:string,email:string,branch:string,
        categories:string,latlng:string,opening_time:string,closing_time:string,profile:string,username:string) {
        this.rid=rid;
        this.name=name;
        this.contact=contact;
        this.email=email;
        this.branch=branch;
        this.categories=categories;
        this.latlng=latlng;
        this.opening_time=opening_time;
        this.closing_time=closing_time;
        this.profile=profile;
        this.username=username;
    }
}