import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/Models/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  rest : Restaurant = new Restaurant(0,'','','','','nothing.png',0);
  user : User = new User(0,'','','User','Customer','','','','','user.jpg');
  user1 : User = new User(0,'','','','Customer','','','','','user.jpg');
  user2 : User = new User(0,'','','','Customer','','','','','user.jpg');
  
  constructor(private router:Router,private userService:UserService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    if(!sessionStorage.getItem('UserToken'))this.router.navigate(['Login']);
    this.userService.getUserByToken(sessionStorage.getItem("UserToken")).subscribe(data=>{
      if(!data)this.router.navigate(['Login']);
      this.user = data;
      (this.user.role==='Vendor')?this.router.navigate(['Profile','Restaurant']):
      (this.user.role==='Delivery')?this.router.navigate(['Profile' , 'Delivery']):
      (this.user.role === 'Admin')?this.router.navigate(['Profile' , 'Admin']):
      ((this.user.role==='Customer')?this.router.navigate(['My-Basket']):
        console.log("other roles")
      );
    });
  }

  toggleSlideBar(bool:boolean){
    let model = document.getElementById('slidebar');
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      document.getElementById('Panel').style.display = 'flex';
      body.classList.add('model');
      model.classList.add('active');
    }else{
      document.getElementById('Panel').style.display = 'none';
      body.classList.remove('model');
      model.classList.remove('active');
    }
  }

  togglePasswordVisibility(iconName:string,inputName:string){
    let icon = document.getElementById(iconName);
    let input = document.getElementById(inputName);
    if(icon.classList.contains("fa-eye")){
      icon.classList.replace("fa-eye","fa-eye-slash");
      input.setAttribute('type','text');
    }else{
      icon.classList.replace("fa-eye-slash","fa-eye");
      input.setAttribute('type','password');
    }
  }

  toggleModel(modelName:string,panelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    let panel = document.getElementById(panelName);
    if(bool){
      panel.style.display = 'flex';
      body.classList.add('model');
      model.style.display = 'flex';
    }else{
      panel.style.display = 'none';
      body.classList.remove('model');
      model.style.display = 'none';
    }
  }

  changeUserPic(){}

  updateUserProfile(file:File,user:User){//Using
    if(!file){
      this.updateUser(user);
    }else{
      this.userService.updateUserPic(file).subscribe(data=>{
        if(data=='Success'){
          this.user.profile = file.name;
          this.updateUser(user);
        }else{
          Swal.fire({title:data,text:'Unable to store image',icon:'error'});
        }
      });
    }
  }

  updateUser(user:User){//Using
    this.userService.updateUser(user).subscribe(data=>{
      if(data=="Success"){
        Swal.fire({title:'Congratulations!',text:'User information is updated.',icon:'success'});
        this.toggleModel('EditUserProfileModel','Panel',false);
        this.toggleModel('UserEditProfileModel','Panel',false);
      }else{
        Swal.fire({title:data,text:'Failure in updating user',icon:'error'});
      }
    });
  }

  getUserByUsername(username:string){
    this.userService.getUserByUsername(username).subscribe(data=>{
      if(data==null){
        Swal.fire({title:'No Results...',text:'Cannot find user with "'+username+'"-username',icon:'error'});
        this.toggleModel("UserProfileModel",'Panel',false);
        return;
      }
      this.user1 = data;
      this.toggleModel("UserProfileModel",'Panel',false);
      this.toggleModel("UserEditProfileModel",'Panel',true);
    });
  }
  
  deleteUser(username:string){
    Swal.fire({
      title: 'Are you sure!',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#f00',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(username).subscribe(data=>{
          if(data=="Success"){
            Swal.fire({title:data,text:'User information has deleted.',icon:'success'});
            this.toggleModel("UserEditProfileModel",'Panel',false);
            this.toggleModel("EditUserProfileModel",'Panel',false);
          }else{
            Swal.fire({title:data,text:'Failure in deletion of user.',icon:'error'});
          }
        });
      }
    });
  }

  addUser(){
    this.userService.addUser(this.user2).subscribe(data =>{
      if(data == "Success"){
        Swal.fire({ title : 'Congratulations!' , text :'User information is Added! ', icon : 'success'});
        this.toggleModel('AddUserModel','Panel',false);
      }else{
        Swal.fire( {title : data , text : 'Failure in adding user', icon : 'error'});
      }
    })
  }

}