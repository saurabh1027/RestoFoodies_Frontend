import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jwt } from 'src/app/Models/Jwt';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user : User = new User(0,"","","","Customer","","","","user.jpg");
  message : any;
  jwt : Jwt = new Jwt("","","");
  constructor(private service:UserService,private router:Router) {}

  ngOnInit(): void {
    localStorage.removeItem("UserToken");
    localStorage.removeItem("UserRole");
  }

  saveUser(){
    this.user.location = this.user.location.toLocaleUpperCase();
    if(this.user.username=='')
      Swal.fire({icon: 'error',title:'Empty Username'});
    else if(this.user.password=='')
      Swal.fire({icon:'error',title:'Empty Password'});
    else if(this.user.fullname=='')
      Swal.fire({icon:'error',title:'Empty Fullname'});
    else{
      this.service.saveUser(this.user).subscribe(data=>{
        this.jwt=data;
        if(this.jwt.message=='Success'){
          localStorage.setItem("UserToken",this.jwt.token);
          localStorage.setItem("UserRole",this.jwt.role);
          Swal.fire({
            icon:'success',
            title:'User Data is stored'
          });
          this.router.navigate(['/Home']);
        }else{
          Swal.fire({
            icon:'error',
            title:this.jwt.message
          });
        }
      });
    }
  }
}
