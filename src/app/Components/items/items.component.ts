import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order } from 'src/app/Models/Order';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  user:User=new User(0,'','','','Customer','','','','','user.jpg');
  keyword:string='';
  orders:Order[]=[];
  items:Food_Item[]=[];
  fid:number=0;
  food_item:Food_Item=null;

  constructor(private baskService:BasketService,private activeRouter:ActivatedRoute,private restService:RestaurantService,private userService:UserService) { }

  ngOnInit(): void {
    this.keyword = this.activeRouter.snapshot.paramMap.get('keyword');
    this.restService.getItemsOfKeywords(this.keyword,this.user.location).subscribe(data=>this.items=data);
    this.getUserByToken();
  }

  addItemToBasket(){
    let oid:number = $('select[name="order"]')[0].value;
    this.baskService.addItemToOrder(oid,this.food_item).subscribe(data=>{
      (data==='Success')?Swal.fire({title:'Congratulations!',text:'Item added in order successfully!',icon:'success'}):Swal.fire({title:"Failure",text:data,icon:'error'});
      if(data=='Success'){
        this.baskService.getOrdersByUsername(this.user.username).subscribe(data=>{
          if(data!=null){
            this.orders=data;
          }
        });
      }
    });
  }

  getUserByToken(){
    let token = sessionStorage.getItem('UserToken');
    if(token==null)return;
    this.userService.getUserByToken(token).subscribe(data=>{
      this.user=data;
      this.baskService.getOrdersByUsername(this.user.username).subscribe(data=>{
        if(data!=null){
          this.orders=data;
        }
      });
    });
  }

  toggleAddBasketModel(bool:boolean,item:Food_Item){
    let model = document.getElementById('AddBasketModel')
    if(bool){
      model.style.display = "flex";
      this.food_item = item;
    }else{
      model.style.display = "none";
    }
  }

}
