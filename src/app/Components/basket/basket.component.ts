import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/Models/Order';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import { MouseEvent as AGMMouseEvent } from '@agm/core';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  user:User=new User(0,'','','','','','','');
  orders:Order[]=[];
  order:Order=new Order(0,'','Unsubmitted','',0,'');
  lat:number=0;
  lng:number=0;
  lat1:number=0;
  lng1:number=0;
  price:number=0;
  index = 1;

  //status:not placed,placed,producing,shipping,delivering,delivered

  constructor(private userService:UserService,private baskService:BasketService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = localStorage.getItem("UserToken");
    this.userService.getUserByToken(token).subscribe(data=>{
      if(data==null){
        Swal.fire({icon:'error', title:'Invalid Request', text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }   
      this.user = data;
      if(this.user.role!=='Customer'){
        Swal.fire({title:'Unauthorised access',text:'Only Customers are allowed on this page!',icon:'error'});
        this.router.navigate(['/Profile']);
      }
      this.getOrdersByUsername(this.user.username);
    },error=>{
      if(error.status==400){
        Swal.fire({icon:'error', title:'Invalid Request', text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }
    });
  }
  
  getOrdersByUsername(username:string){
    this.baskService.getOrdersByUsername(username).subscribe(data=>{
      this.orders = data;
      if(this.orders.length>0)this.calculateBasketPrice();
    });
  }
  
  calculateBasketPrice(){
    for(let i=0;i<this.orders.length;i++){
      this.price = this.price + this.orders[i].total_price;
    }
  }

  deleteOrder(oid: number){
    this.baskService.deleteOrder(oid).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',text:'Order has delete successfully.',icon:'success'});
        this.getOrdersByUsername(this.user.username);
      }else if(data=='Deleted!'){
        Swal.fire({title:data,text:'Order Deleted',icon:'success'});
        this.getOrdersByUsername(this.user.username);
      }else{
        Swal.fire({title:data,text:'Unable to delete order.',icon:'error'});
      }
    });
  }

  moveOrders(bool:boolean){
    var model = document.getElementById("OrdersModel");
    let length=10;
    let dist = 0;
    if(bool){
      if(this.index===Math.ceil(length/3)){
        this.index = 1;
      }else{
        this.index++;
      }
      dist = dist + ((this.index-1) * 100);
      model.style.transform = 'translateX(-'+dist+'%)';
    }else{
      if(this.index===1){
        this.index = Math.ceil(length/3);
      }else{
        this.index--;
      }
      dist = dist - ((this.index-1) * -100);
      model.style.transform = 'translateX('+dist+'%)';
    }
  }

  toggleBasketMenuModel(){
    var model = document.getElementById("BasketMenuModel");
    model.style.display = (model.style.display=='flex')?'none':'flex';
  }

  toggleAddOrderModel(bool:boolean){
    var model = document.getElementById("AddOrderModel");
    model.style.display = (bool)?'flex':'none';
    if(bool)this.toggleBasketMenuModel();
  }

  checkLocation(latlng:string){
    this.lat1 = parseFloat(latlng.substring(0,latlng.indexOf(',')));
    this.lng1 = parseFloat(latlng.substring(latlng.indexOf(',')+1,latlng.length));
    this.toggleMap1(true);
  }

  toggleMap1(bool:boolean){
    var map = document.getElementById("map1");
    map.style.display = (bool)?'block':'none';
    if(bool)this.locateLatLng();
  }

  addOrderByUsername(){
    this.order.username = this.user.username;
    if(this.order.name==''){
      Swal.fire({title:'Empty Order Name!',text:'Enter title of your order.',icon:'error'});
      return;
    }
    else if(this.order.location==''){
      Swal.fire({title:'Location not Selected!',text:'Make sure to select destination location.',icon:'error'});
      return;
    }
    this.baskService.addOrder(this.order).subscribe(data=>{
      if(data=='Success'){
        this.order = new Order(0,'','Unsubmitted','',0,'');
        Swal.fire({title:'Congratulations!',text:'Order inserted into database.',icon:'success'});
        this.toggleAddOrderModel(false);
        this.getOrdersByUsername(this.user.username);
      }else{
        Swal.fire({title:data,text:'Unable to store in database.',icon:'error'});
      }
    });
  }

  locateLatLng(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        const pos = {
          lat:position.coords.latitude,lng:position.coords.longitude
        }
        this.lat = pos.lat;
        this.lng = pos.lng;
      });
    }
  }

  locationChosen($event:AGMMouseEvent){
    this.lat=$event.coords.lat;
    this.lng=$event.coords.lng;
  } 

  toggleMap(bool:boolean){
    var map = document.getElementById("map");
    if(bool)this.locateLatLng();
    map.style.display = (bool)?'block':'none';
  }

  chooseLocation(){
    this.order.location = this.lat + ',' + this.lng;
    this.toggleMap(false);
  }
}
