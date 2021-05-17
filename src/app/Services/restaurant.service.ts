import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from '../Models/Branch';
import { Category } from '../Models/Category';
import { Food_Item } from '../Models/Food_Item';
import { Order1 } from '../Models/Order1';
import { Restaurant } from '../Models/Restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  baseUrl : string = 'http://localhost:8080/';
  
  constructor(private http:HttpClient) { }
  
  //not sure
  public getItemsByFids(fids:number[]):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-items-by-fids',fids);
  }
  
  public getLocations():Observable<string[]>{
    return this.http.get<string[]>(this.baseUrl+'get-locations');
  }
  
  public getAllItems(city:string):Observable<Food_Item[]>{
    return (city==='')? this.http.post<Food_Item[]>(this.baseUrl+'get-all-items',null):
    this.http.post<Food_Item[]>(this.baseUrl+'get-all-city-items',city);
  }
  
  public getCategoriesByCnames(cnames:string[]):Observable<Category[]>{
    return this.http.post<Category[]>(this.baseUrl+'get-categories-by-cnames',cnames);
  }
  
  public getItemsOfKeywords(keyword:string,city:string):Observable<Food_Item[]>{
    return (city==='')?this.http.post<Food_Item[]>(this.baseUrl+'get-keyword-items/'+keyword,null):
      this.http.post<Food_Item[]>(this.baseUrl+'get-city-keyword-items/'+keyword,city);
  }

  // In Use

  public addRestaurant(restaurant:Restaurant):Observable<number>{
    return this.http.post<number>(this.baseUrl+'Restaurant',restaurant);
  }
  
  public addRestaurantProfile(file:File){
    let formdata : FormData  = new FormData();
    formdata.append("file",file,file.name);
    return this.http.post(this.baseUrl+'Restaurant-Profile',formdata,{responseType:'text'});
  }
  
  public getRestaurantByName(rname:string):Observable<Restaurant>{
    return this.http.get<Restaurant>(this.baseUrl+'Restaurants/'+rname);
  }

  public getRestaurantsByLocation(location:string):Observable<Restaurant[]>{
    let params : HttpParams = new HttpParams();
    params = params.append('location',location);
    return this.http.get<Restaurant[]>(this.baseUrl+'Restaurants',{params:params});
  }
  
  public getRestaurantItems(rid:number,status:string):Observable<Food_Item[]>{
    let params : HttpParams = new HttpParams();
    params = params.append('status',status);
    return this.http.get<Food_Item[]>(this.baseUrl+'Restaurants/'+rid+'/Items',{params:params});
  }
  
  public deleteItem(fid:number){
    return this.http.delete(this.baseUrl+'Item/'+fid,{responseType:'text'});
  }
  
  public addFoodItem(food_item:Food_Item){
    return this.http.post(this.baseUrl+'Item',food_item,{responseType:"text"});
  }
  
  public addFoodItemPic(file:File){
    let formdata : FormData  = new FormData();
    formdata.append("file",file,file.name);
    return this.http.post(this.baseUrl+'Item-Profile',formdata,{responseType:"text"});
  }
  
  public updateFoodItem(item:Food_Item){
    return this.http.patch(this.baseUrl+'Item',item,{responseType:'text'});
  }
  
  public getRestaurantByUid(uid:number):Observable<Restaurant>{
    return this.http.get<Restaurant>(this.baseUrl+'/Users/'+uid+'/Restaurant');
  }
  
  public addCategory(category:Category){
    return this.http.post(this.baseUrl+'Category',category,{responseType:'text'});
  }
  
  public deleteRestaurant(rid:number){
    return this.http.delete(this.baseUrl+"Restaurant/"+rid,{responseType:"text"});
  }
  
  public updateRestaurant(rest:Restaurant){
    return this.http.patch(this.baseUrl+'Restaurant',rest,{responseType:'text'});
  }
  
  public getFoodItems(cname:string,rid:number):Observable<Food_Item[]>{
    let params : HttpParams = new HttpParams();
    params = params.append('cname',cname);
    return this.http.get<Food_Item[]>(this.baseUrl+'Restaurant/'+rid+'/Items',{ params:params });
  }

  public addBranch(branch:Branch){
    return this.http.post(this.baseUrl+'Restaurants/'+branch.rid+'/Branch',branch,{responseType:'text'});
  }

  public getBranches(rid:number):Observable<Branch[]>{
    return this.http.get<Branch[]>(this.baseUrl+'Restaurants/'+rid+'/Branches');
  }

  public getBranchOfRestaurantByLocation(location:string,rid:number):Observable<Branch>{
    return this.http.get<Branch>(this.baseUrl+'Restaurants/'+rid+'/Branches/'+location);
  }

}