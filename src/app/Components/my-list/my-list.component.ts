import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order } from 'src/app/Models/Order';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {
  @ViewChild('select') select:ElementRef;
  @ViewChild('arrow') arrow:ElementRef;
  user:User=new User(0,'','','','','','','','');
  restaurants:Restaurant[]=[];
  orders:Order[]=[];
  rid:number=0;
  items:Food_Item[]=[];

  constructor(private userService:UserService,private restService:RestaurantService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  toggleModel(modelName:string,bool:boolean){
    
  }

  getUserByToken(){
    let token = localStorage.getItem("UserToken");
    this.userService.getUserByToken(token).subscribe(data=>{
      this.user = data;
      this.getAllRestaurants();
    },error=>{
      if(error.status==400){
        Swal.fire({icon:'error',title:'Invalid Request',text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }
    });
  }

  getAllRestaurants(){
    this.restService.getAllRestaurants(this.user.username).subscribe(data=>{
      this.restaurants=data;
      if(this.restaurants.length<=0){
        this.router.navigate(['Profile/My-Restaurants']);
        return;
      }
      setTimeout(() => {
        this.getListOrdersOfRestaurant();
      }, 300);
    });
  }

  getListOrdersOfRestaurant(){
    this.restService.getListOrdersOfRestaurant(parseInt(this.select.nativeElement.value)).subscribe(data=>{
      if(data==null)return;
      this.orders = data;
    });
  }

  getAvailableItemsOfRestaurant(oid:number){
    this.restService.getAvailableItemsOfRestaurant(oid,parseInt(this.select.nativeElement.value)).subscribe(data=>{
      this.items = data;
    });
  }

}
