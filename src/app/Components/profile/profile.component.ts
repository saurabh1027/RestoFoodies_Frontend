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
  rest : Restaurant = new Restaurant(0,'','','','','','','','','','');
  user : User = new User(0,'','','User','Customer','','','','user.jpg');
  selectedLatitude:number;
  selectedLongitude:number;
  map : google.maps.Map;
  names : string[];
  current_restaurant_name : string;
  user1 : User = new User(0,'','','','Customer','','','','user.jpg');
  @ViewChild('eye') eye : ElementRef;
  @ViewChild('eye1') eye1 : ElementRef;
  @ViewChild('username1') username1 : ElementRef;
  @ViewChild('password') password : ElementRef;
  @ViewChild('password1') password1 : ElementRef;
  @ViewChild('EditUserProfileModel') EditUserProfileModel : ElementRef;
  @ViewChild('UserEditProfileModel') UserEditProfileModel : ElementRef;
  @ViewChild('file') file : ElementRef;
  @ViewChild('file1') file1 : ElementRef;
  @ViewChild('UserProfileModel') UserProfileModel : ElementRef;
  
  constructor(private router:Router,private service:UserService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    if(!sessionStorage.getItem('UserToken'))this.router.navigate(['Login']);
    this.service.getUserByToken(sessionStorage.getItem("UserToken")).subscribe(data=>{
      if(!data)this.router.navigate(['Login']);
      this.user = data;
      (this.user.role==='Vendor')?this.router.navigate(['Profile','Restaurant']):
      ((this.user.role==='Customer')?this.router.navigate(['My-Basket']):
        console.log("other roles")
      );
    });
  }

  toggleSlideBar(bool:boolean){
    (bool) ? document.getElementById("slidebar").classList.add("active") : document.getElementById("slidebar").classList.remove("active");
  }

  togglePasswordVisibility(){
    let icon = this.eye.nativeElement;
    let textField = this.password.nativeElement;
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
      this.EditUserProfileModel.nativeElement.classList.add("active");
      this.toggleSlideBar(false);
    }else{
      this.EditUserProfileModel.nativeElement.classList.remove("active");
    }
  }

  updateUserProfile(){
    let file = this.file.nativeElement.files[0];
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
            this.router.navigate(['Login']);
          }else{
            Swal.fire({title:data,text:'Failure in deleting your account.',icon:'error'});
          }
        });
      }
    });
  }

  //----------------------------------------Admin-Operations-start----------------------------------

  toggleUserProfileModel(bool:boolean){
    var model = this.UserProfileModel.nativeElement;
    if(bool){
      model.style.display='block';
      this.toggleSlideBar(false);
    }else{
      this.user1 = new User(0,'','','','','','','','');
      model.style.display='none';
      this.UserEditProfileModel.nativeElement.style.display = "none";
    }
  }

  getUserByUsername(){
    let username = this.username1.nativeElement.value;
    if(username=='') {
      Swal.fire({title:'Empty Username',icon:'error'});
      return;
    }
    this.service.getUserByUsername(username).subscribe(data=>{
      if(data==null){
        Swal.fire({title:'No Results...',text:'Cannot find user with "'+username+'"-username',icon:'error'});
        this.UserEditProfileModel.nativeElement.style.display = "none";
        return;
      }
      this.user1 = data;
      this.UserEditProfileModel.nativeElement.style.display = "flex";
    });
  }

  deleteUser(){
    let input = this.username1.nativeElement;
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
    let icon = this.eye1.nativeElement;
    let textField = this.password1.nativeElement;
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
    let file = this.file1.nativeElement.files[0];
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