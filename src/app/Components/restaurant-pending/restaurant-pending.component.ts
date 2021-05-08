import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';

@Component({
  selector: 'app-restaurant-pending',
  templateUrl: './restaurant-pending.component.html',
  styleUrls: ['./restaurant-pending.component.css']
})
export class RestaurantPendingComponent implements OnInit {
  @ViewChild('restSelect') restSelect:ElementRef;
  restaurant:Restaurant=new Restaurant(0,'','','','','','','','');
  user:User=new User(0,'','','','','','','','','');
  pos:{lat:number,lng:number}={lat:0,lng:0};
  lat:number=0;
  lng:number=0;
  orders:Order1[]=[];
  order : Order1 = new Order1(0,'','','','','',0,'','')
  items:Food_Item[]=[];
  cnt:number=0;
  branches:string[]=[];

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
        this.getRestaurantByUsername();
      }else{
        this.router.navigate(['Login']);
      } 
    });
  }
  
  getRestaurantByUsername(){
    this.restService.getRestaurantByUsername(this.user.username).subscribe(data=>{
      if(data){
        this.restaurant=data;
        this.getCurrentLocation();
        this.getBranches(this.restaurant.branch);
      }else{
        this.router.navigate(['Profile','Restaurant']);
      }
    });
  }

  getBranches(branch:string){
    let str:string='';
    for(let i=0;i<branch.length;i++){
      if(branch[i]===','){
        this.branches.push(str);
        str='';
      }else{
        str = str + branch[i];
      }
    }
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos = {lat:position.coords.latitude , lng:position.coords.longitude};
        this.getRestaurantPlacedOrdersByBranch();
      });
    }
  }

  getRestaurantPlacedOrdersByBranch(){
    if(!this.restSelect.nativeElement.value)return;
    this.baskService.getRestaurantPlacedOrdersByBranch(this.restSelect.nativeElement.value,this.restaurant.name).subscribe(data=>{
      if(data){
        this.orders = data;
      }
    });
  }
  
  getItemsOfOrderByOid(oid:number){
    let fids:number[]=[];
    this.cnt = 0;
    for(let i=0;i<this.orders.length;i++){
      if(this.orders[i].oid===oid){
        fids = JSON.parse(this.orders[i].items);
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
    }
  }
  
  // getPlacedOrdersOfBranch(){
  //   if(this.restSelect.nativeElement.value==null || this.restSelect.nativeElement.value==undefined || this.restSelect.nativeElement.value==NaN)return;
  //   this.baskService.getPlacedOrdersOfBranch(this.restSelect.nativeElement.value).subscribe(data=>{
  //     this.orders=data;
  //     this.order = new Order(0,'','','',0,'','');
  //   },error=>console.log(error));
  // }

  getAvailableItemsOfRestaurant(oid:number){
    this.cnt = 0;
    this.restService.getAvailableItemsOfRestaurant(oid,parseInt(this.restSelect.nativeElement.value)).subscribe(data=>{
      this.items = data;
      for(let i=0;i<this.items.length;i++){
        if(this.items[i].status==='Out Of Stock'){
          this.cnt++;
        }
      }
    });
  }

  addOrderToList(oid:number){
    this.restService.addOrderToList(oid,this.restaurant.rid).subscribe(data=>{
      if(!data)return;
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',icon:'success'});
        this.getRestaurantPlacedOrdersByBranch();
        this.items = [];
        this.order = new Order1(0,'','','','','',0,'','');
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
        this.getItemsOfOrderByOid(this.order.oid);
      }
    });
  }

  rejectOrder(oid:number){
    this.baskService.rejectOrder(oid).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',text:'Order Rejected!',icon:'success'});
        this.getRestaurantPlacedOrdersByBranch();
        this.items = [];
        this.order = new Order1(0,'','','','','',0,'','');
      }else{
        Swal.fire({title:'Sorry',text:data,icon:'error'});
      }
    });
  }

}
