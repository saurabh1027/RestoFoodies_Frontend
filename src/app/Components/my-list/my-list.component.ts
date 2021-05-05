import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order1 } from 'src/app/Models/Order1';
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
  restaurant:Restaurant=new Restaurant(0,'','','','','','','','','','');
  @ViewChild('select') select:ElementRef;
  @ViewChild('arrow') arrow:ElementRef;
  user:User=new User(0,'','','','','','','','');
  restaurants:Restaurant[]=[];
  orders:Order1[]=[];
  rid:number=0;
  items:Food_Item[]=[];
  branches:string[]=[];

  constructor(private userService:UserService,private restService:RestaurantService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  toggleModel(modelName:string,bool:boolean){
    
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

  getRestaurantByUsername(){
    this.restService.getRestaurantByUsername(this.user.username).subscribe(data=>{
      if(data){
        this.restaurant = data;
        this.getBranches();
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
    this.restService.getListOrdersOfRestaurantByBranch(branch,this.restaurant.rid).subscribe(data=>{
      if(data){
        this.orders = data;
        console.log(data);
      }
    });
  }

  // getListOrdersOfRestaurant(){
  //   this.restService.getListOrdersOfRestaurant(parseInt(this.select.nativeElement.value)).subscribe(data=>{
  //     if(data==null)return;
  //     this.orders = data;
  //   });
  // }

  // getAvailableItemsOfRestaurant(oid:number){
  //   this.restService.getAvailableItemsOfRestaurant(oid,parseInt(this.select.nativeElement.value)).subscribe(data=>{
  //     this.items = data;
  //   });
  // }

}
