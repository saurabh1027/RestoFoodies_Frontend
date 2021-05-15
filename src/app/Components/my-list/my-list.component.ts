import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.css']
})
export class MyListComponent implements OnInit {
  restaurant:Restaurant=new Restaurant(0,'','','','','','','','');
  @ViewChild('select') select:ElementRef;
  @ViewChild('arrow') arrow:ElementRef;
  user:User=new User(0,'','','','','','','','','');
  restaurants:Restaurant[]=[];
  orders:Order1[]=[];
  pos:{lat:number,lng:number} = {lat:0,lng:0};
  rid:number=0;
  items:Food_Item[]=[];
  branches:string[]=[];
  order:Order1 = new Order1(0,'','','','','',0,'','');
  count:number = 0;

  constructor(private userService:UserService,private restService:RestaurantService,private baskService:BasketService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = sessionStorage.getItem('UserToken');
    if(!token)this.router.navigate(['Login']);
    else{
      this.userService.getUserByToken(token).subscribe(data=>{
        if(!data)this.router.navigate(['Login']);
        else{
          this.user = data;
          if(this.user.role!='Vendor')this.router.navigate(['Profile']);
          this.getRestaurantByUsername();
        }
      });
    }
  }

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      model.style.display = 'flex';
      body.classList.add('model');
      document.getElementById('Panel1').style.display = 'flex';
    }else{
      model.style.display = 'none';
      body.classList.remove('model');
      document.getElementById('Panel1').style.display = 'none';
    }
  }

  changeLocation(){
    this.pos.lat = parseFloat(this.order.destination.substring( 0,this.order.destination.indexOf(',') ));
    this.pos.lng = parseFloat(this.order.destination.substring( this.order.destination.indexOf(',')+1,this.order.destination.length ));
  }

  finishOrder(){
    alert('No action specified.');
    return;
    this.order.status = 'Finished';
    this.baskService.updateOrder(this.order).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations',text:'Order is submitted successfully!',icon:'success'});
        this.getListOrdersOfRestaurantByBranch(this.branches[0]);
        this.items = [];
        this.order = new Order1(0,'','','','','',0,'','');
      }
      else{
        Swal.fire({title:'Sorry!',text:data,icon:'error'});
      }
    });
  }

  getRestaurantByUsername(){
    this.restService.getRestaurantByUsername(this.user.username).subscribe(data=>{
      if(data){
        this.restaurant = data;
        this.getBranches();
      }else{
        this.router.navigate(['Profile','Restaurant']);
      }
    });
  }

  getBranches(){
    let branches:string = this.restaurant.branch;
    let str:string = '';
    for(let i=0;i<branches.length;i++){
      if(branches.charAt(i)==','){
        this.branches.push(str);
        str='';
      }else{
        str = str + branches.charAt(i);
      }
    }
    this.getListOrdersOfRestaurantByBranch(this.branches[0]);
  }

  getListOrdersOfRestaurantByBranch(branch:string){
    this.baskService.getRestaurantOrdersByBranch('Accepted',branch,this.restaurant.name).subscribe(data=>{
      if(data){
        this.orders = data;
      }
    });
  }

  getAvailableItemsOfOrder(order:Order1){
    let fids:number[] = JSON.parse(order.items);
    this.restService.getItemsByFids(fids).subscribe(data=>{
      if(!data)return;
      this.items = data;
      this.count = this.items.length;
    });
  }

}
