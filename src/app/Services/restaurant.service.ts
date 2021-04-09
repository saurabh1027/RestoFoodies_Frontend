import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../Models/Category';
import { Food_Item } from '../Models/Food_Item';
import { Restaurant } from '../Models/Restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  baseUrl : string = 'http://localhost:8080/';

  constructor(private http:HttpClient) { }

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

  public saveRestaurantImages(files:FileList,rid:number){
    let formdata : FormData = new FormData();
    for(let i=0;i<files.length;i++){
      formdata.append('file',files[i],files[i].name);
    }
    return this.http.post(this.baseUrl+'save-restaurant-images/'+rid,formdata,{responseType:'text'});
  }

  public deleteImageOfRestaurant(img:string,rid:number){
    return this.http.post(this.baseUrl+"delete-restaurant-image/"+rid,img,{responseType:"text"});
  }

  public deleteRestaurant(rid:number,username:string){
    return this.http.post(this.baseUrl+"delete-restaurant/"+rid,username,{responseType:"text"});
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

  public updateRestaurant(rest:Restaurant){
    return this.http.post(this.baseUrl+'update-restaurant',rest,{responseType:'text'});
  }

  public getTopFoodItems():Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'top-food-items',null);
  }

  public getAllItems():Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-all-items',null);
  }

  public getItemsOfKeywords(keyword:string):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-keyword-items',keyword);
  }

}
