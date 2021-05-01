import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Order } from 'src/app/Models/Order';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { UserService } from 'src/app/Services/user.service';
// import Swal from 'sweetalert2';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import { AesCryptoService } from 'src/app/Services/aes-crypto.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  user:User=new User(0,'','','','','','','','');
  rname:string='';
  // orders:Order[]=[];
  pos:{lat:number,lng:number}={lat:0,lng:0};
  // order:Order=new Order(0,'','Unsubmitted','',0,'','');
  // lat1:number=0;
  // lng1:number=0;
  loggedIn:boolean=false;
  // price:number=0;
  // index = 1;
  items:Food_Item[]=[];
  order1:Order1=new Order1(0,'','0,0','','Unsubmitted',[],0,'');
  delivery_charge:number=50;

  constructor(private userService:UserService,private baskService:BasketService,private router:Router) { }

  ngOnInit(): void {
    this.rname = localStorage.getItem('Restaurant');
    this.order1.rname=this.rname;
    this.getUserByToken();
    this.getCurrentLocation();
  }

  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    if(!token){
      this.loggedIn=false;
      this.getItems();
      return;
    }
    this.userService.getUserByToken(token).subscribe(data=>{
      if(!data)this.loggedIn=false;
      else{
        this.user = data;
        this.loggedIn=true;
      }
      this.getItems();
    });
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos={lat:position.coords.latitude,lng:position.coords.longitude};
        this.order1.destination = this.pos.lat+','+this.pos.lng;
      });
    }
  }

  scrollToOrder(){
    setTimeout(() => {
      document.documentElement.scrollTop=725;
    }, 200);
  }
  
  removeItem(fid:number){
    for(let i=0;i<this.items.length;i++){
      if(this.items[i].fid===fid){
        this.items.splice(i,1);
        localStorage.setItem('Food_Items',JSON.stringify(this.items));
        this.getItems();
        break;
      }
    }
  }
  
  manageQuantity(fid:number,bool:boolean){
    for(let i=0;i<this.items.length;i++){
      if(this.items[i].fid===fid){
        if(bool){
          this.items[i].price+=(this.items[i].price/this.items[i].quantity);
          this.items[i].quantity++;
        }else{
          if(this.items[i].quantity===1){
            this.removeItem(this.items[i].fid);
          }else{
            this.items[i].price-=(this.items[i].price/this.items[i].quantity);
            this.items[i].quantity--;
          }
        }
        localStorage.setItem('Food_Items',JSON.stringify(this.items));
        this.getItems();
        break;
      }
    }
  }

  placeOrder(){
    console.log(this.order1);
  }

  getItems(){
    if(!this.loggedIn){
      this.items=JSON.parse(localStorage.getItem('Food_Items'));
      this.order1.price=0;
      this.order1.items = this.items;
      for(let i=0;i<this.items.length;i++){
        this.order1.price += this.items[i].price;
      }
      this.order1.price+=this.delivery_charge;
    }
  }

  changeLocation($event:AGMMouseEvent){
    this.pos = {lat:$event.coords.lat,lng:$event.coords.lng};
    this.order1.destination = this.pos.lat+','+this.pos.lng;
  }

  toggleModel(modelName:string,bool:boolean){
    document.getElementById(modelName).style.display = (bool)?'flex':'none';
  }
  
  // getOrders(){
  //   this.baskService.getOrdersByUsername(this.user.username).subscribe(data=>{
  //     if(data==null)return;
  //     this.orders = data;
  //     this.calculateBasketPrice();
  //   });
  // }
  
  // calculateBasketPrice(){
  //   for(let i=0;i<this.orders.length;i++){
  //     this.price = this.price + this.orders[i].total_price;
  //   }
  // }

  // deleteOrder(oid: number){
  //   if(this.loggedIn)
  //     this.baskService.deleteOrder(oid).subscribe(data=>{
  //       if(data=='Success' || data=='Deleted!'){
  //         Swal.fire({title:'Congratulations!',text:'Order has deleted successfully.',icon:'success'});
  //         this.getOrders();
  //       }else{
  //         Swal.fire({title:data,text:'Unable to delete order.',icon:'error'});
  //       }
  //     });
  //   else{
  //     let orders:Order[] = JSON.parse(localStorage.getItem('orders'));
  //     for(let i=0;i<orders.length;i++){
  //       if(orders[i].oid===oid)orders.splice(i,1);
  //       break;
  //     }
  //     localStorage.setItem('orders',JSON.stringify(orders));
  //     this.getOrders();
  //   }
  // }

  // moveOrders(bool:boolean){
  //   var model = document.getElementById("OrdersModel");
  //   let length=this.orders.length;
  //   let dist = 0;
  //   if(bool){
  //     if(this.index===Math.ceil(length/3)){
  //       this.index = 1;
  //     }else{
  //       this.index++;
  //     }
  //     dist = dist + ((this.index-1) * 100);
  //     model.style.transform = 'translateX(-'+dist+'%)';
  //   }else{
  //     if(this.index===1){
  //       this.index = Math.ceil(length/3);
  //     }else{
  //       this.index--;
  //     }
  //     dist = dist - ((this.index-1) * -100);
  //     model.style.transform = 'translateX('+dist+'%)';
  //   }
  // }

  // toggleBasketMenuModel(){
  //   var model = document.getElementById("BasketMenuModel");
  //   model.style.display = (model.style.display=='flex')?'none':'flex';
  // }

  // toggleAddOrderModel(bool:boolean){
  //   var model = document.getElementById("AddOrderModel");
  //   model.style.display = (bool)?'flex':'none';
  //   if(bool)this.toggleBasketMenuModel();
  // }

  // checkLocation(latlng:string){
  //   this.lat1 = parseFloat(latlng.substring(0,latlng.indexOf(',')));
  //   this.lng1 = parseFloat(latlng.substring(latlng.indexOf(',')+1,latlng.length));
  //   this.toggleMap1(true);
  // }

  // toggleMap1(bool:boolean){
  //   var map = document.getElementById("map1");
  //   map.style.display = (bool)?'block':'none';
  //   if(bool)this.locateLatLng();
  // }

  // addOrderByUsername(){
  //   if(this.loggedIn){
  //     this.order.username = this.user.username;
  //     if(this.order.name==''){
  //       Swal.fire({title:'Empty Order Name!',text:'Enter title of your order.',icon:'error'});
  //     }else if(this.order.location==''){
  //       Swal.fire({title:'Location not Selected!',text:'Make sure to select destination location.',icon:'error'});
  //     }else{
  //       this.baskService.addOrder(this.order).subscribe(data=>{
  //         if(data=='Success'){
  //           this.order = new Order(0,'','Unsubmitted','',0,'','');
  //           Swal.fire({title:'Congratulations!',text:'Order inserted into database.',icon:'success'});
  //           this.toggleAddOrderModel(false);
  //           this.getOrders();
  //         }else{
  //           Swal.fire({title:data,text:'Unable to store in database.',icon:'error'});
  //         }
  //       });
  //     }
  //   }else{
  //     let orders:Order[] = JSON.parse(localStorage.getItem('orders'));
  //     if(orders===null || orders.length===0){
  //       orders=[];
  //       this.order.oid=1;
  //     }else{
  //       for(let i=0;i<orders.length;i++){
  //         if(orders[i].name.trim()===this.order.name){
  //           Swal.fire({title:'Failure',text:'Order with the same name already exists!',icon:'error'});
  //           return;
  //         }
  //       }
  //       let order:Order=orders[orders.length-1];
  //       this.order.oid = order.oid+1;
  //     }
  //     orders.push(this.order);
  //     localStorage.setItem('orders',JSON.stringify(orders));
  //     this.getOrders();
  //     this.toggleAddOrderModel(false);
  //   }
  // }

  // locateLatLng(){
  //   if(navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
  //       this.pos.lat=position.coords.latitude;
  //       this.pos.lng=position.coords.longitude;
  //     });
  //   }
  // }

  // locationChosen($event:AGMMouseEvent){
  //   this.pos.lat=$event.coords.lat;
  //   this.pos.lng=$event.coords.lng;
  // } 

  // toggleMap(bool:boolean){
  //   var map = document.getElementById("map");
  //   if(bool)this.locateLatLng();
  //   map.style.display = (bool)?'block':'none';
  // }

  // chooseLocation(){
  //   this.order.location = this.pos.lat + ',' + this.pos.lng;
  //   this.toggleMap(false);
  // }
}
