import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Models/Category';
import { Food_Item } from '../Models/Food_Item';
import { Order } from '../Models/Order';
import { Restaurant } from '../Models/Restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  baseUrl : string = 'http://localhost:8080/';

  constructor(private http:HttpClient) { }

  public getRestaurantByRname(rname:string):Observable<Restaurant>{
    return this.http.post<Restaurant>(this.baseUrl+'get-restaurant/'+rname,null);
  }

  public getRestaurantsByLocation(location:string):Observable<Restaurant[]>{
    return this.http.post<Restaurant[]>(this.baseUrl+'get-location-restaurants',location);
  }

  public getLocations():Observable<string[]>{
    return this.http.get<string[]>(this.baseUrl+'get-locations');
  }

  public getRestaurantByUsername(username:string):Observable<Restaurant>{
    return this.http.post<Restaurant>(this.baseUrl+'/get-user-restaurant',username);
  }

  public getItemsByFids(fids:number[]):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-items-by-fids',fids);
  }

  // public changeStatusOfItems(fid:number[]){
  //   return this.http.post(this.baseUrl+'change-status-items',fid,{responseType:'text'});
  // }

  public getListOrdersOfRestaurant(rid:number):Observable<Order[]>{
    return this.http.post<Order[]>(this.baseUrl+'get-list-orders',rid);
  }

  public addOrderToList(oid:number,rid:number){
    return this.http.post(this.baseUrl+'add-list-order',oid+','+rid,{responseType:'text'});
  }

  public getRestaurantAvailableItems(rid:number):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-restaurant-available-items/'+rid,null);
  }

  public getAvailableItemsOfRestaurant(oid:number,rid:number):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-available-restaurant-items',oid+':'+rid);
  }

  public updateFoodItem(item:Food_Item){
    return this.http.post(this.baseUrl+'update-item',item,{responseType:'text'});
  }

  public addCategory(category:Category){
    return this.http.post(this.baseUrl+'add-category',category,{responseType:'text'});
  }

  public addRestaurant(restaurant:Restaurant){
    return this.http.post(this.baseUrl+'add-restaurant',restaurant,{responseType:"text"});
  }
  
  public getAllRestaurants(username:string):Observable<Restaurant[]>{
    return this.http.post<Restaurant[]>(this.baseUrl+'restaurants',username);
  }

  public getAllRestaurantNames(username:string):Observable<string[]>{
    return this.http.post<string[]>(this.baseUrl+'restaurant-names',username);
  }

  public getRestaurantByName(rest:Restaurant):Observable<Restaurant>{
    return this.http.post<Restaurant>(this.baseUrl+'get-restaurant',rest);
  }

  public deleteRestaurant(rid:number){
    return this.http.post(this.baseUrl+"delete-restaurant/"+rid,null,{responseType:"text"});
  }
  
  public getRestaurantByRid(rid:number):Observable<Restaurant>{
    return this.http.post<Restaurant>(this.baseUrl+"get-restaurant-rid",rid);
  }
  
  /*-----------------------------Menu functions------------------------------*/
  public getAllCategories():Observable<Category[]>{
    return this.http.get<Category[]>(this.baseUrl+"all-categories");
  }

  public updateCategoriesOfRestaurant(categories:string,rid:number){
    return this.http.post(this.baseUrl+'update-restaurant-categories/'+rid,categories,{responseType:"text"});
  }

  public getRestaurantCategories(rid:number):Observable<Category[]>{
    return this.http.post<Category[]>(this.baseUrl+'get-restaurant-categories',rid);
  }

  public getFoodItems(cname:string,rid:number):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-food-items/'+rid,cname);
  }

  public addFoodItem(food_item:Food_Item){
    return this.http.post(this.baseUrl+'add-food-item',food_item,{responseType:"text"});
  }

  public addFoodItemPic(file:File){
    let formdata : FormData  = new FormData();
    formdata.append("file",file,file.name);
    return this.http.post(this.baseUrl+'add-food-item-pic',formdata,{responseType:"text"});
  }

  public addRestaurantProfile(file:File){
    let formdata : FormData  = new FormData();
    formdata.append("file",file,file.name);
    return this.http.post(this.baseUrl+'add-restaurant-profile',formdata);
  }

  public updateRestaurant(rest:Restaurant){
    return this.http.post(this.baseUrl+'update-restaurant',rest,{responseType:'text'});
  }

  public getTopFoodItems():Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'top-food-items',null);
  }

  public getAllItems(city:string):Observable<Food_Item[]>{
    return (city==='')? this.http.post<Food_Item[]>(this.baseUrl+'get-all-items',null):
      this.http.post<Food_Item[]>(this.baseUrl+'get-all-city-items',city);
  }

  public getItemsOfKeywords(keyword:string,city:string):Observable<Food_Item[]>{
    return (city==='')?this.http.post<Food_Item[]>(this.baseUrl+'get-keyword-items/'+keyword,null):
      this.http.post<Food_Item[]>(this.baseUrl+'get-city-keyword-items/'+keyword,city);
  }

  public deleteItem(fid:number){
    return this.http.post(this.baseUrl+'delete-item',fid,{responseType:'text'});
  }


}