import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { RestaurantService } from 'src/app/Services/restaurant.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  top_food_items:Food_Item[]=[];
  locations:string[]=[];
  resultedLocations:string[]=[];
  @ViewChild('location') location:ElementRef;

  constructor(private restService:RestaurantService,private router:Router) { }

  ngOnInit(): void {
    this.checkLocation();
  }
  
  checkLocation(){
    (localStorage.getItem('UserLocation')!==null)?this.router.navigate(['Restaurants']):this.getLocations();
  }

  getLocations(){
    this.restService.getLocations().subscribe(data=>{
      if(data==null)return;
      this.locations = data;
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
    localStorage.setItem('UserLocation',location);
    this.router.navigate(['Restaurants']);
  }

  // getTopFoodItems(){
  //   this.restService.getTopFoodItems().subscribe(data=>{
  //     this.top_food_items=data;
  //   });
  // }
}
