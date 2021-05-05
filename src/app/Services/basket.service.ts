import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food_Item } from '../Models/Food_Item';
import { Order } from '../Models/Order';
import { Order1 } from '../Models/Order1';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl : string = 'http://localhost:8080/';
  
  constructor(private http:HttpClient) { }
  // In Use
  
  public placeOrder(order:Order1){
    return this.http.post(this.baseUrl+'place-order',order,{responseType:"text"});
  }
  
  public getRestaurantPlacedOrdersByBranch(branch:string,rname:string):Observable<Order1[]>{
    return this.http.post<Order1[]>(this.baseUrl+'get-restaurant-placed-orders/'+rname,branch);
  }
  
  public updateItems(items:Food_Item[]){
    return this.http.post(this.baseUrl+'update-items',items,{responseType:'text'});
  }
  
  public rejectOrder(oid:number){
    return this.http.post(this.baseUrl+'reject-order',oid,{responseType:'text'});
  }
  
  public getOrdersByUsername(username:string):Observable<Order[]>{
    return this.http.post<Order[]>(this.baseUrl+'get-orders',username);
  }
  
  public addItemToOrder(oid:number,item:Food_Item){
    return this.http.post(this.baseUrl+'add-order-item/'+oid,item,{responseType:'text'});
  }






  














  // Not In Use













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


  public cancelOrder(oid:number){
    return this.http.post(this.baseUrl+'cancel-order',oid,{responseType:"text"});
  }

  // public getPlacedOrdersOfBranch(branch:string):Observable<Order[]>{
  //   return this.http.post<Order[]>(this.baseUrl+'get-restaurant-placed-orders',branch);
  // }


  
}
