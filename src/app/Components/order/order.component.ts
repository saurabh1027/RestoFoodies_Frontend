import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Order } from 'src/app/Models/Order';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  user:User=new User(0,'','','','Customer','','','','');
  order:Order=new Order(0,'','Unsubmitted','',0,'');
  food_items:Food_Item[]=[];
  @ViewChild('items') items:ElementRef;

  constructor(private userService:UserService,private baskService:BasketService,private router:Router,private activeRouter:ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = localStorage.getItem("UserToken");
    this.userService.getUserByToken(token).subscribe(data=>{
      this.user = data;
      if(this.user.role!=='Customer'){
        Swal.fire({title:'Unauthorised access',text:'Only Customers are allowed on this page!',icon:'error'});
        this.router.navigate(['/Profile']);
      }else
        this.getOrder();
    },error=>{
      if(error.status==400){
        Swal.fire({icon:'error', title:'Invalid Request', text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }
    });
  }

  getOrder(){
    let name = this.activeRouter.snapshot.paramMap.get('name').replace('_',' ');
    this.baskService.getOrder(name,this.user.username).subscribe(data=>{
      if(data==null){
        Swal.fire({title:'Invalid Order-name',icon:'error'});
        this.router.navigate(['Profile','My-Basket']);
        return;
      }
      this.order=data;
      this.getFoodItemsOfOrder(this.order.oid);
    });
  }

  getFoodItemsOfOrder(oid:number){
    this.baskService.getFoodItemsOfOrder(oid).subscribe(data=>{
      this.food_items=data;
    });
  }

  placeOrder(){
    if(this.food_items.length<=0){
      Swal.fire({title:'Failed',text:'No items present in order',icon:'error'});
      return;
    }
    for(let i=0;i<this.food_items.length;i++){
      if(this.food_items[i].status!=='Available'){
        Swal.fire({title:'Cannot place order',text:'This order contains unavailable items.',icon:'error'});
        return;
      }
    }
    this.baskService.placeOrder(this.order.oid).subscribe(data=>{
      if(data==='Success'){
        Swal.fire({title:'Congratulations!',text:'Order placed successfully!',icon:'success'});
        this.getOrder();
      }else{
        Swal.fire({title:data,text:'Unable to place order',icon:'error'});
      }
    });
  }

  cancelOrder(){
    this.baskService.cancelOrder(this.order.oid).subscribe(data=>{
      if(data==='Success'){
        Swal.fire({title:'Congratulations!',text:'Order cancelled successfully!',icon:'success'});
        this.getOrder();
      }else{
        Swal.fire({title:data,text:'Unable to cancel order',icon:'error'});
      }
    });
  }

  removeFoodItemFromOrder(fid:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if(result.isConfirmed) {
        this.baskService.removeFoodItemFromOrder(fid,this.order.oid).subscribe(data=>{
          if(data==='Success'){
            Swal.fire({title:'Congratulations!',text:'Item removed successfully!',icon:'success'});
            this.getFoodItemsOfOrder(this.order.oid);
          }else{
            Swal.fire({title:data,text:'Unable to remove',icon:'error'});
          }
        });
      }
    });
  }

}
