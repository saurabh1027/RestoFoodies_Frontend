import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/Models/Category';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Restaurant } from 'src/app/Models/Restaurant';
import { MouseEvent as AGMMouseEvent } from '@agm/core';
import { User } from 'src/app/Models/User';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { UserService } from 'src/app/Services/user.service';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-my-restaurants',
  templateUrl: './my-restaurants.component.html',
  styleUrls: ['./my-restaurants.component.css']
})
export class MyRestaurantsComponent implements OnInit {
  user:User=new User(0,'','','','','','','');
  names : string[];
  restaurant : Restaurant = new Restaurant(0,'','0/0','','','','','','','','','');
  rest : Restaurant = new Restaurant(0,'','0/0','','','','','','','','','');
  selectedLatitude:number;
  selectedLongitude:number;
  r1:number=0;
  r2:number=0;
  rImages:string[] = ['nothing.png'];
  index:number=0;
  categories:Category[];
  restCategories:Category[];
  food_items:Food_Item[] = [];

  constructor(private userService:UserService,private router:Router,private restService:RestaurantService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = localStorage.getItem("UserToken");
    this.userService.getUserByToken(token).subscribe(data=>{
      if(data==null){
        Swal.fire({icon:'error', title:'Invalid Request', text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }   
      this.user = data;
      if(this.user.role!=='Owner'){
        Swal.fire({title:'Unauthorised access',text:'Only Owners are allowed on this page!',icon:'error'});
        this.router.navigate(['/Profile']);
      }
      this.getAllRestaurantNames();
    },error=>{
      if(error.status==400){
        Swal.fire({icon:'error', title:'Invalid Request', text:'Make sure to login!'});
        this.router.navigate(['/Authentication/Login']);
      }
    });
  }

  getAllRestaurantNames(){
    var container = document.getElementsByClassName("container")[0];
    this.restService.getAllRestaurantNames(this.user.username).subscribe(data=>{
      this.names = data;
      if(this.names.length>0){
        container.classList.add('active');
        this.names.push("Add Restaurant");
        this.getRestaurantByName(this.names[0]);
      }else{
        Swal.fire({
          title:'No restaurants to display',
          confirmButtonColor:'#3085d6',
          confirmButtonText:'Add Restaurant'
        }).then((result)=>{
          if(result.isConfirmed){
            this.toggleRestoModule();
          }
        });
      }
    });
  }

  getRestaurantByName(name:string){
    let index = 0;
    this.rImages = [''];
    for(let i=0;i<name.length;i++){
      if(name[i]=='('){
        index = i+1;
        break;
      }
    }
    let branch : string = name.substring(index,name.length-1);
    name = name.substring(0,index-1);
    let rest : Restaurant = new Restaurant(0,name,'','','',branch,'','','','','',this.user.username);
    this.restService.getRestaurantByName(rest).subscribe(data=>{
      this.restaurant = data;
      //ratings
      let index = 0;
      let ratings:string = this.restaurant.ratings;
      for(let i=0;i<ratings.length;i++){
        if(ratings[i]=='/')
          index = i;
      }
      this.r1 = parseInt(ratings.substring(0,index));
      this.r2 = parseInt(ratings.substring(index+1,ratings.length));
      if(this.r1 != 0 && this.r2 != 0){
        let per = (this.r1/this.r2)*100;
        this.r1 = (per*5)/100;
      }else{
        this.r1 = 0;
      }
      //this.adjustStars(this.r1);
      //images
      if(this.restaurant.images!=null && this.restaurant.images!='')
        this.restaurantImages();
      else{
        this.rImages = ['nothing.png'];
      }
      this.getCategoriesOfRestaurant();
    });
  }

  /*
  adjustStars(r1:number){
    r1 = Math.floor(r1);
    let ratings = document.getElementById("ratings");
    ratings.innerHTML = "";
    for(let i=0;i<r1;i++){
      var node1 = document.createElement("i");
      node1.className = "fas fa-star";
      ratings.appendChild(node1);
    }
    for(let i=0;i<5-r1;i++){
      var node2 = document.createElement("i");
      node2.className = "far fa-star";
      ratings.appendChild(node2);
    }
  }
  */

  restaurantImages(){
    this.rImages = [];
    let str:string = this.restaurant.images;
    let str1:string = '';
    for(let i=0;i<str.length;i++){
      if(str[i]!=','){
        str1 += str[i];
      }else{
        this.rImages.push(str1);
        str1 = '';
      }
    }
  }

  deleteRestaurant(rid:number){
    Swal.fire({
      title: 'Delete - '+this.restaurant.name,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteRestaurant(rid,this.user.username).subscribe(data=>{
          if(data=='Success'){
            Swal.fire('Deleted!','Your file has been deleted.','success');
            this.getAllRestaurantNames();
          }else{
            Swal.fire(data,'Unable to delete property.','error');
          }
        });
      }
    });
  }

  deleteRImage(img:string){
    Swal.fire({
      title: 'Are you sure!',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteImageOfRestaurant(img,this.restaurant.rid).subscribe(data=>{
          if(data=='Success'){
            Swal.fire({title:'Image deleted!',icon:'success'});
            this.getRestaurantByName($('#select-restaurants')[0].value);
          }else
            Swal.fire({title:data,icon:'error'});
        });
      }
    });
  }

