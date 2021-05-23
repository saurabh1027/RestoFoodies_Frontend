import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { UserService } from 'src/app/Services/user.service';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import Swal from 'sweetalert2';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { Restaurant } from 'src/app/Models/Restaurant';
import { Branch } from 'src/app/Models/Branch';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  otp:number[]=[];
  user:User=new User(0,'','','','','','','','','');
  rname:string='';
  pos:{lat:number,lng:number}={lat:0,lng:0};
  loggedIn:boolean=false;
  items:Food_Item[]=[];
  orders:Order1[]=[];
  order1:Order1=new Order1(0,'','','0,0','','Placed','',0,0,'','');
  delivery_charge:number=50;
  @ViewChild('contactValue') contact:ElementRef;
  restaurant : Restaurant = new Restaurant(0,'','','','','nothing.png',0);
  branch:Branch=new Branch(0,'','',0);

  constructor(private userService:UserService,private restService:RestaurantService,private baskService:BasketService,private router:Router) { }
  
  ngOnInit(): void {
    this.getUserByToken();
    this.getRestaurantByName();
    this.getCurrentLocation();
  }  
  
  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    if(!token){
      this.loggedIn=false;
      this.getItems();
    }else{
      this.userService.getUserByToken(token).subscribe(data=>{
        if(!data)this.loggedIn=false;
        else{
          this.user = data;
          if(this.user.role!=="Customer"){
            this.router.navigate(['Profile']);
          }
          this.user.contact = '';
          this.loggedIn=true;
        }
        this.getItems();
      });
    }
  }

  getRestaurantByName(){
    if(localStorage.getItem('Restaurant')){
      this.order1.rname = localStorage.getItem('Restaurant');
      this.restService.getRestaurantByName(this.order1.rname).subscribe(data=>{
        if(data){
          this.restaurant=data;
          this.getBranchOfRestaurant();
        }  
      });  
    }
  }  

  getBranchOfRestaurant(){
    let location:string = '';
    if(this.loggedIn){
      location = this.user.location;
    }else{
      location = localStorage.getItem('UserLocation');
    }  
    this.restService.getBranchOfRestaurantByLocation(location,this.restaurant.rid).subscribe(data=>{
      if(data){
        this.branch = data;
      }  
    });  
  }  
  
  validateOtp(){
    let str:string = '';
    for(let i=0;i<4;i++){
      str += this.otp[i];
    }  
    if(str==='8888'){
      this.user.contact = this.contact.nativeElement.value;
      this.baskService.getOrdersByContact(this.user.contact).subscribe(data=>{
        if(data){
          this.orders = data;
        }  
      });  
      this.toggleModel("OtpForm",false);
    }else{
      Swal.fire({title:'Unauthorized Access',text:'OTP do not match!',icon:'error'});
    }  
  }  

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos={lat:position.coords.latitude,lng:position.coords.longitude};
        this.order1.destination = this.pos.lat+','+this.pos.lng;
      });
    }
  }

  removeItem(fid:number){
    for(let i=0;i<this.items.length;i++){
      if(this.items[i].fid===fid){
        this.items.splice(i,1);
        localStorage.setItem('Food_Items',JSON.stringify(this.items));
        this.getItems();
        break;
      }
    }
  }
  
  manageQuantity(fid:number,bool:boolean){
    for(let i=0;i<this.items.length;i++){
      if(this.items[i].fid===fid){
        if(bool){
          this.items[i].price+=(this.items[i].price/this.items[i].quantity);
          this.items[i].quantity++;
        }else{
          if(this.items[i].quantity===1){
            this.removeItem(this.items[i].fid);
          }else{
            this.items[i].price-=(this.items[i].price/this.items[i].quantity);
            this.items[i].quantity--;
          }
        }
        localStorage.setItem('Food_Items',JSON.stringify(this.items));
        this.getItems();
        break;
      }
    }
  }

  placeOrder(){
    this.order1.source = this.branch.location;
    this.order1.bid = this.branch.bid;
    this.baskService.placeOrder(this.order1).subscribe(data=>{
      if(data==='Success'){
        Swal.fire({
          title:'Congratulations!',
          text:'Order is placed.',
          icon:'success'
        });
        localStorage.removeItem('Restaurant');
        localStorage.removeItem('Food_Items');
        this.rname='';
        this.items=[];
      }else{
        Swal.fire({
          title:data,
          text:'Unable to place order.',
          icon:'error'
        });
      }
    });
  }

  getItems(){
    let items : {fids:number[],quantities:number[]} = {fids:[],quantities:[]};
    // let fids:number[]=[];
    if(!this.loggedIn){
      if(JSON.parse(localStorage.getItem('Food_Items'))!=null){
        this.items=JSON.parse(localStorage.getItem('Food_Items'));
        this.order1.price=0;
        this.order1.bid = this.branch.bid;
        for(let i=0;i<this.items.length;i++){
          items.fids.push(this.items[i].fid);
          items.quantities.push(this.items[i].quantity);
        }
        this.order1.items = JSON.stringify(items);
        for(let i=0;i<this.items.length;i++){
          this.order1.price += this.items[i].price;
        }
        this.order1.price+=this.delivery_charge;
      }
    }
  }

  changeLocation($event:AGMMouseEvent){
    this.pos = {lat:$event.coords.lat,lng:$event.coords.lng};
    this.order1.destination = this.pos.lat+','+this.pos.lng;
  }

  toggleModel(modelName:string,bool:boolean){
    let body = document.getElementsByTagName('body')[0];
    let model = document.getElementById(modelName);
    if(bool){
      document.getElementById('Panel').style.display = 'flex';
      body.classList.add('model');
      model.style.display = 'flex';
    }else{
      document.getElementById('Panel').style.display = 'none';
      body.classList.remove('model');
      model.style.display = 'none';
    }
  }

  toggleMap(mapName:string,modelName:string,bool:boolean){
    let map = document.getElementById(mapName);
    let model = document.getElementById(modelName);
    if(bool){
      map.style.display = 'flex';
      model.style.display = 'none';
    }else{
      map.style.display = 'none';
      model.style.display = 'flex';
    }
  }

}