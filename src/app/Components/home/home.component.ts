import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  top_food_items:Food_Item[]=[];

  constructor(private restService:RestaurantService) { }

  ngOnInit(): void {
    this.getTopFoodItems();
  }

  getTopFoodItems(){
    this.restService.getTopFoodItems().subscribe(data=>{
      this.top_food_items=data;
    });
  }
}
