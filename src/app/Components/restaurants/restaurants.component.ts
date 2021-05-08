import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants:Restaurant[]=[];
  user:User=new User(0,'','','','','','','','','');

  constructor(private router:Router,private userService:UserService,private restService:RestaurantService) { }

  ngOnInit(): void {
    this.getUserByToken();
    this.checkLocation();
  }

  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    if(token){
      this.userService.getUserByToken(token).subscribe(data=>{
        if(data){
          this.user = data;
          if(this.user.role!=="Customer"){
            this.router.navigate(['Profile']);
          }
          this.getRestaurantsByLocation(this.user.location);
        }
      });
    }
  }

  checkLocation(){
    (localStorage.getItem('UserLocation')===null)?this.router.navigate(['']):this.getRestaurantsByLocation(localStorage.getItem('UserLocation'));
  }

  getRestaurantsByLocation(location:string){
    this.restService.getRestaurantsByLocation(location).subscribe(data=>{
      if(data){
        this.restaurants = data;
      }
    });
  }

}