  toggleImageModule(){
    var module = document.getElementById("imageModule");
    module.style.display = (module.style.display=='flex')?'none':'flex';
  }

  addImages(){
    var files : FileList = $('input[type="file"][id="rImages"]')[0].files;
    let cnt = 0;
    if(files.length>0){
      for(let i=0;i<files.length;i++){
        let size = files[i].size;
        if(size/(1024*1024)>0.5){
          cnt++;
        }
      }
      if(cnt>0){
        Swal.fire({title:'File Size Exceeded!',text:'You have '+cnt+' images of size more than 500KB'});
      }else{
        this.restService.saveRestaurantImages(files,this.restaurant.rid).subscribe(data=>{
          if(data=='Success'){
            Swal.fire({title:'Images are updated!',icon:'success'});
            this.getRestaurantByName($('#select-restaurants')[0].value);
          }else
            Swal.fire({title:data,icon:'error'});
        });
      }
    }else{
      Swal.fire({title:'No Images are Selected',icon:'error'});
    }
    this.toggleImageModule();
  }

  getLatLng(bool:boolean){
    if(this.restaurant.latlng==''){
      return 0;
    }
    let latlng : string = this.restaurant.latlng;
    let index;
    for(let i=0;i<latlng.length;i++){
      if(latlng[i]==',')
        index = i;
    }
    if(bool){
      let lat : number = 0;
      lat = parseFloat(latlng.substring(0,index));
      return lat;
    }else{
      let lng : number = 0;
      lng = parseFloat(latlng.substring(index+1,latlng.length));
      return lng;
    }
  }

