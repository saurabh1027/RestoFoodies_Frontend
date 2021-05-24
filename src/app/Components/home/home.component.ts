import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loggedIn : boolean = false;
  user:User=new User(0,'','','','Customer','','','','','');
  top_food_items:Food_Item[]=[];
  locations:string[]=[];
  resultedLocations:string[]=[];
  @ViewChild('location') location:ElementRef;

  constructor(private restService:RestaurantService,private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }
  
  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    if(token){
      this.userService.getUserByToken(token).subscribe(data=>{
        if(data){
          this.user = data;
          if(this.user.role!='Customer') this.router.navigate(['Profile']);
          this.loggedIn = true;
          this.checkLocation();
        }
      });
    }else{
      this.checkLocation();
    }
  }
  
  checkLocation(){
    if(this.loggedIn){
      if(this.user.location) this.router.navigate(['Restaurants']);
    }else{
      if(localStorage.getItem('UserLocation')) this.router.navigate(['Restaurants']);
    }
    this.getLocations();
  }
  
  getLocations(){
    this.restService.getLocations().subscribe(data=>{
      if(data) this.locations = data;
    });
  }

  updateLocations(){
    this.resultedLocations=[];
    let location = this.location.nativeElement.value;
    if(location==='')return;
    for(let i=0;i<this.locations.length;i++){
      if(this.locations[i].toUpperCase().includes(location.toUpperCase()))
        this.resultedLocations.push(this.locations[i]);
    }
  }

  setUserLocation(location:string){
    if(this.loggedIn){
      this.user.location = location;
      this.userService.updateUser(this.user).subscribe(data=>{
        (data=='Success') ? this.router.navigate(['Restaurants']) : Swal.fire({title:'Sorry!',icon:'error'});
      });
    }else{
      localStorage.setItem('UserLocation',location);
      this.router.navigate(['Restaurants']);
    }
  }

}
