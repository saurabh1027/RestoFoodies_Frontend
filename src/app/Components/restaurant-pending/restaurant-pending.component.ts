import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/Models/Order';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-restaurant-pending',
  templateUrl: './restaurant-pending.component.html',
  styleUrls: ['./restaurant-pending.component.css']
})
export class RestaurantPendingComponent implements OnInit {
  @Input() user:User;
  restaurants:Restaurant[]=[];
  lat:number=0;
  lng:number=0;
  orders:Order[]=[];

  constructor(private restService:RestaurantService,private baskService:BasketService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getAllRestaurants();
    }, 500);
  }
  
  getAllRestaurants(){
    this.restService.getAllRestaurants(this.user.username).subscribe(data=>{
      this.restaurants=data;
      this.getCurrentLocation();
    });
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        const pos = {
          lat:position.coords.latitude,
          lng:position.coords.longitude
        }
        this.lat = pos.lat;
        this.lng = pos.lng;
        this.getOrdersOfRestaurant();
      });
    }
  }
  
  getOrdersOfRestaurant(){
    this.baskService.getOrdersOfRestaurant(parseInt($('#restSelect')[0].value)).subscribe(data=>{
      this.orders=data;
    });
  }

  toggleOrderModel(oid:number){
    console.log(oid);
  }

}
