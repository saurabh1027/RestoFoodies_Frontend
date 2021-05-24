import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users : User[] = []
  restaurants : Restaurant[] = []

  constructor(private userService : UserService , private router : Router , private restservce : RestaurantService) { }

  ngOnInit(): void {
    document.querySelector('.fa-bars').classList.add('dark-grey');
    this.getUserByRole()
    this.getRestaurants()
  }

  getUserByRole(){
    this.userService.getUserByRole("Delivery").subscribe(data =>{
      if(data){
        this.users = data
      }
    })
  }

  getRestaurants(){
    this.restservce.getRestaurants().subscribe(data =>{
      if(data){
        this.restaurants = data
        console.log(data)
      }
    })
  }

}