  toggleMap1(){
    let map = document.getElementById("map1");
    if(map.style.display=='block'){
      map.style.display = "none";
    }else{
      map.style.display = "block";
      if(this.restaurant.latlng==''){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
            const pos = {
              lat : position.coords.latitude,
              lng : position.coords.longitude
            };
            this.restaurant.latlng = pos.lat+","+pos.lng;
          },()=>{
            alert("Location Disallowed");
            this.toggleMap();
          });
        } else {
          alert("Your browser doesn't support Geolocation.");
        }
      }
    }
  }

  updateRestaurant(rest:Restaurant){
    if(rest.name==''||rest.branch==''||rest.closing_time==''||rest.opening_time==''||rest.contact==''||rest.email==''||rest.latlng==''){
      Swal.fire({title:'Empty Inputs',text:'Make sure you entered all fields.',icon:'error'});
      return;
    }
    this.restService.updateRestaurant(rest).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',text:'Restaurant updated successfully!',icon:'success'});
        this.toggleRestoUpdateForm(false);
        this.getRestaurantByName(rest.name);
      }
      else
        Swal.fire({title:data,text:'Failed to update restaurant.',icon:'error'});
    });
  }

  rImagesSlider(dir:boolean){
    if(dir){
      (this.index==this.rImages.length-1) ? this.index = 0 : this.index += 1;      
    }else{
      (this.index==0) ? this.index = this.rImages.length-1 : this.index -= 1;
    }
  }

  onSelectChange(){
    ($('#select-restaurants')[0].value=='Add Restaurant') ? this.toggleRestoModule() : this.getRestaurantByName($('#select-restaurants')[0].value);
  }

  toggleRestoUpdateForm(bool:boolean){
    let model = document.getElementById("RestoUpdateForm");
    this.rest = new  Restaurant(0,'','0/0','','','','','','','','','');
    model.style.display = (bool)?'flex':model.style.display='none';
  }

  toggleRestoModule(){
    let form = document.getElementById('RestoForm');
    if(form.style.display=='flex'){
      form.style.display = 'none'
      $('#select-restaurants')[0].value = this.names[0];
      console.log($('#select-restaurants')[0].value);
      //this.getRestaurantByName($('#select-restaurants')[0].value);
    }else{
      form.style.display = 'flex';
    }
  }

  toggleMap(){
    let map = document.getElementById("map");
    if(map.style.display=='block'){
      map.style.display = "none";
    }else{
      map.style.display = "block";
      if(this.selectedLatitude==undefined || this.selectedLongitude==undefined){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
            const pos = {
              lat : position.coords.latitude,
              lng : position.coords.longitude
            };
            this.selectedLatitude = pos.lat;
            this.selectedLongitude = pos.lng;
          },()=>{
            alert("Location Disallowed");
            this.toggleMap();
          });
        } else {
          alert("Your browser doesn't support Geolocation.");
        }
      }
    }
  }

  addRestaurant(){
    if(this.selectedLatitude==undefined && this.selectedLongitude==undefined)
      Swal.fire({ title:'Empty Restaurant Location', icon:'error' });
    else{
      this.rest.latlng = this.selectedLatitude+","+this.selectedLongitude;
      if(this.rest.name=='')
        Swal.fire({ title:'Empty Restaurant Name', icon:'error' });
      else if(this.rest.contact=='')
        Swal.fire({ title:'Empty Restaurant Contact', icon:'error' });
      else if(this.rest.email=='')
        Swal.fire({ title:'Empty Restaurant Email', icon:'error' });
      else if(this.rest.branch=='')
        Swal.fire({ title:'Empty Restaurant Branch', icon:'error' });
      else if(this.rest.latlng=='')
        Swal.fire({ title:'Empty Restaurant Location', icon:'error' });
      else if(this.rest.opening_time=='')
        Swal.fire({ title:'Empty Restaurant Opening-Time', icon:'error' });
      else if(this.rest.closing_time=='')
        Swal.fire({ title:'Empty Restaurant Closing-Time', icon:'error' });
      else{
        this.rest.username = this.user.username;
        this.restService.addRestaurant(this.rest).subscribe(data=>{
          if(data=='Restaurant added successfully'){
            Swal.fire({ title:'Good Job!',text:data,icon:'success' });
            this.toggleRestoModule();
            this.rest = new Restaurant(0,'','0/0','','','','','','','','','');
            this.getAllRestaurantNames();
          }else{
            Swal.fire({ title:data,icon:'error' });
          }
        });
      }
    }
  }

  locationChosen($event:AGMMouseEvent,bool:boolean){
    if(bool){
      this.selectedLatitude=$event.coords.lat;
      this.selectedLongitude=$event.coords.lng;
    }else{
      this.restaurant.latlng = $event.coords.lat+','+$event.coords.lng;
    }
  } 

  //----------------------------Menu Functions-----------------------------------

  toggleCategoryModule(){
    let module = document.getElementById("CategoryModule");
    if(module.style.display=='block'){
      this.categories = [];
      module.style.display = "none";
    }else{
      module.style.display = "block";
      this.getAllCategories();
    }
  }

  getAllCategories(){
    this.restService.getAllCategories().subscribe(data=>{
      this.categories = data;
      if(this.restaurant.categories!=null)
        this.addSelectedClass();
    });
  }

  addCategory(cname:string){
    let i = 0;
    for(i=0;i<$('.categories span').length;i++){
      if($('.categories span')[i].innerHTML.trim()==cname){
        break;
      }
    }
    var category = document.getElementsByClassName("category")[i];
    if(category.classList.contains('selected')){
      category.classList.remove('selected');
      this.restaurant.categories = this.restaurant.categories.replace(cname+',','');
    }else{
      category.classList.add('selected');
      if(this.restaurant.categories==null){
        this.restaurant.categories = cname + ",";
      }else{
        if(!this.restaurant.categories.includes(cname+',')){
          this.restaurant.categories += cname + ",";
        }
      }
    }
  }

  updateCategoriesOfRestaurant(){ 
    if(this.restaurant.categories!=''){
      this.restService.updateCategoriesOfRestaurant(this.restaurant.categories,this.restaurant.rid).subscribe(data=>{
        if(data=='Success'){
          Swal.fire('Updated!','Your selected categories updated successfully.','success');
          this.getAllRestaurantNames();
        }else{
          Swal.fire(data,'Unable to update categories.','error');
        }
        this.toggleCategoryModule();
      });
    }else{
      Swal.fire('No Categories Selected!','You should select at least one category','error');
    }
  }

  addSelectedClass(){
    //Add 'selected' class to categories which are present in this.restaurant.categories
    let restCategories : string[] = [''];
    let str : string = '';
    let j = 0 ;
    for(let i=0;i<this.restaurant.categories.length;i++){
      if(this.restaurant.categories[i]!=','){
        str = str + this.restaurant.categories[i];
      }else{
        restCategories[j++] = str;
        str = '';
      }
    }
    setTimeout(() => {
      var category = document.getElementsByClassName("category");
      for(let i=0;i<category.length;i++){
        if(restCategories.includes(category[i].innerHTML)){
          category[i].classList.add('selected');
        }
      }
    }, 100);
  }

  getCategoriesOfRestaurant(){
    this.restCategories = [];
    this.restService.getRestaurantCategories(this.restaurant.rid).subscribe(data=>{
      this.restCategories = data;
      this.getFoodItems("All");
    });
  }

  getFoodItems(cname:string){
    let category = $('span.category-name');
    for(let i=0;i<category.length;i++){
      if(category[i].innerHTML==cname){
        category[i].classList.add("selected");
      }else{
        category[i].classList.remove("selected");
      }
    }
    this.food_items = [];
    this.restService.getFoodItems(cname,this.restaurant.rid).subscribe(data=>{
      this.food_items = data;
    });
  }


}
