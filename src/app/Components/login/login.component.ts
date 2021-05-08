import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Emitter } from 'src/app/Models/Emitter';
import { Jwt } from 'src/app/Models/Jwt';
import { User } from 'src/app/Models/User';
import { AesCryptoService } from 'src/app/Services/aes-crypto.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user : User = new User(0,'','','','','','','','','');
  remember : boolean = false;

  constructor(private userService : UserService,private router : Router,private cryptoService:AesCryptoService) {}

  ngOnInit(): void {
    sessionStorage.removeItem("UserToken");
    this.getCookies();
  }

  getCookies(){
    if(localStorage.getItem('cuser') && localStorage.getItem('cpass')){
      this.user.username = this.cryptoService.decryptData(localStorage.getItem('cuser'));
      this.user.password = this.cryptoService.decryptData(localStorage.getItem('cpass'));
      this.remember = true;
    }else{
      this.user.username = '';
      this.user.password = '';
      this.remember = false;
    }
  }

  public authenticateUser(){
    this.userService.authenticateUser(this.user).subscribe(data=>{
      let jwt : Jwt = data;
      if(jwt.message!=='Valid'){
        Swal.fire({title:jwt.message,icon:'error'});
      }else{
        this.router.navigate(['/']);
        sessionStorage.setItem('UserToken',jwt.token);
        localStorage.removeItem('cuser');
        localStorage.removeItem('cpass');
        if(this.remember){
          localStorage.setItem('cuser',this.cryptoService.encryptData(this.user.username));
          localStorage.setItem('cpass',this.cryptoService.encryptData(this.user.password));
        }
        Emitter.authEmitter.emit(true);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  }

}
