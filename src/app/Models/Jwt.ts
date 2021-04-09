export class Jwt{
    token : string;
    role : string;
    message : string;
    constructor(token:string,role:string,message:string){
        this.token = token;
        this.role = role;
        this.message = message;
    }
}