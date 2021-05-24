import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/Models/Category';
import { Food_Item } from 'src/app/Models/Food_Item';
import { Restaurant } from 'src/app/Models/Restaurant';
import Swal from 'sweetalert2';
import { RestaurantService } from 'src/app/Services/restaurant.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { User } from 'src/app/Models/User';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  restaurant : Restaurant = new Restaurant(0,'','','','','',0);
  fileSizeExceeded:boolean=false;
  restCategories:Category[]=[];
  pic:File;
  food_items : Food_Item[] = [];
  food_item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);
  item : Food_Item = new Food_Item(0,'',0,'',0,'','',false,'',0,'','','',0);
  newCategory:Category=new Category(0,'','');
  user:User=new User(0,'','','','','','','','','');

  constructor(private restService:RestaurantService,private userService:UserService,private router:Router) { }

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
        this.getRestaurantByUid(this.user.uid);
      }
    });
  }

  getRestaurantByUid(uid:number){
    this.restService.getRestaurantByUid(uid).subscribe(data=>{
      if(data){
        this.restaurant = data;
        this.getCategoriesByCnames();
        this.getFoodItems("All");
      }else{
        this.restaurant = new Restaurant(0,'','','','','',0);
      }
    });
  }

  toggleMenuActionsModel(){
    let model = document.getElementById('MenuActions');
    model.style.display = (model.style.display=='flex') ? 'none' : 'flex';
  }

  getCategoriesByCnames(){
    this.restCategories = [];
    if(this.restaurant.categories){
      let str:string = '';
      let cnames:string[]=[];
      for(let i=0;i<this.restaurant.categories.length;i++){
        if(this.restaurant.categories[i]==','){
          cnames.push(str);
          str = '';
        }else{
          str += this.restaurant.categories[i];
        }
      }
      this.restService.getCategoriesByCnames(cnames).subscribe(data=>{
        this.restCategories = data;
      });
    }
  }

  getFoodItems(cname:string){
    let category =document.getElementsByClassName('category-name');
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

  toggleModel(modelName:string,panelName:string,bool:boolean){
    let panel = document.getElementById(panelName);
    let model = document.getElementById(modelName);
    let body = document.getElementsByTagName('body')[0];
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

  addCategory(category:Category){
    if(this.restaurant.categories && this.restaurant.categories.includes(category.cname+',')){
      Swal.fire({title:'Category present already!',icon:'error'});
    }else{
      this.restService.addCategory(category).subscribe(data=>{
        if(data=='Success' || data=='Already present!'){
          (this.restaurant.categories) ? this.restaurant.categories += category.cname+',' : this.restaurant.categories = category.cname + ',';
          this.restService.updateRestaurant(this.restaurant).subscribe(data=>{
            if(data=='Success'){
              Swal.fire({title:'Category added successfully!',icon:'success'});
              this.toggleModel('AddCategoryForm',"Panel2",false);
              this.getCategoriesByCnames();
            }else{
              Swal.fire({title:'Sorry!',text:data,icon:'error'});
            }
          });
        }else{
          Swal.fire({title:'Sorry!',text:data,icon:'error'});
        }
      });
    }
  }

  addFoodItem(){
    if(this.pic==undefined || this.fileSizeExceeded)return;
    this.food_item.rid = this.restaurant.rid;
    this.food_item.pic = this.pic.name;
    this.food_item.ratio=0;
    this.restService.addFoodItem(this.food_item).subscribe(data=>{
      (data=='Success')?this.restService.addFoodItemPic(this.pic).subscribe(data=>{
        (data=='Success')?Swal.fire({title:'Item added!',icon:'success'}):Swal.fire({title:data,icon:'error'});
      }):Swal.fire({title:data,icon:'error'});
      this.pic = undefined;
      if(data==='Success'){
        this.toggleModel('AddItemForm',"Panel2",false);
      }
    });
  }

  updateItem(item:Food_Item){
    if(this.fileSizeExceeded)return;
    if(this.pic!==undefined)this.item.pic = this.pic.name;
    this.restService.updateFoodItem(item).subscribe(data=>{
      if(data!=='Success'){
        Swal.fire({title:data,icon:'error'});
      }else if(this.pic!=undefined){
        this.restService.addFoodItemPic(this.pic).subscribe(data=>{
          if(data=='Success'){
            Swal.fire({'title':'Congratulations!',text:'Item updated successfully',icon:'success'})
            this.toggleModel('UpdateItemForm',"Panel2",false); 
          }else{  
            Swal.fire({title:data,text:'Failed to update',icon:'error'});
          }
        });
      }else{
        Swal.fire({'title':'Congratulations!',text:'Item updated successfully',icon:'success'});
        this.toggleModel('UpdateItemForm',"Panel2",false); 
      }
    });
  }

  validateSize(event){
    this.fileSizeExceeded=false;
    if(event.target.files.length===0)return;
    this.pic = event.target.files[0];
    if((this.pic.size/(1024*1024))>0.5)this.fileSizeExceeded=true;
  }

  toggleItemModel(modelName:string,item:Food_Item,bool:boolean){
    this.fileSizeExceeded=false;
    if(bool){
      this.item=item;
    }
    document.getElementById(modelName).style.display = (bool)?'block':'none';
  }

  deleteFoodItem(fid:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.restService.deleteItem(fid).subscribe(data=>{
          (data=='Success')?Swal.fire({title:'Item deleted!',icon:'success'}):Swal.fire({title:data,icon:'error'});
          if(data==='Success')location.reload();
        });
      }
    });
  }
}
