import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order1 } from 'src/app/Models/Order1';
import { User } from 'src/app/Models/User';
import { BasketService } from 'src/app/Services/basket.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  user:User=new User(0,'','','','','','','','','');
  orders: Order1[] = [];

  constructor(private userService:UserService,private baskService:BasketService,private router:Router) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    this.userService.getUserByToken(sessionStorage.getItem("UserToken")).subscribe(data=>{
      if(!data){
        Swal.fire({title:'Unauthorized access',text:'Make sure to login!',icon:'error'});
        this.router.navigate(['/Login']);
      }else{
        this.user = data;
        if(this.user.role!=='Delivery')this.router.navigate(['Login']);
        this.getDeliveringOrdersByDname();
      }
    });
  }

  getDeliveringOrdersByDname(){
    this.baskService.getDeliveringOrdersByDname(this.user.username).subscribe(data=>{
      if(data){
        this.orders = data;
        console.log(data);
      }
    });
  }

}
