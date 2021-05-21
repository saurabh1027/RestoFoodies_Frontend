import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import { MouseEvent as AGMMouseEvent } from '@agm/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  zoom:number = 6;
  user:User=new User(0,'','','','','','','','','');
  orders: Order1[] = [];
  items: Food_Item[] = [];
  index : number = 0;
  order:Order1=new Order1(0,'','','0,0','','','',0,0,'','');
  restaurant : Restaurant = new Restaurant(0,'','','','','',0);
  pos:{ lat : number, lng : number } = { lat : 0 , lng : 0 };

  constructor(private userService:UserService,private baskService:BasketService,private restService:RestaurantService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
    this.currentLocation();
  }

  getUserByToken(){
    this.userService.getUserByToken(sessionStorage.getItem("UserToken")).subscribe(data=>{
      if(!data){
        Swal.fire({title:'Unauthorized access',text:'Make sure to login!',icon:'error'});
        this.router.navigate(['/Login']);
      }else{
        this.user = data;
        if(this.user.role!=='Delivery')this.router.navigate(['Login']);
        this.getDeliveringOrdersByDname();
      }
    });
  }

  currentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos.lat = position.coords.latitude;
        this.pos.lng = position.coords.longitude;
      });
    }
  }

  getDeliveringOrdersByDname(){
    this.baskService.getDeliveringOrdersByDname(this.user.username).subscribe(data=>{
      this.orders = data;
      if(this.orders.length>0){
        this.order = this.orders[0];
        this.getRestaurantByRname(this.order.rname);
        this.getItemsByOrder();
      }else{
        this.orders = [];
      }
    });
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

  chooseLocation($event:AGMMouseEvent){
    this.pos = {
      lat : $event.coords.lat ,
      lng : $event.coords.lng
    }
  }

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      document.getElementById('Panel').style.display = 'flex';
      model.style.display = 'flex';
      body.classList.add('model');
    }else{
      document.getElementById('Panel').style.display = 'none';
      model.style.display = 'flex';
      body.classList.remove('model');
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

  deliverOrder(order:Order1){
    order.status = "Delivered";
    this.baskService.updateOrder(order).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({
          title:'Congratulations!',
          text:'Order delivered successfully!',
          icon:'success'
        });
        this.toggleModel("Bill",false);
        this.getDeliveringOrdersByDname();
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

}
