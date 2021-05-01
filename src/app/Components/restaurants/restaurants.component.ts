import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { RestaurantService } from 'src/app/Services/restaurant.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants:Restaurant[]=[];

  constructor(private router:Router,private restService:RestaurantService) { }

  ngOnInit(): void {
    this.checkLocation();
  }

  checkLocation(){
    (localStorage.getItem('UserLocation')===null)?this.router.navigate(['']):this.getRestaurantsByLocation(localStorage.getItem('UserLocation'));
  }

  getRestaurantsByLocation(location:string){
    this.restService.getRestaurantsByLocation(location).subscribe(data=>{
      this.restaurants = data;
    });
  }

}
