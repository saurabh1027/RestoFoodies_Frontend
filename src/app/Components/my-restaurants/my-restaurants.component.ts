import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  map1HasError:boolean=false;
  newCategory:Category=new Category(0,'','');
  RestoMapHasError:boolean=false;
  user:User=new User(0,'','','','','','','','');
  userHasRestaurant:boolean=false;
  names : string[]=[];
  restaurant : Restaurant = new Restaurant(0,'','','','','','','','','');
  rest : Restaurant = new Restaurant(0,'','','','','','','','','');
  selectedLatitude:number;
  selectedLongitude:number;
  lat:number=0;
  lng:number=0;
  pos={lat:0,lng:0};
  categories:Category[]=[];
  restCategories:Category[]=[];
  food_items:Food_Item[] = [];

  constructor(private userService:UserService,private router:Router,private restService:RestaurantService) { }

  ngOnInit(): void {
    this.getUserByToken();
  }

  getUserByToken(){
    let token = localStorage.getItem("UserToken");
    this.userService.getUserByToken(token).subscribe(data=>{
      this.user = data;
      if(data==null){
        Swal.fire({title:'Unauthorized access',text:'Make sure to login!',icon:'error'});
        this.router.navigate(['Authentication','Login']);
      }
      this.getAllRestaurantNames();
    });
  }

  addCat(){
    this.restService.addCategory(this.newCategory).subscribe(data=>{
      (data==='Success')?Swal.fire({title:'Congratulations',text:'Category added',icon:'success'}):
      Swal.fire({title:'Sorry!',text:data,icon:'error'});
      this.toggleModel('AddCategoryModel',false);
      this.toggleModel('CategoryModule',true);
      this.getAllCategories();
    });
  }

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    model.style.display = (bool)?'block':'none';
  }

  getAllRestaurantNames(){
    this.restService.getAllRestaurantNames(this.user.username).subscribe(data=>{
      this.names = data;
      if(this.names.length>0){
        this.userHasRestaurant=true;
        this.names.push("Add Restaurant");
        this.getRestaurantByName(this.names[0]);
        return;
      }
      this.userHasRestaurant=false;
    });
  }

  getRestaurantByName(name:string){
    let branch : string = name.substring(name.indexOf('(')+1,name.length-1);
    name = name.substring(0,name.indexOf('('));
    let rest : Restaurant = new Restaurant(0,name,'','',branch,'','','','',this.user.username);
    this.restService.getRestaurantByName(rest).subscribe(data=>{
      this.restaurant = data;
      this.lat = parseFloat(this.restaurant.latlng.substring(0,this.restaurant.latlng.indexOf(',')));
      this.lng = parseFloat(this.restaurant.latlng.substring(this.restaurant.latlng.indexOf(',')+1,this.restaurant.latlng.length));
      this.getCategoriesOfRestaurant();
    });
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

  getLatLng(bool:boolean){
    if(this.rest.latlng===''){
      return 0;
    }
    let latlng : string = this.rest.latlng;
    return (bool)?parseFloat(latlng.substring(0,latlng.indexOf(','))):parseFloat(latlng.substring(latlng.indexOf(',')+1,latlng.length));
  }

  toggleMap1(){
    let map = document.getElementById("map1");
    if(map.style.display=='block'){
      map.style.display = "none";
    }else{
      map.style.display = "block";
      if(this.rest.latlng==''){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
            const pos = {
              lat : position.coords.latitude,
              lng : position.coords.longitude
            };
            this.rest.latlng = pos.lat+","+pos.lng;
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
    if(this.selectedLatitude==undefined || this.selectedLongitude==undefined){
      this.RestoMapHasError= true;
      return;
    }
    rest.latlng = this.selectedLatitude+','+this.selectedLongitude;
    this.RestoMapHasError=false;
    this.restService.updateRestaurant(rest).subscribe(data=>{
      if(data=='Success'){
        Swal.fire({title:'Congratulations!',text:'Restaurant updated successfully!',icon:'success'});
        this.toggleModel('RestoUpdateForm',false);
        this.getRestaurantByName(rest.name+'('+rest.branch+')');
      }
      else
        Swal.fire({title:data,text:'Failed to update restaurant.',icon:'error'});
    });
  }

  onSelectChange(){
    ($('#select-restaurants')[0].value=='Add Restaurant') ? this.toggleModel('RestoForm1',true) : this.getRestaurantByName($('#select-restaurants')[0].value);
  }

  toggleMap(){
    let map = document.getElementById("map");
    if(map.style.display=='block'){
      map.style.display = "none";
    }else{
      map.style.display = "block";
      this.pos.lat = parseFloat(this.restaurant.latlng.substring(0,this.restaurant.latlng.indexOf(',')));
      this.pos.lng = parseFloat(this.restaurant.latlng.substring(this.restaurant.latlng.indexOf(',')+1,this.restaurant.latlng.length));
    }
  }

  addRestaurant(){
    if(this.rest.latlng===''){
      this.map1HasError=true;
      return;
    }
    this.map1HasError=false;
    this.rest.username = this.user.username;
    this.restService.addRestaurant(this.rest).subscribe(data=>{
      if(data=='Restaurant added successfully'){
        Swal.fire({ title:'Good Job!',text:data,icon:'success' });
        this.toggleModel('RestoForm1',false);
        this.rest = new Restaurant(0,'','','','','','','','','');
        this.getAllRestaurantNames();
      }else{
        Swal.fire({ title:data,icon:'error' });
      }
    });
  }

  locationChosen($event:AGMMouseEvent,bool:boolean){
    if(bool){
      this.selectedLatitude=$event.coords.lat;
      this.selectedLongitude=$event.coords.lng;
    }else{
      this.rest.latlng = $event.coords.lat+','+$event.coords.lng;
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
          let select = $('select[name="select-restaurants"]')[0].value;
          this.getRestaurantByName(select);
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
