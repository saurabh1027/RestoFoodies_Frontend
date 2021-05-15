import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order1 } from 'src/app/Models/Order1';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  resultedLocations : string[] = []
  orders : Order1 [] = []
  locations : string[] = []
  user : User = new User(0,'','','','','','','','','');

  constructor(private restService : RestaurantService,
     private basketService : BasketService,
     private userService : UserService,
     private router : Router) { }


  ngOnInit(): void {
    this.getUserByToken()
    this.getLocations()
  }

  getUserByToken() {
    this.userService.getUserByToken(sessionStorage.getItem("UserToken"))
      .subscribe(data =>{
        if(!data){
          Swal.fire({title : 'Unauthorized Access' , text : 'Make sure to Login!' , icon : 'error'})
          this.router.navigate(["Login"])
        }
        else{
          this.user = data
          if (this.user.role!=('Delivery')){
            this.router.navigate(["Login"])
          }
        }
        this.getFinishedOrdersByLocation()
      })
  }

  getFinishedOrdersByLocation(){
    if(this.user.location){
      this.basketService.getOrdersByLocation(this.user.location).subscribe(data => {
        if(data) this.orders = data
      })
    }
  }

  getLocations(){
    this.restService.getLocations().subscribe(data=>{
      if(data) this.locations = data;
    });
  }

  updateLocations(location : string){
    this.resultedLocations = []
    console.log(location)
    for(let i = 0; i < this.locations.length ; i++)
    {
      if(this.locations[i].toUpperCase().includes(location.toUpperCase()))
      {
        if(!this.resultedLocations.includes(this.resultedLocations[i]))
        this.resultedLocations.push(this.resultedLocations[i])
      }
    }
    console.log(this.resultedLocations)
  }

}
