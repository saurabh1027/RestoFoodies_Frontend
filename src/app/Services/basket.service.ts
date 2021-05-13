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

  public updateOrder(order:Order1){
    return this.http.post(this.baseUrl+'update-order',order,{responseType:'text'})
  }

  public getOrdersByContact(contact:string):Observable<Order1[]>{
    return this.http.post<Order1[]>(this.baseUrl+'get-order-by-contact')
  }

}