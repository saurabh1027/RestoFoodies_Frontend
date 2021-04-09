import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Jwt } from '../Models/Jwt';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../Models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  username : string = '';
  baseUrl : string = 'http://localhost:8080/';
  constructor(private http:HttpClient,private router:Router) {}

  public saveUser(user):Observable<Jwt>{
    return this.http.post<Jwt>(this.baseUrl+"save-user",user);
  }

  public generateToken(user):Observable<Jwt>{
    return this.http.post<Jwt>(this.baseUrl+"token",user);
  }

  public getUserByToken(token):Observable<User>{
    return this.http.post<User>(this.baseUrl+'ValidateToken',token);
  }

  public updateUserPic(file:File){
    let formdata : FormData = new FormData();
    formdata.append('file',file,file.name);
    return this.http.post(this.baseUrl+"update-user-pic",formdata,{responseType:'text'});
  }

  public updateUser(user:User){
    return this.http.post(this.baseUrl+"update-user",user,{responseType:'text'});
  }

  public deleteUser(username:string){
    return this.http.post(this.baseUrl+'delete-user',username,{responseType:"text"});
  }

  logout(){
    localStorage.removeItem("UserToken");
    localStorage.removeItem("UserRole");
    localStorage.removeItem("UserName");
    this.router.navigate(['/Authentication/Login']);
  }

  public getUserByUsername(username:string):Observable<User>{
    return this.http.post<User>(this.baseUrl+'get-user',username);
  }
}
