import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/Models/Restaurant';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/Models/User';
import * as $ from 'jquery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  rest : Restaurant = new Restaurant(0,'','','','','','','','','');
  user : User = new User(0,'','','','Customer','','','','user.jpg');
  selectedLatitude:number;
  selectedLongitude:number;
  map : google.maps.Map;
  names : string[];
  current_restaurant_name : string;
  user1 : User = new User(0,'','','','Customer','','','','user.jpg');

  constructor(private router:Router,private service:UserService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = localStorage.getItem("UserToken");
    this.service.getUserByToken(token).subscribe(data=>{
      if(data===null)return;
      this.user = data;
      (this.user.role==='Vendor')?this.router.navigate(['Profile','My-Restaurants']):
      ((this.user.role==='Customer')?this.router.navigate(['Profile','My-Basket']):
        console.log("other roles"));
    },error=>{
      if(error.status==400){
        Swal.fire({icon:'error',title:'Invalid Request',text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }
    });
  }

  getRole(){
    return (this.user.role=='Admin')?'Admin':((this.user.role=='Vendor')?'Vendor':'Customer');
  }

  toggleSlideBar(bool:boolean){
    (bool)?document.getElementById("slidebar").classList.add("active"):document.getElementById("slidebar").classList.remove("active");
  }

  togglePasswordVisibility(){
    let icon = $("#EditUserProfileModel .password i")[0];
    let textField = $('#EditUserProfileModel .password input')[0];
    if(icon.classList.contains("fa-eye")){
      icon.classList.replace("fa-eye","fa-eye-slash");
      textField.type = "text";
    }else{
      icon.classList.replace("fa-eye-slash","fa-eye");
      textField.type = "password";
    }
  }

  toggleEditUserProfileModel(bool:boolean){
    if(bool){
      document.getElementById("EditUserProfileModel").classList.add("active");
      this.toggleSlideBar(false);
    }else{
      document.getElementById("EditUserProfileModel").classList.remove("active");
    }
  }

  updateUserProfile(){
    let file = $('#EditUserProfileModel input[type="file"]')[0].files[0];
    if(file===undefined){
      this.updateUser(this.user);
    }else{
      if(((file.size)/(1024*1024))>0.5){
        Swal.fire({title:'File size exceeded!',text:'File size should be less than 500KB.',icon:'error'});
        return;
      }
      this.service.updateUserPic(file).subscribe(data=>{
        if(data!='Success'){
          Swal.fire({title:data,text:'Unable to store image',icon:'error'});
          return;
        }
        this.user.profile = file.name;
        this.updateUser(this.user);
      });
    }
  }

  updateUser(user:User){
    this.service.updateUser(user).subscribe(data=>{
      if(data=="Success"){
        Swal.fire({title:'Congratulations!',text:'User information is updated.',icon:'success'});
        this.toggleEditUserProfileModel(false);
      }else{
        Swal.fire({title:data,text:'Failure in updating user',icon:'error'});
      }
    });
  }

  deleteAccount(){
    this.toggleSlideBar(false);
    Swal.fire({
      title: 'Are you sure!',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#f00',
      confirmButtonText: 'Yes, delete account!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteUser(this.user.username).subscribe(data=>{
          if(data=="Success"){
            Swal.fire({title:'Congratulations!',text:'Your Account is deleted.',icon:'success'});
            this.service.logout();
          }else{
            Swal.fire({title:data,text:'Failure in deleting your account.',icon:'error'});
          }
        });
      }
    });
  }

  //----------------------------------------Admin-Operations-start----------------------------------

  toggleUserProfileModel(bool:boolean){
    var model = document.getElementById("UserProfileModel");
    if(bool){
      model.style.display='block';
      this.toggleSlideBar(false);
    }else{
      this.user1 = new User(0,'','','','','','','','');
      model.style.display='none';
      document.getElementById("UserEditProfileModel").style.display = "none";
    }
  }

  getUserByUsername(){
    let username = $('input[name="username1"]')[0].value;
    if(username=='') {
      Swal.fire({title:'Empty Username',icon:'error'});
      return;
    }
    this.service.getUserByUsername(username).subscribe(data=>{
      if(data==null){
        Swal.fire({title:'No Results...',text:'Cannot find user with "'+username+'"-username',icon:'error'});
        document.getElementById("UserEditProfileModel").style.display = "none";
        return;
      }
      this.user1 = data;
      document.getElementById("UserEditProfileModel").style.display = "flex";
    });
  }

  deleteUser(){
    let input = $('#UserProfileModel .input input[type="text"][name="username1"]')[0];
    if(input.value===''){
      Swal.fire({title:'Empty username',text:'Enter something to proceed.',icon:'error'});
      return;
    }
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
        this.service.deleteUser(input.value).subscribe(data=>{
          if(data=="Success"){
            Swal.fire({title:data,text:'User information has deleted.',icon:'success'});
            this.toggleUserProfileModel(false);
          }else{
            Swal.fire({title:data,text:'Failure in deletion of user.',icon:'error'});
          }
        });
      }
    });
  }

  togglePasswordVisibility1(){
    let icon = $("#UserEditProfileModel .password i")[0];
    let textField = $('#UserEditProfileModel .password input')[0];
    if(icon.classList.contains("fa-eye")){
      icon.classList.replace("fa-eye","fa-eye-slash");
      textField.type = "text";
    }else{
      icon.classList.replace("fa-eye-slash","fa-eye");
      textField.type = "password";
    }
  }

  updateUserProfile1(){
    this.service.updateUser(this.user1).subscribe(data=>{
      if(data=="Success"){
        Swal.fire({title:'Congratulations!',text:'User information has updated.',icon:'success'});
        this.toggleUserProfileModel(false);
      }else{
        Swal.fire({title:data,text:'Failure in updating user',icon:'error'});
      }
    });
  }

  updateUser1(){
    let file = $('input[type="file"][name="userpic1"]')[0].files[0];
    if(file!=null)
      if((file.size/(1024*1024))>0.5){
        Swal.fire({
          title:'File Size Exceeded!',
          text:'File size should be less than 500KB.',
          icon:'error'
        });
        return;
      }
    if(file==undefined){
      this.updateUserProfile1();
    }else{
      this.service.updateUserPic(file).subscribe(data=>{
        if(data=='Success'){
          this.user1.profile = file.name;
          this.updateUserProfile1();
        }else{
          Swal.fire({title:'data',text:'Unable to store Image!',icon:'error'});
        }
      });
    }
  }

  //----------------------------------------Admin-Operations-end------------------------------------



}