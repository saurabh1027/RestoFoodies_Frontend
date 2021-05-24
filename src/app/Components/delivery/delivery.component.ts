import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order1 } from 'src/app/Models/Order1';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { Restaurant } from 'src/app/Models/Restaurant';
import { Food_Item } from 'src/app/Models/Food_Item';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  resultedLocations : string[] = []
  items : Food_Item[] = [];
  orders : Order1[] = []
  locations : string[] = []
  user : User = new User(0,'','','','','','','','','');
  pos:{ lat : number, lng : number } = { lat : 0 , lng : 0 };
  index : number = 0;
  order:Order1=new Order1(0,'','','0,0','','','',0,0,'','');
  zoom:number = 6;
  restaurant : Restaurant = new Restaurant(0,'','','','','',0);

  constructor(private restService : RestaurantService,
     private basketService : BasketService,
     private userService : UserService,
     private router : Router) { }

  ngOnInit(): void {
    document.querySelector('.fa-bars').classList.add('dark-grey');
    this.getUserByToken();
  }

  getUserByToken() {
    this.userService.getUserByToken(sessionStorage.getItem("UserToken"))
      .subscribe(data =>{
        if(!data){
          Swal.fire({title : 'Unauthorized Access' , text : 'Make sure to Login!' , icon : 'error'})
          this.router.navigate(["Login"])
        }
        else{
          this.user = data;
          if (this.user.role!=('Delivery')){
            this.router.navigate(["Login"])
          }
          if(!this.user.location){
            this.getLocations();
          }
          this.getFinishedOrdersByLocation();
          this.currentLocation();
        }
      })
  }

  getFinishedOrdersByLocation(){
    if(this.user.location){
      this.basketService.getOrdersByLocation(this.user.location).subscribe(data => {
        this.orders = data;
        if(this.orders.length>0){
          this.index = 0;
          this.order = this.orders[0];
          this.getRestaurantByRname(this.order.rname);
          this.getItemsByOrder();
        }else{
          this.orders = [];
          this.index = 0;
          this.order = new Order1(0,'','','0,0','','','',0,0,'','');
          this.items = [];
        }
      })
    }
  }

  currentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos.lat = position.coords.latitude;
        this.pos.lng = position.coords.longitude;
      });
    }
  }

  getLocations(){
    this.restService.getLocations().subscribe(data=>{
      if(data) this.locations = data;
    });
  }

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      document.getElementById('Panel1').style.display = 'flex';
      model.style.display = 'flex';
      body.classList.add('model');
    }else{
      document.getElementById('Panel1').style.display = 'none';
      model.style.display = 'flex';
      body.classList.remove('model');
    }
  }

  updateLocations(location : string){
    this.resultedLocations = [];
    if(location){
      for(let i = 0; i < this.locations.length ; i++)
      {
        if(this.locations[i].toUpperCase().includes(location.toUpperCase()))
        {
          if(!this.resultedLocations.includes(this.resultedLocations[i]))
            this.resultedLocations.push(this.locations[i])
        }
      }
    }
  }

  selectLocation(location:string){
    this.user.location = location;
    this.userService.updateUser(this.user).subscribe();
    this.toggleModel('LocationForm',false);
    this.getFinishedOrdersByLocation();
  }

  pickUpOrder(order:Order1){
    order.dname = this.user.username;
    order.status = "Delivering";
    this.basketService.updateOrder(order).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({
          title:'Congratulations!',
          text:'Order added successfully!',
          icon:'success'
        });
        this.toggleModel("Bill",false);
        this.getFinishedOrdersByLocation();
        this.focusOnMarker(true);
      }else{
        Swal.fire({
          title:'Sorry!',
          text:data,
          icon:'error'
        });
      }
    });
  }

  chooseLocation($event:AGMMouseEvent){
    this.pos = {
      lat : $event.coords.lat ,
      lng : $event.coords.lng
    }
  }

  focusOnMarker(bool:boolean){
    this.zoom = 10;
    if(bool){
      this.pos = {
        lat : parseFloat( this.order.source.substring(0,this.order.source.indexOf(",")) ),
        lng: parseFloat( this.order.source.substring(this.order.source.indexOf(",")+1,this.order.source.length) )
      };
    }else{
      this.pos = {
        lat : parseFloat( this.order.destination.substring(0,this.order.destination.indexOf(",")) ),
        lng: parseFloat( this.order.destination.substring(this.order.destination.indexOf(",")+1,this.order.destination.length) )
      };
    }
  }

  manageOrders(bool:boolean){
    if(bool){
      if( !( this.index==(this.orders.length-1) ) )
      this.order = this.orders[++this.index];
    }else{
      if( !( this.index==0 ) )
      this.order = this.orders[--this.index];
    }
    this.getRestaurantByRname(this.order.rname);
    this.getItemsByOrder();
    this.zoom = 10;
  }

  getRestaurantByRname(rname:string){
    this.restService.getRestaurantByName(rname).subscribe(data=>{
      this.restaurant = data;
    });
  }

  getItemsByOrder(){
    let items : { fids:number[] , quantities:number[] } = { fids:[] , quantities:[] };
    items = JSON.parse(this.order.items);
    this.restService.getItemsByFids(items.fids).subscribe(data=>{
      this.items = data;
      for(let i=0;i<this.items.length;i++){
        this.items[i].price = (this.items[i].price/this.items[i].quantity) * items.quantities[i];
        this.items[i].quantity = items.quantities[i];
      }
    });
  }

}
