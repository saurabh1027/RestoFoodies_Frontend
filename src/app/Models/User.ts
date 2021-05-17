export class User{
    uid:number;
    username:string;
    password:string;
    fullname:string;
    role:string;
    contact:string;
    email:string;
    location:string;
    latlng:string;
    profile:string;
    constructor(uid:number,username:string,password:string,fullname:string,role:string,contact:string,email:string,location:string,latlng:string,
        profile:string) {
        this.uid = uid;
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