import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food_Item } from '../Models/Food_Item';
import { Order } from '../Models/Order';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl : string = 'http://localhost:8080/';

  constructor(private http:HttpClient) { }

  public addItemToOrder(oid:number,item:Food_Item){
    return this.http.post(this.baseUrl+'add-order-item/'+oid,item,{responseType:'text'});
  }

  public getOrdersByUsername(username:string):Observable<Order[]>{
    return this.http.post<Order[]>(this.baseUrl+'get-orders',username);
  }

  public addOrder(order:Order){
    return this.http.post(this.baseUrl+'add-order',order,{responseType:"text"});
  }

  public deleteOrder(oid:number){
    return this.http.post(this.baseUrl+'delete-order',oid,{responseType:"text"});
  }

  public getOrder(name:string,username:string):Observable<Order>{
    return this.http.post<Order>(this.baseUrl+'get-order/'+name,username);
  }

  public getFoodItemsOfOrder(oid:number):Observable<Food_Item[]>{
    return this.http.post<Food_Item[]>(this.baseUrl+'get-food-items-of-order',oid);
  }

  public removeFoodItemFromOrder(fid:number,oid:number){
    return this.http.post(this.baseUrl+'remove-order-item/'+fid,oid,{responseType:"text"});
  }

  public placeOrder(oid:number){
    return this.http.post(this.baseUrl+'place-order',oid,{responseType:"text"});
  }

  public cancelOrder(oid:number){
    return this.http.post(this.baseUrl+'cancel-order',oid,{responseType:"text"});
  }

  public getPlacedOrdersOfRestaurant(rid:number):Observable<Order[]>{
    return this.http.post<Order[]>(this.baseUrl+'get-restaurant-placed-orders',rid);
  }

  public rejectOrder(oid:number){
    return this.http.post(this.baseUrl+'reject-order',oid,{responseType:'text'});
  }
  
}
