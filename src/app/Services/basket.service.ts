import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.post(this.baseUrl+'Order',order,{responseType:"text"});
  }
  
  public getRestaurantOrdersByBid(status:string,bid:number,rname:string):Observable<Order1[]>{
    let params = new HttpParams();
    params = params.append('bid',bid+'');
    params = params.append('status',status);
    return this.http.get<Order1[]>(this.baseUrl+'Restaurants/'+rname+'/Orders',{ params : params });
  }

  public getDeliveringOrdersByDname(dname:string):Observable<Order1[]>{
    return this.http.get<Order1[]>(this.baseUrl+'Delivery/'+dname+'/Orders');
  }

  public updateItems(items:Food_Item[]){
    return this.http.patch(this.baseUrl+'Items',items,{responseType:'text'});
  }
  
  // public getOrdersByUsername(username:string):Observable<Order1[]>{
  //   return this.http.get<Order1[]>(this.baseUrl+'Customers/'+username+'/Orders');
  // }

  public getOrdersByLocation(location : string) : Observable<Order1[]>{
    let params = new HttpParams();
    params = params.append('location',location);
    return this.http.get<Order1[]>(this.baseUrl+'Delivery' , {params : params})
  }
  
  public updateOrder(order:Order1){
    return this.http.patch(this.baseUrl+'Order',order,{responseType:'text'});
  }
  
  public getOrdersByContact(contact:string):Observable<Order1[]>{
    let params:HttpParams = new HttpParams();
    params = params.append('contact',contact);
    return this.http.get<Order1[]>(this.baseUrl+'Orders',{params:params});
  }

  public addItemToOrder(oid:number,item:Food_Item){
    return this.http.post(this.baseUrl+'add-order-item/'+oid,item,{responseType:'text'});
  }
  
}