import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/Models/Category';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
import { Restaurant } from 'src/app/Models/Restaurant';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurant-profile',
  templateUrl: './restaurant-profile.component.html',
  styleUrls: ['./restaurant-profile.component.css']
})
export class RestaurantProfileComponent implements OnInit {
  restaurant:Restaurant=new Restaurant(0,'','','','','',0);
  restCategories:Category[]=[];
  food_items:Food_Item[]=[];
  items:Food_Item[]=[];
  loggedIn:boolean=false;
  item:Food_Item=new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);
  orders:Order1[]=[];
  user:User=new User(0,'','','','','','','','','');

  constructor(private baskService:BasketService,private restService:RestaurantService,private active:ActivatedRoute,
    private userService:UserService,private router:Router) { }

  ngOnInit(): void {
    this.isLoggedIn();
    this.getRestaurantByName(this.active.snapshot.paramMap.get('rname'));
  }

  isLoggedIn(){
    let token = sessionStorage.getItem('UserToken');
    if(token==null)this.loggedIn = false;
    else{
      this.userService.getUserByToken(token).subscribe(data=>{
        if(data){
          this.user=data;
          if(this.user.role!=='Customer'){
            this.router.navigate(['Profile']);
          }
          this.loggedIn=true;
        }else{
          this.loggedIn=false;
        }
      });
    }
  }

  getRestaurantByName(rname:string){
    this.restService.getRestaurantByName(rname).subscribe(data=>{
      if(!data){
        Swal.fire({title:'Error Occured',text:'Something went wrong!',icon:'error'});
      }else{
        this.restaurant = data;
        this.getCategoriesOfRestaurant();
        this.getOrders();
      }
    });
  }

  getCategoriesOfRestaurant(){
    this.restCategories = [];
    let str:string = '';
    let cnames:string[]=[];
    for(let i=0;i<this.restaurant.categories.length;i++){
      if(this.restaurant.categories[i]==','){
        cnames.push(str);
        str = '';
      }else{
        str += this.restaurant.categories[i];
      }
    }
    this.restService.getCategoriesByCnames(cnames).subscribe(data=>{
      this.restCategories = data;
      this.getFoodItems();
    });
  }

  getFoodItems(){
    this.restService.getRestaurantItems(this.restaurant.rid,'Available').subscribe(data=>{
      this.food_items = (data===null)?[]:data;
      this.getCategoryFoodItems("All");
    });
  }

  getCategoryFoodItems(cname:string){
    let category = document.getElementsByClassName("category-name");
    for(let i=0;i<category.length;i++){
      (category[i].innerHTML==cname)?category[i].classList.add("selected"):category[i].classList.remove("selected");
    }
    this.items=[];
    if(cname=="All")this.items=this.food_items;
    else{
      for(let i=0;i<this.food_items.length;i++){
        if(this.food_items[i].cname==cname)
          this.items.push(this.food_items[i]);
      }
    }
  }

  getOrders(){
    (this.loggedIn)?
    this.baskService.getOrdersByUsername(this.user.username).subscribe(data=>{
      this.orders = data;
    }):
    this.orders = JSON.parse(localStorage.getItem('orders'));
  }
  
  addItem(item:Food_Item){
    let rname:string = localStorage.getItem('Restaurant');
    let items:Food_Item[]=[];
    //If restaurant is same
    if(rname==this.restaurant.name){
      items=JSON.parse(localStorage.getItem('Food_Items'));
      if(items==null || items==undefined){
        items=[];
      }
    }else{
      localStorage.setItem('Restaurant',this.restaurant.name);
      items=[];
    }
    let bool:boolean=false;
    for(let i=0;i<items.length;i++){
      if(items[i].fid===item.fid){
        items[i].quantity+=item.quantity;
        items[i].price+=item.price;
        bool=true;
      }
    }
    if(!bool)items.push(item);
    localStorage.setItem('Food_Items',JSON.stringify(items));
    Swal.fire({
      title:'Added to basket',
      icon:'success'
    });
  }

  toggleModel(modelName:string,bool:boolean){
    document.getElementById(modelName).style.display = (bool)?'flex':'none';
  }

  addItemToOrder(oid:number){
    alert(oid);
    this.baskService.addItemToOrder(oid,this.item).subscribe(data=>console.log(data));
  }

}