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
  orders : Order1[] = []
  locations : string[] = []
  user : User = new User(0,'','','','','','','','','');
  pos:{ lat : number, lng : number } = { lat : 0 , lng : 0 }

  constructor(private restService : RestaurantService,
     private basketService : BasketService,
     private userService : UserService,
     private router : Router) { }

  ngOnInit(): void {
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
        console.log(data)
        if(data) this.orders = data;
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
      document.getElementById('Panel').style.display = 'flex';
      model.style.display = 'flex';
      body.classList.add('model');
    }else{
      document.getElementById('Panel').style.display = 'none';
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

  addOrderToBox(order:Order1){
    order.dname = this.user.username;
    order.status = "Delivering";
    this.basketService.updateOrder(order).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({
          title:'Congratulations!',
          text:'Order added successfully!',
          icon:'success'
        });
        this.getFinishedOrdersByLocation();
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
