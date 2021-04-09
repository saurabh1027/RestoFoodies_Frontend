export class User{
    id:number;
    username:string;
    password:string;
    fullname:string;
    role:string;
    email:string;
    address:string;
    profile:string;
    constructor(
        id:number,
        username:string,
        password:string,
        fullname:string,
        role:string,
        email:string,
        address:string,
        profile:string){
        this.id = id;
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.role = role;
        this.email = email;
        this.address = address;
        this.profile = profile;
    }
}