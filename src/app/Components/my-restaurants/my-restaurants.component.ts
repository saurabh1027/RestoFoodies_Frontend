import { Component, OnInit} from '@angular/core';
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
  branches:string[]=[];
  newCategory:Category=new Category(0,'','');
  user:User=new User(0,'','','','','','','','','');
  restaurant : Restaurant = new Restaurant(0,'','','','','','','','');
  rest : Restaurant = new Restaurant(0,'','','','','','','','');
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
    this.userService.getUserByToken(sessionStorage.getItem("UserToken")).subscribe(data=>{
      if(!data){
        Swal.fire({title:'Unauthorized access',text:'Make sure to login!',icon:'error'});
        this.router.navigate(['/Login']);
      }else{
        this.user = data;
        if(this.user.role!=='Vendor')this.router.navigate(['Login']);
        this.getRestaurantByUsername(this.user.username);
      }
    });
  }

  getRestaurantByUsername(username:string){
    this.restService.getRestaurantByUsername(username).subscribe(data=>{
      if(data){
        this.restaurant = data;
        this.getBranches(this.restaurant.branch);
        this.pos.lat = parseFloat(this.restaurant.latlng.substring(0,this.restaurant.latlng.indexOf(',')));
        this.pos.lng = parseFloat(this.restaurant.latlng.substring(this.restaurant.latlng.indexOf(',')+1,this.restaurant.latlng.length));
        this.getCategoriesOfRestaurant();
      }else{
        this.restaurant = new Restaurant(0,'','','','','','','','');
        this.getCurrentLocation();
      }
    });
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position:GeolocationPosition)=>{
        this.pos = {lat:position.coords.latitude,lng:position.coords.longitude};
      });
    }
  }

  getBranches(branch:string){
    let str : string = '';
    for(let i=0;i<branch.length;i++){
      if(branch[i]===','){
        this.branches.push(str);
        str='';
      }else{
        str = str + branch[i];
      }
    }
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

  checkFile(event){
    // if(event.target.files[0]!==undefined){
    //   if((event.target.files[0].size>(1024*1024)/2))
    //     this.fileSizeExceed=true;
    //   else{
    //     this.fileSizeExceed=false;
    //     this.file1 = event.target.files[0];
    //   }
    // }
    // else this.fileSizeExceed = false;
  }

  toggleModel(modelName:string,bool:boolean){
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
    if(bool){
      document.getElementById('Panel1').style.display = 'flex';
      body.classList.add('model');
      model.style.display = 'flex';
    }else{
      document.getElementById('Panel1').style.display = 'none';
      body.classList.remove('model');
      model.style.display = 'none';
    }
  }

  getRestaurantByName(name:string){
    let branch : string = name.substring(name.indexOf('(')+1,name.length-1);
    name = name.substring(0,name.indexOf('('));
    let rest : Restaurant = new Restaurant(0,name,'','',branch,'','','',this.user.username);
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
        this.restService.deleteRestaurant(rid).subscribe(data=>{
          if(data=='Success'){
            Swal.fire('Deleted!','Your restaurant is deleted.','success');
            this.toggleModel("RestoUpdateForm",false);
            this.getRestaurantByUsername(this.user.username);
          }else{
            Swal.fire(data,'Unable to delete restaurant.','error');
          }
        });
      }
    });
  }
  
  updateRestaurant(rest:Restaurant,files:FileList){
    rest.latlng = this.pos.lat+','+this.pos.lng;
    if(files.length==1){
      let file:File = files[0];
      this.restService.addRestaurantProfile(file).subscribe(data=>{
        if(data=='Success'){
          rest.profile = file.name;
          this.restService.updateRestaurant(rest).subscribe(data=>{
            if(data=='Success'){
              Swal.fire({title:'Congratulations!',text:'Restaurant Updated Successfully.',icon:'success'});
              this.toggleModel('RestoUpdateForm',false);
            }else{
              Swal.fire({title:'Sorry!',text:data,icon:'error'});
            }
          });
        }else{
          Swal.fire({title:'Sorry!',text:data,icon:'error'});
        }
      });
    }else{
      this.restService.updateRestaurant(rest).subscribe(data=>{
        if(data=='Success'){
          Swal.fire({title:'Congratulations!',text:'Restaurant Updated Successfully.',icon:'success'});
          this.toggleModel('RestoUpdateForm',false);
        }else{
          Swal.fire({title:'Sorry!',text:data,icon:'error'});
        }
      });
    }
  }

  toggleMap(mapName:string,modelName:string,bool:boolean){
    let map = document.getElementById(mapName);
    let model = document.getElementById(modelName);
    if(bool){
      map.style.display = "block";
      model.style.display = "none";
    }else{
      map.style.display = "none";
      model.style.display = "flex";
    }
  }

  addRestaurant(rest:Restaurant,files:FileList){
    rest.latlng = this.pos.lat+','+this.pos.lng;
    this.restService.addRestaurantProfile(files[0]).subscribe(data=>{
      if(data==='Success'){
        rest.profile = files[0].name;
        rest.username = this.user.username;
        rest.branch+=',';
        this.restService.addRestaurant(rest).subscribe(data=>{
          if(data=='Restaurant added successfully'){
            Swal.fire({ title:'Good Job!',text:data,icon:'success' });
            this.toggleModel('RestoForm1',false);
            this.rest = new Restaurant(0,'','','','','','','','');
            this.getRestaurantByUsername(this.user.username);
          }else{
            Swal.fire({ title:data,icon:'error' });
          }
        });
      }else{
        Swal.fire({title:'Sorry!',text:data,icon:'error'});
      }
    });
  }

  chooseLocation($event:AGMMouseEvent){
    this.pos = {
      lat:$event.coords.lat,
      lng:$event.coords.lng
    }
  }

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
