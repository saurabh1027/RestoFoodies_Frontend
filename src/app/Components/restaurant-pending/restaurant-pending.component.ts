import { Component , OnInit, ViewChild } from '@angular/core';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import { Branch } from 'src/app/Models/Branch';

@Component({
  selector: 'app-restaurant-pending',
  templateUrl: './restaurant-pending.component.html',
  styleUrls: ['./restaurant-pending.component.css']
})
export class RestaurantPendingComponent implements OnInit {
  restaurant:Restaurant=new Restaurant(0,'','','','','',0);
  user:User=new User(0,'','','','','','','','','');
  pos:{lat:number,lng:number}={lat:0,lng:0};
  orders:Order1[]=[];
  order : Order1 = new Order1(0,'','','','','','',0,0,'','')
  items:Food_Item[]=[];
  cnt:number=0;
  branches:Branch[]=[];

  constructor(private restService:RestaurantService,private baskService:BasketService,private userService:UserService
    ,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    this.userService.getUserByToken(token).subscribe(data=>{
      if(data){
        this.user = data;
        if(!(this.user.role==='Vendor')) this.router.navigate(['Profile']);
        this.getRestaurantByUid();
      }else{
        this.router.navigate(['Login']);
      } 
    });
  }
  
  getRestaurantByUid(){
    this.restService.getRestaurantByUid(this.user.uid).subscribe(data=>{
      if(data){
        this.restaurant=data;
        this.getCurrentLocation();
        this.getBranches();
      }else{
        this.router.navigate(['Profile','Restaurant']);
      }
    });
  }

  getBranches(){
    this.restService.getBranches(this.restaurant.rid).subscribe(data=>{
      if(data){
        this.branches = data;
        this.pos.lat = parseFloat(this.branches[0].location.substring(0,this.branches[0].location.indexOf(',')));
        this.pos.lng = parseFloat(this.branches[0].location.substring(this.branches[0].location.indexOf(',')+1
        ,this.branches[0].location.length));
        this.getRestaurantPlacedOrdersByBid(this.branches[0].bid);
      }
    });
  }
  
  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos = {lat:position.coords.latitude , lng:position.coords.longitude};
      });
    }
  }
  
  getRestaurantPlacedOrdersByBid(bid:number){
    if(bid==0)return;
    this.baskService.getRestaurantOrdersByBid('Placed',bid,this.restaurant.name).subscribe(data=>{
      if(data){
        this.orders = data;
      }
    });
  }
  
  getItemsOfOrder(){
    this.cnt = 0;
    let fids : number[] = JSON.parse(this.order.items);
    this.restService.getItemsByFids(fids).subscribe(data=>{
      this.items = (data)?data:[];
      for(let i=0;i<this.items.length;i++){
        if(this.items[i].status==='Out Of Stock'){
          this.cnt++;
        }
      }
      setTimeout(() => {
        document.documentElement.scrollTop=725;
      }, 200);
    });
  }
  
  acceptOrder(order:Order1){
    order.status = 'Accepted';
    this.baskService.updateOrder(order).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',icon:'success'});
        this.getRestaurantPlacedOrdersByBid(this.branches[0].bid);
        this.items = [];
        this.order = new Order1(0,'','','','','','',0,0,'','');
      }else{
        Swal.fire({title:'Sorry!',text:data,icon:'error'});
      }
    });
  }

  changeStatus(){
    for(let i=0;i<this.items.length;i++){
      this.items[i].status = 'Available';
    }
    this.baskService.updateItems(this.items).subscribe(data=>{
      if(data==='Success'){
        this.cnt = 0;
        this.getItemsOfOrder();
      }
    });
  }

  rejectOrder(order:Order1){
    order.status = 'Rejected';
    this.baskService.updateOrder(order).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',text:'Order Rejected!',icon:'success'});
        this.getRestaurantPlacedOrdersByBid(this.branches[0].bid);
        this.items = [];
        this.order = new Order1(0,'','','','','','',0,0,'','');
      }else{
        Swal.fire({title:'Sorry',text:data,icon:'error'});
      }
    });
  }

}
