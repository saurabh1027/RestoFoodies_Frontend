import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jwt } from 'src/app/Models/Jwt';
import { User } from 'src/app/Models/User';
import { UserService } from 'src/app/Services/user.service';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import Swal from 'sweetalert2';
import { Emitter } from 'src/app/Models/Emitter';
import { AesCryptoService } from 'src/app/Services/aes-crypto.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user : User = new User(0,"","","","Customer","","","","","user.jpg");
  message : any;
  jwt : Jwt = new Jwt("","","");
  pos:{lat:number,lng:number}={lat:0,lng:0};
  geolocationPermission:string='';

  constructor(private service:UserService,private cryptoService:AesCryptoService,private router:Router) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  getCurrentLocation(){
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus)=>{
      if(permissionStatus.state=='granted'){
        if(navigator.geolocation){
          navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
            this.pos = { lat:position.coords.latitude , lng:position.coords.longitude };
          });
        }
      }else if(permissionStatus.state=='denied'){
        alert('Location Disallowed!');
      }else{
        permissionStatus.onchange = ()=>{
          this.getCurrentLocation();
        }
      }
    });
  }

  saveUser(){
    this.user.latlng = this.pos.lat+','+this.pos.lng;
    this.service.saveUser(this.user).subscribe(data=>{
      this.jwt=data;
      if(this.jwt.message=='Success'){
        this.router.navigate(['']);
        sessionStorage.setItem("UserToken",this.jwt.token);
        localStorage.removeItem('cuser');
        localStorage.removeItem('cpass');
        localStorage.setItem('cuser',this.cryptoService.encryptData(this.user.username));
        localStorage.setItem('cpass',this.cryptoService.encryptData(this.user.password));
        Emitter.authEmitter.emit(true);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }else{
        Swal.fire({icon:'error',title:'Sorry!',text:this.jwt.message});
      }
    });
  }

  chooseLocation($event:AGMMouseEvent){
    this.pos = { lat:$event.coords.lat , lng:$event.coords.lng }
  }

  toggleMap(bool:boolean){
    if(bool){
      document.getElementById('Panel').style.display = 'flex';
      document.getElementsByTagName('body')[0].classList.add('model');
    }else{
      document.getElementById('Panel').style.display = 'none';
      document.getElementsByTagName('body')[0].classList.remove('model');

    }
  }

}
