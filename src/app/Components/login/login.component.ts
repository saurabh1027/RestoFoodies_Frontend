import { Emitter } from './../Emitter/emitter';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Emitter } from 'src/app/Models/Emitter';
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
  user : User = new User(0,'','','','','','','','');
  remember : boolean = false;

  constructor(private userService : UserService,private router : Router,private cookieService:CookieService) {}

  ngOnInit(): void {
    sessionStorage.removeItem("UserToken");
    setTimeout(() => {
      this.getCookies();
    }, 100);
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
      this.cookieService.deleteAll('/Login');
    }
  }
  
  /*
  public authenticateUser(){
    this.userService.authenticateUser(this.user).subscribe(data=>{
      this.token=data;
      sessionStorage.setItem('UserToken',this.token);
        if(this.remember){
          this.cookieService.set("cuser",this.user.username,5,'/Login');   //5 days
          this.cookieService.set("cpass",this.user.password,5,'/Login');   //5 days
        }else{
          this.cookieService.deleteAll('/Login');
        }
<<<<<<< Updated upstream
        this.router.navigate(['']);
        Emitter.authEmitter.emit(true)
      }
=======
        this.router.navigate(['/']);
    },error=>{
      if(error.status===403)Swal.fire({title:'Invalid Username',text:'Your username is not available.',icon:'error'});
      if(error.status===401)Swal.fire({title:'Unauthorized Access',text:'Your password is wrong.',icon:'error'});
>>>>>>> Stashed changes
    });
  }
  */


  public authenticateUser(){
    this.userService.authenticateUser(this.user).subscribe(data=>{
      let jwt : Jwt = data;
      if(jwt.message!=='Valid'){
        Swal.fire({title:jwt.message,icon:'error'});
      }else{
        this.router.navigate(['/']);
        sessionStorage.setItem('UserToken',jwt.token);
        this.cookieService.deleteAll('/Login');
        if(this.remember){
          this.cookieService.set("cuser",this.user.username,5,'/Login');   //5 days
          this.cookieService.set("cpass",this.user.password,5,'/Login');   //5 days
        }
        Emitter.authEmitter.emit(true);
      }
    });
  }

}
