import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { UserService } from 'src/app/Services/user.service';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  user:User=new User(0,'','','','','','','','','');
  rname:string='';
  pos:{lat:number,lng:number}={lat:0,lng:0};
  loggedIn:boolean=false;
  items:Food_Item[]=[];
  order1:Order1=new Order1(0,'','0,0','','Placed','',0,'','');
  delivery_charge:number=50;

  constructor(private userService:UserService,private baskService:BasketService,private router:Router) { }

  ngOnInit(): void {
    this.rname = localStorage.getItem('Restaurant');
    this.order1.rname=this.rname;
    this.getUserByToken();
    this.getCurrentLocation();
  }

  getUserByToken(){
    let token = sessionStorage.getItem("UserToken");
    if(!token){
      this.loggedIn=false;
      this.getItems();
      return;
    }
    this.userService.getUserByToken(token).subscribe(data=>{
      if(!data)this.loggedIn=false;
      else{
        this.user = data;
        if(this.user.role!=="Customer"){
          this.router.navigate(['Profile']);
        }
        this.loggedIn=true;
      }
      this.getItems();
    });
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
    let fids:number[]=[];
    if(!this.loggedIn){
      if(JSON.parse(localStorage.getItem('Food_Items'))!=null){
        this.items=JSON.parse(localStorage.getItem('Food_Items'));
        this.order1.price=0;
        this.order1.branch = localStorage.getItem('UserLocation');
        for(let i=0;i<this.items.length;i++){
          fids.push(this.items[i].fid);
        }
        this.order1.items = JSON.stringify(fids);
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

  toggleMap(modelName:string,bool:boolean){
    document.getElementById(modelName).style.display = (bool)?'flex':'none';
  }

}