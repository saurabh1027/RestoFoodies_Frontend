import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Jwt } from '../Models/Jwt';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl : string = 'http://localhost:8080/';
  constructor(private http:HttpClient) {}
  
  // In Use
  public getUserByToken(token):Observable<User>{
    let params : HttpParams = new HttpParams();
    params = params.append('token',token);
    return this.http.get<User>(this.baseUrl+'User',{ params:params });
  }  
  
  public authenticateUser(user):Observable<Jwt>{
    return this.http.post<Jwt>(this.baseUrl+"authenticate-user",user);
  }
  
  public updateUserPic(file:File){
    let formdata : FormData = new FormData();
    formdata.append('file',file,file.name);
    return this.http.patch(this.baseUrl+"User-Profile",formdata,{responseType:'text'});
  }
  
  public updateUser(user:User){
    return this.http.patch(this.baseUrl+"User",user,{responseType:'text'});
  }
  
  public deleteUser(username:string){
    return this.http.post(this.baseUrl+'delete-user',username,{responseType:"text"});
  }
  
  public getUserByUsername(username:string):Observable<User>{
    return this.http.get<User>(this.baseUrl+'Users/'+username);
  }
  
  public saveUser(user):Observable<Jwt>{
    return this.http.post<Jwt>(this.baseUrl+"save-user",user);
  }
  
  public addUser(user : User){
    return this.http.post(this.baseUrl + "add-user", user , {responseType : 'text'});
  }

}
