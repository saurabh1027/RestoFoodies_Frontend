import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Jwt } from 'src/app/Models/Jwt';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user : User = new User(0,'','','','','','','','user.jpg');
  jwt : any;
  jwtModel : Jwt = new Jwt("","","");
  remember : boolean = false;
  token: any;

  constructor(private service : UserService,private router : Router,private cookieService:CookieService) {}

  ngOnInit(): void {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("UserRole");
    this.getCookies();
  }

  getCookies(){
    if(this.cookieService.get("cuser")!=''){
      this.user.username = this.cookieService.get("cuser");
      this.user.password = this.cookieService.get("cpass");
      this.remember = true;
    }else{
      this.user.username = '';
      this.user.password = '';
      this.remember = false;
      this.cookieService.deleteAll();
    }
  }
  
  public authenticateUser(){
    this.service.generateToken(this.user).subscribe(data=>{
      this.jwtModel = data;
      if(this.jwtModel.message!='Valid'){
        Swal.fire({
          icon: 'error',
          title: this.jwtModel.message
        });
      }else{
        localStorage.setItem("UserToken",this.jwtModel.token);
        localStorage.setItem("UserRole",this.jwtModel.role);
        if(this.remember){
          //for 1 hour put expiration = 1/24
          this.cookieService.set("cuser",this.user.username,5,'/Authentication/Login');   //5 days
          this.cookieService.set("cpass",this.user.password,5,'/Authentication/Login');   //5 days
        }else{
          this.cookieService.deleteAll();
        }
        this.router.navigate(['/']);
      }
    });
  }
  public toggleRemember(){
    if(this.remember)
      this.remember = false;
    else
      this.remember = true;
  }
}
