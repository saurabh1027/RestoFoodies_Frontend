export class User{
    id:number;
    username:string;
    password:string;
    fullname:string;
    role:string;
    contact:string;
    email:string;
    location:string;
    latlng:string;
    profile:string;
    constructor(id:number,username:string,password:string,fullname:string,role:string,contact:string,email:string,location:string,latlng:string,
        profile:string) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.role = role;
        this.contact = contact;
        this.email = email;
        this.location = location;
        this.latlng = latlng;
        this.profile = profile;
    }
}