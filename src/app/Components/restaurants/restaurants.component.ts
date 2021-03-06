import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants:Restaurant[]=[];
  user:User=new User(0,'','','','Customer','','','','','');
  loggedIn:boolean=false;

  constructor(private router:Router,private userService:UserService,private restService:RestaurantService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    if(token){
      this.userService.getUserByToken(token).subscribe(data=>{
        if(data){
          this.user = data;
          if(!this.user.location){
            this.router.navigate(['/']);
          }
          this.loggedIn = true;
          this.checkLocation();
        }
      });
    }else{
      this.checkLocation();
    }
  }

  changeLocation(){
    (this.loggedIn) ? this.user.location = '' : localStorage.removeItem('UserLocation');
    this.router.navigate(['']);
  }

  checkLocation(){
    (this.user.role!=="Customer") ? this.router.navigate(['Profile']):(
      (this.user.location) ? this.getRestaurantsByLocation(this.user.location) : (
        (localStorage.getItem('UserLocation')) ? this.getRestaurantsByLocation(localStorage.getItem('UserLocation')) : this.router.navigate([''])
      )
    );
  }

  getRestaurantsByLocation(location:string){
    this.restService.getRestaurantsByLocation(location).subscribe(data=>{
      if(data){
        this.restaurants = data;
      }
    });
  }

}
